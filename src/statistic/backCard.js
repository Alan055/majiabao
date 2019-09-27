/**
 * desc:{ 返件以及补件部分的埋点信息 }
 */
// 返件 H1
let moduleName = 'DW_clickH1'

// 审批未通过 返件 20
let moduleBackCard = moduleName + '20' + '_';
// 通用补件
let moduleAddCard = moduleName + '30' + '_';
//玖富补件
let jiufuBackCard = moduleName + '40' + '_';
//额度失效，重新进件
let moduleLoseCard = moduleName + '50' + '_';

//对象生成器
function generator(module){
    return {
        //点击补件步骤的信息
        step:module + '0101',
        //点击协议 勾选项
        agreementCheck:module + '0102',
        //点击通用极速熊猫平台协议
        agreementGeneral:module + '0103',
        // 点击 相关协议
        agreementRelated:module + '0104',
        // 点击 提交 按钮
        submit:module + '0105',
        // 点击 返回
        level:module + '0106',
        // 点击 查看进度
        lookProgress:module + '0107',
        // 客服按钮
        lookHelp:module + '0108',
        // 弹框 关闭
        dialogClose:module + '0109',
        // 弹窗 我已经阅读
        dialogDone:module + '0110'
    }
};

export default {
    moduleBackCard:generator(moduleBackCard),
    moduleAddCard:generator(moduleAddCard),
    jiufuBackCard:generator(jiufuBackCard),
    moduleLoseCard:generator(moduleLoseCard)
}