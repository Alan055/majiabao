const iframePostMessage = {
    doc : null,
    init(doc) {
        this.doc = doc;
        let data = {
            type: 'size',
            msg: {
                winH: window.innerHeight || document.documentElement.clientHeight,
                winW: window.innerWidth || document.documentElement.clientWidth,
                top: this.getPosition(this.doc),
            }
        }
        this.doc.contentWindow.postMessage(data, '*');

        // document.getElementsByClassName('.c-view-content')[0]
        document.getElementsByClassName('c-view-content')[0].addEventListener('scroll', this.fnScoll.bind(this), false);// 滚动
        document.getElementsByClassName('c-view-content')[0].addEventListener('touchmove', this.fnScoll.bind(this), false);// 滑动

    },
    getPosition(obj) {
        let t = obj.offsetTop;
        while (obj = obj.offsetParent) {
            t += obj.offsetTop;
        }
        return t
    },
    fnScoll(e) {
        let data = {
            type: 'scorll',
            msg: {
                scollY: e.target.scrollTop
            }
        }
        this.doc.contentWindow.postMessage(data, '*');
    },
};

export default iframePostMessage;