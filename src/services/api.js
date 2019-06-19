/* eslint-disable */

import rest from "./rest";
import {
    formData
} from "./rest";
import appBridge from "./AppBridge";
import util from "@/utils";

//外部请求的Api
const outsideApi = ['activity', 'offline', 'operation'];

const request = function(api, type, setting = {}) {

    /*if (type == "activity") {
     return function (data = {}, options) {
       return rest.activityRequest(api, data);
     };
   }  else {
     if (appBridge.isApp) {
       // if(true){
       // console.log(`appBrige`);
       return function (data = {}, options) {
         return rest.app(api, data, options);
       };
     } else {
       return function (data = {}, options) {
         return rest.webRequest(api, data);
       };
     }
   }
*/

    if (outsideApi.indexOf(type) != -1) {
        return function(data = {}, options) {
            return rest.outsideRequest({
                api,
                type,
                data,
                setting
            });
        };

    } else {
        if (appBridge.isApp) {

            // if(true){
            // console.log(`appBrige`);
            return function(data = {}, options) {
                return rest.app(api, data, options);
            };
        } else {
            return function(data = {}, options) {
                return rest.webRequest(api, data);
            };
        }
    }


};

const requestUser = function(api) {
    if (appBridge.isApp) {
        return function(data = {}, options = {}) {
            let config = util.extend({
                    json: false,
                    baseURL: process.env.apiUser
                },
                options
            );
            return rest.app(api, data, config);
        };
    } else {
        return function(data = {}, options = {}) {
            let config = util.extend({
                    baseURL: process.env.apiUser,
                    transformRequest: [
                        function(data, headers) {
                            // Do whatever you want to transform the data
                            return formData(data);
                        }
                    ],
                    headers: {}
                },
                options
            );
            return rest.webRequest(api, data, config);
        };
    }
};

export default {
    // api: request('/api'),
    login: requestUser("/sys/loginByCode"), // 登录接口
    loginCode: requestUser("/sys/sendPhoneCode"), // 登录验证码
    logout: requestUser("/sys/logout"), // 登出
    getRouterUrl: request("/sys/getRouterUrl"), // 获取配置信息
    getAgreementInfo: request("/sys/queryAgreementFields"), // 获取 协议信息
    queryPlans: request("/sys/queryPlans"), //查询文案接口
    publicInfo: {
        saveContact: request("/userBase/saveOrUpdateContact"),
        saveDetailInfo: request("/userBase/saveOrUpdateUserInfo"),
        saveUserInfo: request("/userBase/saveOrUpdateUserInfoNew"),
        saveIdCard: request("/userBase/saveOrUpdateIdCard"),
        getUserBaseInfo: request("/userBase/getUserBaseInfo"),
        query: request("/userBase/getUserBaseInfo"), //公共信息查询
        getLoanIntentionConfig: request("/userBase/getLoanIntentionConfig"), //公共信息-借款意向查询
        callFacePlus: request("/sys/face/idcard"), //face++识别接口
        newbiePackets: request("act/novice/queryWinRetention", 'operation'), //新手红包挽留弹窗

    },
    home: {
        queryMatchProduct: request("/match/queryMatchProduct"), //查询商户匹配结果的接口
        getMainPage: request("/loan/getMainPage"), //补件/返件母版页配置信息查询
        submitLoanApply: request("/loan/submitLoanApply"), //申请开户
        getHomePage: request("/loan/getHomePage"), //贷款首页信息查询
        getInfoHomePage: request("/loan/getInfoHomePage"), //贷款首页信息查询(资讯版马甲包专用)
        saveLoanApplyInfo: request("/loan/saveLoanApplyInfo"), //资料项信息保存
        queryDataItemDetails: request("/loan/queryDataItemDetails"), //资料项信息查询
        queryBankGroupResult: request("/bankCard/queryBankGroupResult"), //银行卡拼合匹配结果查询
        applyDetails: request("/offlineloan/applyDetails"), //三级商户(线下贷款)申请记录查询
        apply: request("/offlineloan/apply"), //三级商户(线下贷款)申请
        revoke: request("/offlineloan/revoke"), //三级商户(线下贷款)撤销
        updateTempEvent: request("/loan/updateTempEvent"), //首页贷款状态变更 动画完成通知
        offline: request("/loan/updateTempEvent", 'offline'),
        sesameInitPage: request("/loan/sesameInitPage"), //9.1.芝麻信用页面初始化
        sesameSendSms: request("/loan/sesameSendSms"), //芝麻信用短信发送
        sesameAuthSubmit: request("/loan/sesameAuthSubmit"), //9.3.芝麻信用授权信息提交
        sesameGetstatus: request("/loan/sesameGetstatus"), //轮询查询芝麻状态接口
        findMiaoxkZoneProductResult: request('/loan/findMiaoxkZoneProductResult'), //秒下款列表
        submitApplyForMiaoxk: request('/loan/submitApplyForMiaoxk'), // 秒下款提现
        initBankPage: request('/loan/creditCard/initBankPage'), //行用卡列表
        initLoginPage: request('/loan/creditCard/initLoginPage'), //信用卡登录
        acquireLoginInfo: request('/loan/creditCard/acquireLoginInfo'), //信用卡提交，
        initPageUrl: request('/credit/increase/initPageUrl'), // 获取提额路由接口
        //V1.1需求
        saveVivo: request("/userBase/saveVivo"),

        //首页接口拆分
        getApplyList: request('/loan/getApplyList'), //获取已申请列表
        getSecondProductList: request('/loan/getSecondProductList'), //二级商户列表
        getMXKConfig: request('/loan/getMXKConfig'), //获取秒下款配置
        getEntranceConfig: request('/loan/getEntranceConfig'), //获取三级商户（线下贷款）配置
        getRejectApplyList: request('/loan/getRejectApplyList'), //拒件列表

        queryHomePageWelfareInfo: request("/act/welfare/queryHomePageWelfareInfo", 'operation'), //福利红包
    },
    huiyi: {
        getInformation: request("/sys/getInformation"), //惠义app首页资讯
    },
    mxk: {
        getInfomationList: request("/sys/getInfomationList"), //猛下款资讯列表
        getInformationDetails: request("/sys/getInformationDetails"), //猛下款资讯详情接口
    },
    dictionary: request("/sys/getSystemDataByType"),
    // 协议接口
    agreement: {
        queryAgreement: request("/sys/queryAgreement"), // 获取协议列表
        queryContent: request("/sys/financeCommon") // 获取协议内容
    },
    //活动
    activity: {
        getApprovaling: request("/app/resources/getAppAdvertInfo", "activity"),
        getAppMarketInfo: request("/app/resources/getAppMarketInfo", "activity"),
        feedKing: request("/act/Marquee/feedKing", "activity")
    },
    bank: {
        getBankList: request("/bankCard/getBankList"), // 提供给客户端根据产品查询支持的银行接口
        getBankInfo: request("/bankCard/getBankInfo"), // 提供给客户端根据产品查询支持的银行接口
        saveBankCard: request("/bankCard/saveBankCard"), // 保存银行卡信息
        getUserBank: request("/bankCard/bankCardList"), // 获取用户名下的banklist
        getEmployerSupportBank: request("/sys/queryProductBank"), // 获取当前资方支持的用户已经绑定的银行卡
        queryBindBank: request("/sys/queryBindBank"), // 获取当前资方支持的用户已经绑定的银行卡
        queryBankProductList: request("/bankCard/queryBankProductList") //获取多姿方的银行卡地址
    },
    loan: {
        getWithdrawCashConfigPage: request(
            "/withdrawCash/getWithdrawCashConfigPage"
        ), // 查询提现配置信息的接口
        withdrawCash: request("/withdrawCash/withdrawCash"), //保存的接口
        matchProduct: request("/match/matchProduct"), //分流匹配的接口
        matchResult: request("/match/queryMatchProduct"), //查询商户匹配结果的接口
        queryStatusDeatitl: request("/credit/queryStatusDeatitl"), // 查询提现配置信息的接口
        getRejectedItems: request("/loan/getRejectedItems"), // 获取拒件记录
        calcRepaymentPlan: request("/withdrawCash/repaymentPlanTrial"), //计算还款计划
        saveQuestionnaire: request("/sys/saveUserResponse"), //保存贷款调查问卷接口

        jiufu: {
            calcRepaymentPlan: request("/sys/financeCommon"), //计算第三方还款计划(玖富)
            withdrawCash: request("/sys/financeCommon"), //玖富 提现
            saveTicket: request("/sys/financeCommon") //保存ticket
        },
        // 还款
        repayment: {
            config: request("/repay/applyRepaymentConfig"), //还款配置信息
            apply: request("/repay/saveApplyRepayment"), //申请还款
            state: request("/credit/queryStatusDeatitl"), //还款进度/结果
            disposable: request("/repay/queryOneRepayConfig") //还款进度/结果
        },
        progress: request("/credit/queryProgress") //贷款进度
    },
    sms: {
        send: request("/sys/sendSMS"),
        bindingCard: request("/sys/applyForBindingCard"), //鉴权接口
        withdrawSend: request("/withdrawCash/submitApplyPre"), // 提现 发送 短验
        repaySend: request("/repay/requestApply") // 还款 发送 短验
    },
    user: {
        // 帮助中心
        help: {
            typeList: requestUser("/sys/h5/helptypelist"), //banner和分类列表
            list: requestUser("/sys/h5/helplist"), //列表
            hotList: requestUser("/sys/h5/helphotlist"), //热门列表
            // detail: ({id}) => requestUser(`/sys/h5/helpview/${id}`)(),  //详情
            feedback: requestUser("/user/suggest"), //意见反馈
            noticeList: requestUser("/sys/msglist"), //公告信息
            saveHelpRel: requestUser("/sys/saveHelpRel") // 帮助中心问题详情有用/无用
        },
        // 我的银行卡
        bankCard: {
            list: request("/bankCard/myBankCardList") //我绑定的银行卡列表查询
        },
        // 我的消息
        message: {
            list: requestUser("/user/msglist"), //消息列表查询
            lists: request("/user/message/queryOneUserMessage", "activity"), //站内信列表查询
            ready: request("/user/message/modifyReadFlag", "activity"), //请求成功则为已读
            redDot: request("/redDot/useRedDot", "activity"), //红点查询
            redMove: request("/redDot/updateRedDotRead", "activity"), //消除查询
            msgType: request("/user/message/getLastMessageTypeByUser", "activity"), //最新一条消息类型
            readyPage: request("/user/message/updReadFlagByMessageType", "activity") //已读页面
        },
        // 我的账单
        bill: {
            index: request("/bill/loanBasePage"), //借款记录信息查询
            list: request("/bill/queryBillList"), //账单列表查询
            detail: request("/bill/queryBillDeatil") //账单详情查询
        },
        about: {
            checkUpdate: requestUser("/sys/checkUpdate") // 升级检查
        }
    },
    // 增信
    getTrust: {
        home: request("/sys/getTrustHomePage"), //增信主页详情信息
        validateUserInfo: request("/sys/validateUserInfo"), //检查用户信息状况接口

        operator: {
            operatorType: requestUser("/sys/getPhoneOperatorInfo"), //运营商类型（移动/联通/电信）
            saveOperatorMsg: request("/credit/saveOperatorMsg"), //运营商验证接口
            submitOperatorSms: request("/credit/submitOperatorSms"), //提交运营商验证码
            getOperatorSmscode: request("/credit/getOperatorSmscode"), //(重新)获取运营商验证码
            getOperatorAuthStatus: request("/credit/getOperatorAuthStatus") //获取运营商认证状态
        }
    },
    //熊猫资讯版
    pandaNews: {
        getInformationInfo: request("/information/getInformationInfo"), //资讯详情
        getInformationCommentList: request("/information/informationInfo/comment"), //资讯详情评论列表
        saveInformationLike: request("/information/like/save"), //点赞保存
        saveInformationLikeDel: request("/information/like/del"), //点赞删除
        saveInformationCollection: request("/information/collection/save"), //收藏保存
        saveInformationCollectionDel: request("/information/collection/del"), //收藏删除
        saveInformationComment: request("/information/comment/save"), //评论保存



    }
};
