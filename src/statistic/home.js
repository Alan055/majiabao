// 首页 H1
let moduleName = "DW_clickH1";
// 首页show H1 
let moduleShow = "DW_showH1";

let livingBodyModuleName = "DW_livingBody_";

// 首页 00
let moduleHomePage = moduleName + "00" + "_";

let homePage = {
    // 未登录 01
    unlogedin: {
        // link: moduleHomePage + '0101'
    },
    // 已登录 02
    logedin: {},
    // 产品推荐 03
    recommend: {}
};

// 公共信息（三步资料） 01
let modulePublicInfo = moduleName + "01" + "_";

//一级补件
// let moduleLevel1 = moduleName + '01' + '_';

let publicInfo = {
    // 身份信息 01
    idCard: {
        // 提交 01
        submit: modulePublicInfo + "0101",
        // 返回 02
        back: modulePublicInfo + "0102",
        // 残忍离开 03
        leave: modulePublicInfo + "0103",
        // 继续申请 04
        continue: modulePublicInfo + "0104",
        // 相机授权自定义提示 05
        permission: modulePublicInfo + "0105",

        // 人像面 06
        pos: modulePublicInfo + "0106",
        // 国徽面 07
        opp: modulePublicInfo + "0107",
        // 人像国徽面（蒙层）,点击后拍摄人像面然后自动拍摄国徽面 08
        mask: modulePublicInfo + "0108",
        // 身份证号码输入 09
        idNumber: modulePublicInfo + "0109",
        // 身份证姓名输入 10
        idName: modulePublicInfo + "0110",
        // 人脸识别 11
        face: modulePublicInfo + "0111",

        //新手红包步骤1 放弃红包
        newbieWaive_1: modulePublicInfo + "0112",

        //新手红包步骤1 继续申请
        newbieNext_1: modulePublicInfo + "0113",

        //新手红包步骤2 放弃红包
        newbieWaive_2: modulePublicInfo + "0114",

        //新手红包步骤2 继续申请
        newbieNext_2: modulePublicInfo + "0115",

        //新手红包步骤3 放弃红包
        newbieWaive_3: modulePublicInfo + "0116",

        //新手红包步骤3 继续申请
        newbieNext_3: modulePublicInfo + "0117",

    },

    //活体相关埋点
    livingBody: {

        //face++ 人脸识别失败
        faceError: livingBodyModuleName + "1001",

        //依图人脸识别失败
        yiTuError: modulePublicInfo + "1002",

        //进入活体中转页
        enter: modulePublicInfo + "1003",

        //离开活体中转页
        leave: modulePublicInfo + "1004",

    },

    // 联系人信息 02
    contacts: {
        // 提交 01
        submit: modulePublicInfo + "0201",
        // 返回 02
        back: modulePublicInfo + "0202",
        // 残忍离开 03
        leave: modulePublicInfo + "0203",
        // 继续申请 04
        continue: modulePublicInfo + "0204",
        // 通讯录授权自定义提示 05
        permission: modulePublicInfo + "0205",

        // 家人 06
        family: modulePublicInfo + "0206",
        // 朋友 07
        friend: modulePublicInfo + "0207",
        // 同事 08
        colleague: modulePublicInfo + "0208",
        // 婚姻状况 09
        maritalstatus: {
            //点击婚姻状况
            marriage: modulePublicInfo + "0209",
            //点击 直系亲属关系
            relationShip: modulePublicInfo + "0210",
            //点击直系亲属选择
            relationShipClick: modulePublicInfo + "0211",
            // 点击配偶
            spouse: modulePublicInfo + "0212"
        }
    },

    // 基本信息 03
    userBasicInfo: {
        // 提交 01
        submit: modulePublicInfo + "0301",
        // 返回 02
        back: modulePublicInfo + "0302",
        // 残忍离开 03
        leave: modulePublicInfo + "0303",
        // 继续申请 04
        continue: modulePublicInfo + "0304",
        // 定位授权自定义提示 05
        permission: modulePublicInfo + "0305",

        // 确认提交 06
        confirm: modulePublicInfo + "0306",
        // 再次核对 07
        cancel: modulePublicInfo + "0307",

        // 学历 08
        degree: modulePublicInfo + "0308",
        // 婚姻 09
        marriage: modulePublicInfo + "0309",
        // 月收入 10
        income: modulePublicInfo + "0310",
        // 是否有信用卡 17
        hascreditcard: modulePublicInfo + "0317",
        // 单位名称 11
        companyName: modulePublicInfo + "0311",
        // 期望借款金额 12
        amount: modulePublicInfo + "0312",
        // 居住地址 13
        homeCity: modulePublicInfo + "0313",
        // 详细居住地址 14
        homeAddress: modulePublicInfo + "0314",
        // 工作地址 15
        companyCity: modulePublicInfo + "0315",
        // 详细工作地址 16
        companyAddress: modulePublicInfo + "0316"
    }
};
//推荐首页
let recommend = {
    //借款款
    records: {
        openBtn: modulePublicInfo + "0401"
    },

    //获取二级推荐
    multiApply: {
        open: modulePublicInfo + "0402", //打开二级申请页面
        openSingle: modulePublicInfo + "0405", //打开二级单商户申请页面
        downArr: modulePublicInfo + "0601", // 产品展开按钮
        leave: modulePublicInfo + "0602", // 返回按钮
        step: modulePublicInfo + "0603", //步骤信息
        agreemtnList: modulePublicInfo + "0604", //协议信息
        agreementRelated: modulePublicInfo + "0605", //点击相关协议
        agreeCheck: modulePublicInfo + "0606", // 协议勾选框
        // dialog 点击 关闭
        dialogClose: modulePublicInfo + "0607",
        // dialog 点击我已阅读并确认
        dialogreadingDone: modulePublicInfo + "0608",
        submit: modulePublicInfo + "0609" // 立即申请按钮
    },
    //TODO
    newCard: {
        click: modulePublicInfo + "0409" // new卡点击
    },
    //线下贷款
    offline: {
        openUrl: modulePublicInfo + "0403",
        applyamount: modulePublicInfo + "0501", //申请金额点击
        name: modulePublicInfo + "0502",
        mobile: modulePublicInfo + "0503",
        assets: modulePublicInfo + "0504",
        style: modulePublicInfo + "0507", //工资发放形式
        agreement: modulePublicInfo + "0505",
        submit: modulePublicInfo + "0506",
        revoke: modulePublicInfo + "0508", //撤销申请
        applydeadline: modulePublicInfo + "0509" //贷款期限
    },
    // 被拒页面
    refuse: {
        open: modulePublicInfo + "0404",
        clickBanner: modulePublicInfo + "0702", //banner点击
        clickInfo: modulePublicInfo + "0703",
        click: modulePublicInfo + "0701" // 拒件记录点击
    },
    // 一级申请页面
    level1: {
        open: modulePublicInfo + "0408", //打开二级申请页面
        downArr: modulePublicInfo + "0801", // 产品展开按钮
        leave: modulePublicInfo + "0802", // 返回按钮
        step: modulePublicInfo + "0803", //步骤信息
        agreemtnList: modulePublicInfo + "0804", //协议信息
        agreeCheck: modulePublicInfo + "0807", // 协议勾选框
        agreeRelated: modulePublicInfo + "0811", // 协议勾选框
        submit: modulePublicInfo + "0808", // 立即申请按钮
        // dialog 点击 关闭
        dialogClose: modulePublicInfo + "0809",
        // dialog 点击我已阅读并确认
        dialogreadingDone: modulePublicInfo + "0810",

        //新手红包一级商户 放弃红包
        newbieWaive_level1: modulePublicInfo + "0811",

        //新手红包一级商户 继续申请
        newbieNext_level1: modulePublicInfo + "0812",

    },
    entryCard: {
        // 合并
        merge: {
            open: modulePublicInfo + "0901" //点击商户
        },
        // 银行卡列表
        list: {
            open: modulePublicInfo + "1001", //点击银行卡信息
            addBtn: modulePublicInfo + "1002" //点击添加银行卡按钮
        },
        // 银行卡信息c
        card: {
            scanBank: modulePublicInfo + "1101", //点击扫描银行卡信息
            bank: modulePublicInfo + "1102", //点击银行卡开户行
            city: modulePublicInfo + "1103", //点击开户城市
            mobile: modulePublicInfo + "1104", //点击手机号
            submit: modulePublicInfo + "1105", // 点击提交
            agreement: modulePublicInfo + "1106", //协议勾选点击
            openAgreement: modulePublicInfo + "1107" // 打开协议
        }
    },
    //消息中心
    message: {
        help: modulePublicInfo + "0406",
        mess: modulePublicInfo + "0407"
    },
    //客服
    online: {
        kefu: modulePublicInfo + "1406",
    },
    videoData: {
        scan: modulePublicInfo + "1401",
        submit: modulePublicInfo + "1402"
    },
    success: {
        level1: modulePublicInfo + "1501",
        level2: modulePublicInfo + "1502",
        level1Ad: modulePublicInfo + "1503",
        level2Ad: modulePublicInfo + "1504"
    },
};

//  秒下款
let miaodai = {
    list: {
        cilck: modulePublicInfo + "2001"
    },
    create: {
        amountmoney: modulePublicInfo + "2002",
        cilckdate: modulePublicInfo + "2003",
        submit: modulePublicInfo + "2004",
        closeHome: modulePublicInfo + "2005",
        callphone: modulePublicInfo + "2006",
        details: modulePublicInfo + "2007",
        clickAgreementCheck: modulePublicInfo + "2008",
        clickAgreementLink: modulePublicInfo + "2009",
        clickAgreementItem: modulePublicInfo + "2010",
    },
    //秒下款首页
    recommendIndex: {
        open: modulePublicInfo + "2010", // // 点击按钮打开连接
    },
}

let moduleRedEnvelope = moduleName + "02" + "_";
//推荐首页
let redEnvelope = {
    index: {
        showFiexd: moduleRedEnvelope + "0101", // 右上角红包显示
        clickFiexd: moduleRedEnvelope + "0102", // 右上角红包点击
        showDialog: moduleRedEnvelope + "0103", // 红包弹框显示
        clickdialogBtn: moduleRedEnvelope + "0104", // 红包弹框立即查看按钮
        closedialogBtn: moduleRedEnvelope + "0105", // 红包弹框关闭按钮点击
    },
    //借款款
    records: {
        showRedBagCell: moduleRedEnvelope + "0201", // 红包收入cell显示
        clickRedBagCell: moduleRedEnvelope + "0202", // 红包收入cell点击
        showRedBagBottom: moduleRedEnvelope + "0203", // 二级商户红包入口显示
        clcikRedBagBottom: moduleRedEnvelope + "0204", // 二级商户红包入口点击
    },
};

let moduleTabLife = moduleName + "03" + "_";
let tabLife = {
	pageShow: moduleTabLife + '0101', // tab3生活页面  页面曝光
	bannerClick: moduleTabLife + '0102', // tab3生活页面  页面曝光
	cellClick: moduleTabLife + '0103', // tab3生活页面  页面曝光
}

let rentmobile = {
    recommend: {
        show: moduleShow + '10_0101', //显示
        mobileClick: moduleName + '10_0102', //点击手机
    }
};

export default {
    homePage,
    publicInfo,
    recommend,
    miaodai,
    redEnvelope,
	tabLife,
    rentmobile,
};