import rest from '@/services/rest'
import util from '@/utils'
import AppBridge from '@/services/AppBridge'
import axios from 'axios'
import { Toast, Indicator } from "@/utils/helper";

class PageControl {
    constructor(option) {
        var defaults = {
            source: null,
            aborted: false,
            loading: false,
            refreshing: false,
            hasNextPage: true,
            badNetwork: false,
            pageStart: 0,
            pageSize: 10,
            api: '',
            type: 'post',
            keyPath: ['data'],
            dataList: [],
            initialized: true
        }
        util.extend(this, defaults, option)
        this.params = {
            pageIndex: this.pageStart,
            pageSize: this.pageSize
        }
    }

    onRefresh() {

    }
    onLoadMore() {

    }
    getParams() {
        return {};
    }
    extendParams(params = {}) {
        params = util.extend({}, this.params, this.getParams(), params);
        return params;
    }
    getKeyPath(res) {
        var path = res;
        for (var key of this.keyPath) {
            if (path[key]) {
                path = path[key];
            } else {
                return [];
            }
        }
        return path || [];
    }
    request(params) {
        this.abortXHR();

        let request
        if (typeof this.api == 'string') {
            request = () => {
                return rest[this.type](this.api, params)
            }
        } else {
            // function
            request = this.api
        }

        this.source = axios.CancelToken.source()
        this.aborted = false

        params = this.extendParams(params);
        return request(params, {
            config: {
                cancelToken: this.source.token
            }
        }).finally(() => {
            // 在上次请求未结束时发出新的请求，取消上次请求(aborted)，此时新的请求还未结束，仍为请求状态(loading)
            if (!this.aborted) {
                this.refreshing = false;
                this.loading = false;
            }
        })
    }
    abortXHR() {
        // 取消请求
        if (this.loading) {
            this.aborted = true;
            this.source.cancel()
        }
    }
    refresh(loadingFlag = true) {

        if (loadingFlag) {
            Indicator.open()
        }
        this.badNetwork = false;
        this.refreshing = true;
        this.request({
            pageIndex: this.pageStart
        }).then(res => {

            if (Number(res.code) === 200) {
                var data = this.getKeyPath(res);
                this.params.pageIndex = this.pageStart;
                this.hasNextPage = (data.length == this.params.pageSize);
                this.dataList = data;
                this.onRefresh(res, data);
            } else {
                if (this.dataList && !this.dataList.length) {
                    /*AppBridge.goNative({
                      pkg: 'error'
                    })*/
                } else {
                    Toast('访问人数过多,请稍后重试');
                }
            }

        }).catch(() => {
            if (!this.aborted) {
                this.dataList = [];
                this.badNetwork = true;
            }
            if (this.dataList && !this.dataList.length) {
                /*AppBridge.goNative({
                  pkg: 'error'
                })*/
            } else {
                Toast('访问人数过多,请稍后重试');
            }
        }).finally(() => {
            if (loadingFlag) {
                Indicator.close()
            }
        })
    }
    loadMore() {
        this.loading = true;
        this.request({
            pageIndex: this.params.pageIndex + 1
        }).then(res => {

            if (Number(res.code) === 200) {
                var data = this.getKeyPath(res);
                this.hasNextPage = (data.length == this.params.pageSize);
                if (data.length) {
                    this.params.pageIndex++;
                    this.dataList = this.dataList.concat(data);
                    this.onLoadMore(res, data);
                }
            } else {
                Toast('访问人数过多,请稍后重试');
            }

        }).catch(e => {
            Toast('访问人数过多,请稍后重试');
        })
    }
    scroll(event) {
        clearTimeout(this.scrollTimer);
        if (!this.hasNextPage || this.loading) return;
        var that = this;
        this.scrollTimer = setTimeout(function() {
            var scrollTop = event.target.scrollTop
            var maxScroll = event.target.scrollHeight - event.target.clientHeight
                //如果滚动接近底部
            if (scrollTop + 10 > maxScroll) {
                that.loadMore();
            }
        }, 50);
    }
    set(option) {
        util.extend(this, option);
    }
    reset(option) {
        this.abortXHR();
        var defaults = {
            loading: false,
            hasNextPage: true,
            badNetwork: false,
            dataList: []
        }
        util.extend(this, defaults, option);
        this.params.pageIndex = this.pageStart
    }
    init(option = {}) {

    }

}

export default PageControl;
