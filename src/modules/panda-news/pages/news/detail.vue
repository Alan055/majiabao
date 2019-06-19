<template lang="html">
    <div class="home-page-detail view c-view">
        <div class="c-view-content" v-show="data.content">
            <div class="m-content">
                <div class="el-title">{{data.title}}</div>
                <div class="el-nav">
                    <div class="el-left">
                        <span class="el-source">{{data.source}}</span>
                        <span class="el-time">{{data.releasetime}}</span>
                    </div>
                    <!-- <div class="right">阅读：{{data.through > 100000 ? '10万+' : data.through}}人</div> -->
                </div>
                <div class="el-content" v-html="data.content"></div>
                <div class="el-author" v-show="data.editor">负责编辑：{{data.editor}}</div>
                <div class="el-good">
                    <img :src="require(`../../assets/images/news/good-${Number(data.islike) ? 'activate' : 'gay'}.png`)" @click="handleGoodClick"/>
                    <div class="el-good-count">{{data.likenum}}</div>
                </div>
            </div>
            <div class="m-comment">
                <div class="el-title" ref="commentRef">热门评论</div>
                <div class="el-comment-list" v-if="data.commentList.length > 0">
                    <div class="el-list-item" v-for="(item, i) in data.commentList" :key="i">
                        <div class="el-head-url">
                            <img class="he-auto-img" :src="require('../../assets/images/news/no-head.png')" />
                        </div>
                        <div class="el-right-content">
                            <div class="el-name">{{item.createby}}</div>
                            <div class="el-time">{{getDateDiff(item.commenttime)}}</div>
                            <div class="el-content" v-if="!item.contentShowAll">
                                {{item.comment.length >= 25 ? item.comment.substr(0, 25) : item.comment}}
                                <span v-if="item.comment && item.comment.length > 25" class="el-content-pull" @click="handleCommentPull(1, i)">展开全部</span>
                            </div>
                            <div class="el-content" v-else>
                                {{item.comment}}
                                <span class="el-content-up" @click="handleCommentPull(2, i)">收起</span>
                            </div>
                        </div>
                    </div>
                    <div class="el-comment-more" v-if="data.commentList.length < data.commentListTotal" @click="handleMoreClick">查看更多评论</div>
                    <div class="el-comment-nomore" v-else>已经到底了！</div>
                </div>
                <div class="el-no-data" v-else>
                    <img src="../../assets/images/news/no-comment.png" />
                    <p class="desc">暂无评论</p>
                    <div class="el-btn-area" @click.stop="handleInitInputClick" v-if="token">
                        <input class="el-nodata-hiddeninput"/>
                        <mt-button type="primary" size="normal" class="btn-round btn-empty handle-button">
                            点击抢占沙发
                        </mt-button>
                    </div>
                </div>
            </div>
            <div class="m-bottom-space"></div>
        </div>
        <div class="m-mask" v-show="inputStatus == 1"></div>
        <div class="m-bottom el-input-status0" v-if="token" v-show="inputStatus == 0">
            <div class="el-input-left">
                <img src="../../assets/images/news/edit-comment.png" />
                <input name="inputHidden" @click.stop="handleInitInputClick" placeholder="发表评论"/>
            </div>
            <div class="el-icon-right">
                <div class="el-icon-item el-comment-area" @click="handleCommentScrollClick">
                    <!-- <input class="el-comment-hiddeninput"/> -->
                    <img src="../../assets/images/news/comment-no.png" />
                </div>
                <div class="el-icon-item el-like-area" @click="handleLikeComment">
                    <img :src="require(`../../assets/images/news/like-${Number(data.iscollection) ? 'yes' : 'no'}.png`)" />
                </div>
                <!-- <div class="el-icon-item el-copy-area" @click="handleCopyComment">
                    <img src="../../assets/images/news/copy-no.png" />
                </div> -->
            </div>

        </div>
        <div class="m-bottom el-input-status1" v-show="inputStatus == 1">
            <div class="el-bottom-header">
                <div class="el-cancel" @click="handleTextAreaBlur(100)" >取消</div>
                <div class="el-enter" @click="handleSubmitComment" >发送</div>
            </div>
            <textarea maxlength="50" v-model="commentContent" class="el-bottom-content" ref="textareaRef" @blur="handleTextAreaBlur" name="inputHidden" placeholder="发表评论…"></textarea>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import api from "@/services/api";
import util from "@/utils";
import helper from "@/utils/helper";
import { Toast } from "@/utils/helper";

export default {
  data() {
    return {
      informationid: util.getParams("informationid") || "",
      token: util.getParams("token") || "",
      pageIndex: 1,
      pageSize: 5,
      inputStatus: 0, //键盘的状态 0初始，1弹起
      commentContent: "", //评论框内容
      data: {
        islike: "0", //是否点赞
        iscollection: "0", //是否收藏
        title: "",
        source: "",
        editor: "",
        releasetime: "",
        likenum: 0,
        content: "",
        commentList: [],
        commentListTotal: 0
      }
    };
  },
  mixins: [require("../../mixins").default],
  methods: {
    //初始化文本框点击
    handleInitInputClick() {
      console.log("初始化文本框点击");
      this.inputStatus = 1;
      setTimeout(() => {
        this.$refs.textareaRef.focus();
      }, 50);
    },
    //评论框失焦
    handleTextAreaBlur(time) {
      setTimeout(() => {
        this.inputStatus = 0;
      }, time || 1000);
    },
    //发表评论
    handleSubmitComment() {
      console.log("点击发表评论");
      if (!this.informationid) return;
      if (!this.token) {
        Toast("请先登录");
        return;
      }
      if (!this.commentContent) {
        Toast("请输入评论");
        return;
      }
      api.pandaNews
        .saveInformationComment({
          informationid: this.informationid,
          token: this.token,
          comment: this.commentContent
        })
        .then(res => {
          if (!helper.isSuccess(res)) return;
          this.commentContent = "";
          this.getInformationCommentList(1, "saveComment");
          Toast("发表评论成功");

          this.$refs["commentRef"].scrollIntoView({
            behavior: "smooth"
          });
        });
    },
    //点赞
    handleGoodClick() {
      console.log("点击点赞");
      if (!this.informationid) return;
      if (!this.token) {
        Toast("请先登录");
        return;
      }
      this.data.islike = Number(this.data.islike) ? "0" : "1";
      if (this.data.islike == "1") {
        api.pandaNews
          .saveInformationLike({
            informationid: this.informationid,
            token: this.token
          })
          .then(res => {
            if (res.code == 200) {
              Toast("点赞成功");
              this.data.likenum += 1;
            } else {
              Toast("点赞失败");
            }
          });
      } else {
        api.pandaNews
          .saveInformationLikeDel({
            informationid: this.informationid,
            token: this.token
          })
          .then(res => {
            if (res.code == 200) {
              Toast("取消点赞成功");
              this.data.likenum -= 1;
            } else {
              Toast("取消点赞失败");
            }
          });
      }
    },
    //收藏
    handleLikeComment() {
      if (!this.informationid) return;
      if (!this.token) {
        Toast("请先登录");
        return;
      }
      this.data.iscollection = Number(this.data.iscollection) ? "0" : "1";
      if (this.data.iscollection == 1) {
        api.pandaNews
          .saveInformationCollection({
            informationid: this.informationid,
            token: this.token
          })
          .then(res => {
            if (res.code == 200) {
              Toast("收藏成功");
            } else {
              Toast("收藏失败");
            }
          });
      } else {
        api.pandaNews
          .saveInformationCollectionDel({
            informationid: this.informationid,
            token: this.token
          })
          .then(res => {
            if (res.code == 200) {
              Toast("取消收藏成功");
            } else {
              Toast("取消收藏失败");
            }
          });
      }
    },
    //转发
    handleCopyComment() {
      this.$AppBridge.setClipboardData({
        data:
          window.location.href.split("?")[0] +
          "?informationid=" +
          this.informationid
      });
      Toast("复制成功");
    },
    //获取资讯详情
    getInformationInfo() {
      if (!this.informationid) return;
      return new Promise((resolve, reject) => {
        api.pandaNews
          .getInformationInfo({
            informationid: this.informationid
          })
          .then(res => {
            if (!helper.isSuccess(res)) return;
            if (res.data) {
              this.data = Object.assign({}, this.data, res.data);
              console.log("getInformationInfo this.data", this.data);
              resolve(this.data);
            }
          });
      });
    },
    //获取资讯评论列表
    getInformationCommentList(pageIndex, from) {
      if (!this.informationid || !this.token) return;
      return new Promise((resolve, reject) => {
        api.pandaNews
          .getInformationCommentList({
            informationid: this.informationid,
            pageIndex: pageIndex || this.pageIndex,
            pageSize: this.pageSize
          })
          .then(res => {
            if (!helper.isSuccess(res)) return;
            if (res.data) {
              res.data.comments = res.data.comments.map(item => {
                return Object.assign(item, {
                  contentShowAll: false
                });
              });
              if (pageIndex) {
                if (pageIndex == 1 && from == "saveComment") {
                  this.data.commentList.splice(0, 0, res.data.comments[0]);
                  console.log("res.data.comments[0]", res.data.comments[0]);
                  /*this.data.commentList = res.data.comments[0].concat(
                    this.data.commentList
                  );*/
                } else {
                  this.data.commentList = this.data.commentList.concat(
                    res.data.comments
                  );
                }
              } else {
                this.data.commentList = res.data.comments;
              }
              this.data.commentListTotal = res.data.total;

              console.log(
                "getInformationCommentList this.data.commentList",
                this.data.commentList
              );
              resolve(this.data.commentList);
            }
          });
      });
    },
    //查看更多
    handleMoreClick() {
      this.pageIndex += 1;
      this.getInformationCommentList(this.pageIndex);
    },
    //展开收起
    handleCommentPull(type, i) {
      console.log("type", type);
      console.log(
        "this.data.commentList[i]",
        this.data.commentList[i].contentShowAll
      );
      this.data.commentList[i].contentShowAll = type == 1;
    },
    handleCommentScrollClick() {
      this.$refs["commentRef"].scrollIntoView({
        behavior: "smooth"
      });
    },
    //时间格式化
    getDateDiff(date) {
      if (typeof date === "string") {
        date = new Date(Date.parse(date.replace(/-/g, "/")));
      } else if (typeof date === "object") {
        date = date.getTime();
      }

      var result = "",
        differentValue = new Date().getTime() - date;

      if (differentValue < 0) {
        return "穿越时空";
      }

      var minute = 1000 * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7,
        month = day * 30, //且都用30天算
        year = month * 12;

      if (differentValue / year >= 1) {
        result = parseInt(differentValue / year) + "年前";
      } else if (differentValue / month >= 1) {
        result = parseInt(differentValue / month) + "月前";
      } else if (differentValue / week >= 1) {
        result = parseInt(differentValue / week) + "周前";
      } else if (differentValue / day >= 1) {
        result = parseInt(differentValue / day) + "天前";
      } else if (differentValue / hour >= 1) {
        result = parseInt(differentValue / hour) + "小时前";
      } else if (differentValue / minute >= 1) {
        result = parseInt(differentValue / minute) + "分钟前";
      } else {
        result = "刚刚";
      }

      return result;
    }
  },
  async activated() {
    await this.getInformationInfo();
    await this.getInformationCommentList();
  },
  mounted() {},
  onBack() {
    this.$AppBridge.activityView({
      type: "close"
    });
    this.$AppBridge.notify({ tag: "refresh" });
  },
  directives: {
    //自定义的v-focus指令
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          //el.focus();
        }
      }
    }
  },
  filters: {}
};
</script>

<style lang="scss" scoped>
.home-page-detail {
  .c-view-content {
    .m-content {
      padding: 0 16px;

      .el-title {
        font-family: PingFangSC-Medium;
        padding: 12px 0;
        font-size: 22px;
        color: #333333;
        letter-spacing: 0.12px;
        text-align: left;
      }

      .el-nav {
        display: flex;
        color: #999;
        justify-content: space-between;

        .el-left {
          .el-source {
          }
          .el-time {
            padding-left: 16px;
          }
        }
      }
      .el-content {
        color: #666;
        text-align: justify;
        line-height: 22px;
        letter-spacing: 1px;
        padding-top: 18px;
      }
      .el-author {
        padding-top: 14px;
        font-size: 14px;
        color: #999999;
      }

      .el-good {
        margin: 24px auto;
        width: 72px;
        height: 72px;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 6px 0;
        text-align: center;

        img {
          height: 38px;
        }

        .el-good-count {
          margin-top: -5px;
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }

  .m-comment {
    border-top: 8px solid #f8f8f8;
    .el-title {
      padding: 16px;
      font-size: 16px;
      color: #333333;
    }
    .el-comment-list {
      .el-list-item {
        display: flex;
        padding: 16px;
        &:not(:last-child) {
          @extend %border-b;
        }

        .el-head-url {
          width: 56px;

          img {
            width: 48px;
          }
        }
        .el-right-content {
          flex: 1;
          text-align: left;

          .el-name {
            font-size: 16px;
            color: #333333;
          }
          .el-time {
            font-size: 14px;
            color: #999999;
          }
          .el-content {
            margin-top: 8px;
            font-size: 14px;
            color: #333333;
            position: relative;
          }
          .el-content-pull {
            color: #3d8aff;

            &:before {
              content: "...";
              display: inline-block;
              color: black;
              margin-right: 2px;
            }
          }
          .el-content-up {
            color: #3d8aff;
          }
        }
      }
      .el-comment-more {
        background: #ffffff;
        margin: 0 15px;
        //@extend %border-t;
        padding: 16px 0;
        font-size: 14px;
        color: #3d8aff;
        text-align: center;
      }
      .el-comment-nomore {
        background: #f8f8f8;
        padding: 32px 0;
        font-size: 14px;
        color: #999999;
        text-align: center;

        /*&:before {
          content: "";
          position: relative;
          height: 1px;
          width: 32px;
          background-color: #bfbfbf;
          display: inline-block;
          top: -4px;
          right: 4px;
        }
        &:after {
          content: "";
          position: relative;
          height: 1px;
          width: 32px;
          background-color: #bfbfbf;
          display: inline-block;
          top: -4px;
          left: 4px;
        }*/
      }
    }
    .el-no-data {
      text-align: center;
      img {
        display: block;
        margin: 0 auto;
        height: 110px;
        width: 160px;
      }
      .desc {
        font-size: 14px;
        color: #999999;
        margin-bottom: 10px;
      }
      .btn-empty {
        font-size: 14px;
        color: #3d8aff;
        border: 1px solid #3d8aff;
        border-radius: 4px;
        padding: 2px 11px !important;
        height: 34px;
      }
      .el-nodata-hiddeninput {
        position: absolute;
        width: 105px;
        height: 34px;
        border: 0;
        opacity: 0;
        z-index: 2;
      }
      .el-btn-area {
        margin-bottom: 20px;
      }
    }
  }

  .m-mask {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .m-bottom {
    &.el-input-status0 {
      background: #ffffff;
      box-shadow: 0 -1px 5px 0 rgba(0, 0, 0, 0.05);
      position: fixed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 16px;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
    }

    .el-input-left {
      display: flex;
      align-items: center;
      padding: 4px 0;
      flex: 1;
      margin-right: 20px;
      background: #f2f2f2;
      border-radius: 18px;
      img {
        margin-left: 16px;
        margin-top: -2px;
        width: 16px;
        height: 16px;
      }
      input {
        background: #f2f2f2;
        border-radius: 18px;
        width: 100%;
        border: 0;
      }
    }
    .el-icon-right {
      width: 64px;
      display: flex;
      justify-content: space-between;

      .el-comment-hiddeninput {
        position: absolute;
        width: 24px;
        border: 0;
        opacity: 0;
      }
      .el-icon-item {
        width: 24px;

        img {
          width: 100%;
        }
      }
    }

    &.el-input-status1 {
      position: relative;
      z-index: 999;
      padding: 16px;
      background: #ffffff;
      border-radius: 8px 8px 0 0;
      .el-bottom-header {
        @extend %border-b;
        display: flex;
        justify-content: space-between;
        padding-bottom: 16px;

        .el-cancel {
          width: 50%;
          font-size: 16px;
          color: #999999;
        }
        .el-enter {
          width: 50%;
          text-align: right;
          font-size: 16px;
          color: #3d8aff;
        }
      }
      .el-bottom-content {
        height: 100px;
        width: 100%;
        border: 0;
        padding: 16px 0;
      }
    }
  }

  .m-bottom-space {
    display: block;
    height: 80px;
    background: #f8f8f8;
  }
}
</style>
