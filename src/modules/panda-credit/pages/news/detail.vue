<template lang="html">
    <div class="home-page-detail view c-view">
        <div class="c-view-content">
            <div class="title">{{item.title}}</div>
            <div class="nav">
                <div class="left">时间：{{item.createtime}}</div>
                <!-- <div class="right">阅读：{{item.through > 100000 ? '10万+' : item.through}}人</div> -->
            </div>
            <div class="content" v-html="item.content"></div>
        </div>
        <div class="copyright-bottom">
            <p>【版权声明】本文为网络转载文章，若有权属异议请联系我们删稿。您可以通过“{{appName2}}-在线客服”与我们取得联系。</p>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import api from "@/services/api";
    import util from "@/utils";
    import helper from "@/utils/helper";

    export default {
        data() {
            return {
                detailId: util.getParams("id") || "",
                item: {},
                data: [
                    {
                        id: "10001",
                        title: "为什么会有平台提前还款？",
                        source: "",
                        createtime: "5月16日",
                        content:
                            '<p><br/></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;网贷行业中个人信用借款仍旧占据主流，真实的还款包括了正常还款、逾期和提前还款三类，中，提前还款现象虽然网贷产品中占比不多，但对普通出借人识别资产仍有一定参考性，为什么会出现提前还款？</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><h2>出现提前还款的原因</h2><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;&nbsp;真实的借款人在初始借款时会对资金需求的时间做预判，这种预判和借款人实际的现金流状况往往会出现偏差，借款人的现金流状况满足需求时，就会促使借款人进行提前还款，借款人提前还款只需要偿还借款期间内的利息和剩余本金情况，无需为未来再支付利息，节约借款成本。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;&nbsp;网贷行业中借贷费率较高也是促使借款人优先提前归还借款的因素。除了平台收取的借款服务费外，网贷平台的资金往往由自然人提供，需要提供高额的利息补偿给到用户，第三方数据显示，2018年网贷行业的年化收益率为9.8%，这比银行贷款利率还要高出大半截，借款人当然会优先还给平台。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><h2>提前还款产生的问题</h2><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;&nbsp;目前大多数网贷平台均允许借款人进行提前还款，但提前还款仍属于一种违约，很多出借人并不喜欢提前还款，是因为其行为打破了用户的出借规划，对平台也是有一定利益损失的。因此很多平台为了阻止借款人的这一行为，要求借款人支付出借违约金，一些银行信用卡则更有手段，将分期手续费提前一次性收取。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">出现如此大的差异，结合该平台提前还款并不普遍的情况，说明该平台在2018年2月进行了提前还款主要目的为清理存量违规业务，而清理的违规存量业务存在如“超级放贷人”或者超过借款限额的可能。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><h2>提前还款的解决方式</h2><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;&nbsp;当前网贷平台的产品多为计划类理财，把将多个借款项目打包在一起整体发标，这其中就免不了有的人提前还款，有的人正常还款，还有的人逾期，这种情况下，平台这个时候只对提前还款的部分做兑付，对用户而言体验也不好。网贷平台目前的做法是将提前还款的资金做新的债权匹配，不影响用户出借端的体验。对于出借散标的用户，标的提前还款直接就会兑付了。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">一些平台也会按出借产品所匹配的真实债权情况进行兑付，虽然牺牲用户的优质体验和资金流失风险，但相对于排队债转的平台来说，一定程度上更显真实。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><h2>清算或良性退出</h2><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">&nbsp;&nbsp;&nbsp;&nbsp;为了符合监管层的要求，有时网贷平台在短期内会将不合规的业务处置清零，这个时候也会出现提前回款，但是为了合规而进行的积极举措。《关于加大通过互联网开展资产管理业务整治力度及开展验收工作的通知》就要求平台于2018年6月底前将互联网资产管理业务压缩至零。</span></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;"><span style="font-size:15px;color:#3F3F3F;">良性退出的平台也会提前回款，主要是对以往业务的提前结清，对这些不准备再从事网贷相关业务的机构来说，会采用提前拿出资金或找到机构收购债权，保障出借人的权益。当然，并不是所有的平台都会这么做。</span></p><p><br/></p>'
                    },
                    {
                        id: "10002",
                        title: "蚂蚁金服2019财年税前利润约为13.79亿元",
                        source: "",
                        createtime: "2019-05-16 18:09:40",
                        content:
                            '<p style="text-indent: 2em; text-align: left;"><span style="font-size: 16px;">阿里巴巴发布2019财年第四财季及全年财报，其中显示，支付宝全球用户突破10亿！</span></p><p style="text-indent: 2em; text-align: left;"><span style="font-size: 16px;">根据财报显示，阿里巴巴第四财季收入达934.98</span><a target="_blank"href="https://www.wdzj.com/juhe/180104/yyrmb44_12/"style="text-decoration: underline; font-size: 16px;"><span style="font-size: 16px;">亿元人民币</span></a><span style="font-size: 16px;">，本财年收入达3768.44亿元，同比增长均达51%。调整后EBITDA为251.7亿元人民币，市场预估229亿元人民币。</span></p><p style="text-indent: 2em; text-align: left;"><span style="font-size: 16px;">2019财年，</span><a target="_blank"href="http://baike.wdzj.com/doc-view-3075.html"style="text-decoration: underline; font-size: 16px;"><span style="font-size: 16px;">蚂蚁金服</span></a><span style="font-size: 16px;">支付给阿里巴巴集团的特许服务费和软件技术服务费为5.17亿元。按照此前约定的37.5%的分润协议计算，蚂蚁金服税前利润约为13.79亿元。</span></p><p style="text-indent: 2em; text-align: left;"><span style="font-size: 16px;">过去一年，支付宝在线下支付、交通出行、民生服务以及海外市场等持续进行战略投入，拉动支付宝用户量的逆势增长，全球用户突破10亿。</span></p><p style="text-align: left; text-indent: 0em;"><span style="font-size: 16px;">QuestMobile数据显示，支付宝月活用户在</span><a target="_blank"href="https://www.wdzj.com/dangan/search?filter=m2018"style="text-decoration: underline; font-size: 16px;"><span style="font-size: 16px;">2018年</span></a><span style="font-size: 16px;">11月已超6.5亿，且仍保持了50%以上的增长。目前微信月活11.12亿，支付宝已经成为国内仅次于微信的移动APP。</span></p>'
                    },
                    {
                        id: "10003",
                        title: "敲黑板！明星代言、租用高档办公场所的网贷平台跑路概率更大",
                        source: "",
                        createtime: "5月16日",
                        content:
                            '<div style="padding-bottom: 40px;"><p style="    text-align: left;  text-indent: 2em;"><span style=" ">5月15日是第十个全国公安机关打击和防范经济犯罪宣传日。在今年的打击和防范经济犯罪工作中，涉嫌非法集资的P2P平台成为了公安部关注的重点。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">据公安部门数据，自2018年起至2019年第一季度，全国公安机关共立非法集资、传销等涉众型经济犯罪案件近1.9万起，涉案金额4100亿元，先后成功侦破部督案件近40起，摧毁重大跨区域犯罪网络200余个，依法查办非法集资犯罪平台400余个，并从16个国家和地区将60余名在逃人员缉捕回国。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">除了加大对非法集资案件的打击力度外，公安部也邀请了相关领域的专家在讲座活动中进一步向群众揭露P2P网贷平台涉嫌非法集资的常见犯罪手法，详细介绍防骗知识和自救技巧。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=""><strong>不靠谱平台有何普遍特征？</strong></span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">中国人民公安大学李玫瑾教授直言，现在社会发展的太快，我们了解的速度跟不上社会发展的速度，如果一看产品存在请大明星代言、运营成本很高的特点，就不要轻易的动自己的钱袋子。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">“按照规定P2P平台不允许增信，不允许聘请明星代言，不允许归集资金形成资金池”，中央财经大学法学院教授郭华指出，如果投资前就发现平台有这些违规项目，那这个平台跑路的几率就很大了。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">“投资的时候更应该关心的不是平台给出的利率和平台的注册资本，更应该关心的是钱投给谁了，最后钱到底去哪里了”，国家处非联办银保监会打非局副处长徐和指出，“对于普通老百姓来说，投资收益超过6%的项目就要打个问号，超过8%的就已经非常危险了，一旦超过10%就要做好损失全部本金的准备。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">中国人民公安大学教授王铼也表达了同样的观点，她说，P2P平台应该是一个婚介所，婚介所要做的工作的是告诉我们一方有什么优势，另一方有什么缺点，确保信息的真实披露，所以我们应该去了解钱到底投了哪些项目，在投入项目之前平台做了哪些尽职调查，平台给出的利息是否足以支撑平台的运行。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=""><strong><span style="font-size: 15px; ">涉嫌非法集资的P2P公司有何常见“包装”手法和运作方式？</span></strong></span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">公安部经侦局涉众型经济犯罪侦查处副处长卢青山称，打出上市公司背景、投保额高、有明星代言等都是P2P平台自我包装的常规手段。在案件处理的过程当中，不法分子还会使用租用高档办公场所，斥巨资在主流媒体上发放广告、赞助大型体育赛事等手段。更有一些平台故意曲解国家政策，打着金融创新国家试点的旗号冒充新业态，或者把工商注册说成经国家有关部门的批准等。然而最后的实质都是借新还旧，拆东墙补西墙的庞氏骗局。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">“现实中更多的情况是，老百姓看到周围的亲戚朋友赚了钱之后蜂拥而至，而实际上，平台用的是后入场投资人的钱去支撑先进入的投资人的利息”，王铼说道，如果经过粗略计算，平台的运营成本已经达到30%以上了，那这个平台做什么样的生意能超过30%的收益率呢？</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">李玫瑾教师补充道，看得到的高利息，不只是后入场的投资人补充进来的资金，而是自己的本金，很多跑步平台的投资人只享受了一小部分高利率，但最后损失的是大部分本金。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">“实际上，很多涉嫌非法集资的P2P平台会想办法收购空壳公司，以发布虚假融资标的”，广州市公安局天河区分局经侦大队副中队长程武铭介绍，照目前市场行情看，收购一家带有营业执照、U盾、银行卡等一系列手续的空壳公司，六千元左右就够了。一些P2P平台用这些公司的名义在平台上放标借款，借到的资金会被犯罪嫌疑人第一时间通过取现或多层的转账方式，转移到自己控制的银行账户里。</span></p><p style="font-size:16px;text-align:justify;background-color:#FFFFFF;"><br/></p><p style="   text-align: left;  text-indent: 2em;"><span style=" ">最后，卢青山总结道，如果所有的P2P都按照严格的定义去运营的话，所有的法律关系和法律责任都是发生在出借人和借款人之间的，作为信息中介的P2P平台是不承担任何责任也不可能发生暴雷情况的。为什么P2P平台会暴雷？他们在发展的过程中偏离了信息中介的定位，投资人的资金被“截留”了。从目前的查处和打击情况来看，网贷平台暴雷的情况有所趋缓，但这个行业深层次的矛盾问题还没有解决，目前存量案件化解缓慢，增量风险规模巨大，特别是有一些规模巨大的单体，还处于一种风险失控的状态，我们目前对这个行业还是保持比较谨慎的态度。</span></p></div>'
                    },
                    {
                        id: "10004",
                        title: "暂停上市、投资者“围攻”乐视网被判“死缓”？",
                        source: "",
                        createtime: "2019-05-11 10:06:37",
                        content:
                            '<p style="color:#3E3E3E;text-align:justify;background-color:#FFFFFF;">\t<span style="font-size:15px;color:#3F3F3F;"></span></p><div class="page-summary" style="margin:0px;padding:15px;border:2px dotted #B4B4B4;font-size:14px;color:#333333;background-color:#FFFFFF;">\t<span class="t" style="line-height:1;">摘要</span> \t<div style="margin:0px;padding:0px;">\t\t据悉，乐视网停牌8个交易日后，5月10日，深交所下发暂停上市公告。\t</div></div><div class="page-content" style="margin:0px;padding:20px 0px;font-size:16px;color:#333333;background-color:#FFFFFF;">\t<p style="text-indent:2em;">\t\t据悉，乐视网<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/jhzt/180209/tp_140/">停牌</a>8个交易日后，5月10日，深交所下发<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180511/ztss_12/">暂停上市</a>公告。\t</p>\t<p style="text-indent:2em;">\t\t当晚，乐视网发布公告，称公司暂停上市起始日期为5月13日。而同一天，乐视网召开了<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/dangan/search?filter=m2018">2018年</a>业绩说明会。与日前仅有5分钟的<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170802/lsgdh_168/">临时股东会</a>相比，这次长达两小时的网上业绩说明会上，董事长刘淑青、总经理张巍和董事会秘书白冰回应了<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170517/tzz_168/">投资者</a>超过130个提问，涉及乐视网是否会退市，贾跃亭还钱以及融创掏空<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180511/ssgs_12/">上市公司</a>之嫌等问题。\t</p>\t<p style="text-indent:2em;">\t\t对于暂停上市后<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/gpjy_168/">股票交易</a>的问题，白冰表示，如果公司被交易所决定暂停上市后，后续<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/lswgp_168/">乐视网股票</a>将在<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-3025.html">全国中小企业股份转让系统</a>进行挂牌转让服务。\t</p>\t<p style="text-indent:2em;">\t\t<strong>乐视网滑向退市边缘？</strong> \t</p>\t<p style="text-indent:2em;">\t\t<strong>停止交易8天，深交所下发暂停<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180524/ssgg_12/">上市公告</a></strong> \t</p>\t<p style="text-indent:2em;">\t\t5月10日，深交所下发公告，称乐视网因触及本所《<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/cybgpssgz_168/">创业板股票上市规则</a>（2018年11月修订）》第13.1.1条规定的暂停上市情形，依据深交所<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180528/sswyh_12/">上市委员会</a>的审核意见，决定自2019年5月13日起暂停乐视网<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/gpss_168/">股票上市</a>。\t</p>\t<p style="text-indent:2em;">\t\t其后，乐视网于当日晚间发布暂停上市公告，称公司已采取措施及未来重点解决问题包括<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170801/dgd_168/">大股东</a>及其关联方应收款项、主要业务恢复、控制成本、费用支出，以及持续完善内控管理。乐视网称，将于每月前五个交易日内披露一次为<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180608/hfss_12/">恢复上市</a>所采取的措施及有关工作进展情况，同时披露<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/jhzt/180223/gp_140/">股票</a>可能存在<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180613/zzssd52_12/">终止上市的</a>风险提示公告。\t</p>\t<p style="text-indent:2em;">\t\t其实，乐视网暂停上市早已成定局。4月26日凌晨，乐视网发布2018年<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-4435.html">年报</a>，年报显示，乐视网去年归属于母<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170602/gsjzc_168/">公司净资产</a>为-30.26亿元。根据《<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/jhzt/180209/cyb_140/">创业板</a><a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/gpssgz_168/">股票上市规则</a>》，乐视网已触及“最近一个年度的财务会计报告显示当年年末经审计<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170531/jzc_168/">净资产</a>为负”条件，股票在4月26日起被停止交易，深圳证券交易所将在停牌后15个交易日内作出是否<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180529/ztgsgpss_12/">暂停公司股票上市</a>的决定。\t</p>\t<p style="text-indent:2em;">\t\t而年报发布后三天，乐视网收到证监会调查通知书，因公司及贾跃亭涉嫌<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-2987.html">信息披露</a>违法违规等行为，证监会决定对公司及贾跃亭立案调查。\t</p>\t<p style="text-indent:2em;text-align:center;"><div class="news-1004-img"><img src="https://img.wdzjimages.com/wdzjimages/prod/tmp/newsimages/1557541079809.JPEG?x-oss-process=style/newsimage" style="height:auto !important;" /></div> \t</p>\t<p style="text-indent:2em;">\t\t<strong>乐融致新估值为何从90亿到23亿？</strong> \t</p>\t<p style="text-indent:2em;">\t\t<strong>张巍称第三方评估机构采用收益法评估</strong> \t</p>\t<p style="text-indent:2em;">\t\t在乐视网是否会<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180613/bztss_12/">被暂停上市</a>的过程中，乐融致新的估值一直是焦点。为了避免被暂停上市，乐视网的管理层一直寻找解决方案，但最终只剩下让乐融致新出表这一条路。但遗憾的是，乐融致新的估值问题让这一计划破产。\t</p>\t<p style="text-indent:2em;">\t\t乐视网在今年2月公布业绩快报时曾就乐融致新的估值问题进行过测算，如果乐融致新按照去年9月拍卖时的估值18.72亿元计算，那么乐视网2018年<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170804/gsyssgsgddjlr_168/">归属于上市公司股东的净利润</a>为亏损20.26亿元，<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180622/gsyssgsgddsyzqy_12/">归属于上市公司股东的所有者权益</a>为-10.4亿元，公司将被暂停上市。\t</p>\t<p style="text-indent:2em;">\t\t而如果按照乐融致新57.66亿元的估值计算，乐视网2018年<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180628/gsyssgsgdd_12/">归属于上市公司股东的</a>净利润为亏损6.08亿元，<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170809/gsyssgsgd_168/">归属于上市公司股东</a>的所有者权益为3.77亿元，公司的<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180608/sszg_12/">上市资格</a>将得以保留。\t</p>\t<p style="text-indent:2em;">\t\t由于丧失乐融致新控制权导致其出表，乐视网将乐融致新从子公司变为合营企业，根据《企业会计准则》，乐视网对其持有的36.4%股权在丧失控制权日按乐融致<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170928/xg_168/">新股</a>权<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-3389.html">公允价值</a>进行重新计量，后续转为权益法核算。\t</p>\t<p style="text-indent:2em;">\t\t在2018年年报中，乐视网披露，其持有乐融致新36.4%的<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170526/gqjz77_168/">股权价值</a>约为8.41亿元，以此计算，乐融致新最终评估值为23.1亿元。\t</p>\t<p style="text-indent:2em;">\t\t然而有<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/">投资</a>者认为，乐融致新的估值不应该按权益法核算。乐视网去年发布半年报称，根据第三方评估机构出具的《估值报告》显示，以<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/dangan/search?filter=m2017">2017年</a>12月31日为评估基准日，乐融致新的估值为96.6亿元。此外，去年6月，腾讯、京东、融创、苏宁、TCL等多位投资者决定对乐融致新增资27.4亿，当时乐融致新的评估值为90亿元，这与年报中的估值相差甚远。\t</p>\t<p style="text-indent:2em;">\t\t5月10日召开的业绩说明会上，有多位投资者问及乐融致新估值评估方法，对此张巍也作出回应。他表示，此次第三方评估机构采用收益法评估结果，根据上述评估报告评估工作中对不同评估方法的选取过程，由于国内产权交易市场交易信息获取途径有限，即使同类企业在产品结构和<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-4890.html">主营业务</a>构成方面也存在差异，难以获取足够可对比上市公司或交易案例，所以本次评估不适用于市场法。\t</p>\t<p style="text-indent:2em;text-align:center;">\t\t<div class="news-1004-img"><img src="https://img.wdzjimages.com/wdzjimages/prod/tmp/newsimages/1557541079861.JPEG?x-oss-process=style/newsimage" style="height:auto !important;" /></div> \t</p>\t<p style="text-indent:2em;">\t\t<strong>乐融致新出表后还剩什么？</strong> \t</p>\t<p style="text-indent:2em;">\t\t<strong>乐视网将涉足短视频等创新业务</strong> \t</p>\t<p style="text-indent:2em;">\t\t虽然被深交所确定暂停上市，但乐视网在未来一年仍有机会复牌。明年4月提交2019年年报时，乐视网可根据自身情况选择向深交所提交恢复上市申请，不过需符合多项条件，包括最近一个<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-5240.html">会计年度</a>经审计的净利润和扣除非经常性损益后的净利润均为正值、期末净资产为正值。\t</p>\t<p style="text-indent:2em;">\t\t由于乐融致新出表，乐视网的业务只剩下广告业务、会员和发行业务，二者占公司总营收比例分别为10.75%和61.50%，是目前乐视网最重要的营收支柱，但去年这两项业务分别同比下降66.64%和71.37%，情况并不乐观。\t</p>\t<p style="text-indent:2em;">\t\t根据2018年年报，乐视网及其下属子公司累计实现营业收入15.58亿余元，其中运营业务（广告投放业务及付费业务）共计产生营业收入8.54亿余元，占比约54.825%；版权分销及电视剧发行收入2.71亿不到3亿元，占比约17.43%。\t</p>\t<p style="text-indent:2em;">\t\t张巍在业绩说明会上表示，去年公司管理层积极、持续与大股东及其关联方协商、谈判债务解决方案同时，不放弃通过业务恢复缓解自身流动资金压力、补充上市公司元气。此外，乐视网还通过与供应商谈判账期延后、申请<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/jhzt/dked/">贷款额度</a>、引入现金借款或增资等方式短期缓解<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180608/ssgszj84_12/">上市公司资金</a>困境。\t</p>\t<p style="text-indent:2em;">\t\t他还透露，乐视网正在尝试涉足短视频等创新业务，主要运用内容分发、原创视频营销、软广推广等运营模式开展业务，并形成一定规模收入。\t</p>\t<p style="text-indent:2em;">\t\t对于业务扩展问题，乐视网的管理层依然将问题归咎于贾跃亭。虽然乐视网和贾跃亭已达成债务金额的数量，但大股东及其关联方债务处理小组仍未拿出可实质执行的完整处理方案、未给出与上市公司共同解决债务问题的计划，上市公司未因债务解决方案获得任何现金，公司现金流极度紧张情况未得到改善。\t</p>\t<p style="text-indent:2em;">\t\t根据乐视网年报披露，截至2018年12月31日，<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180529/ssgshb62_12/">上市公司合并</a>范围内流动负债和非流动负债总规模约120亿元，其中供应商应付欠款约34亿左右，乐视网面临巨大的到期债务无法偿还压力。\t</p>\t<p style="text-indent:2em;">\t\t为数不多的好消息是，随着乐融致新出表，乐视网的债务和亏损压力大幅减少，而且乐融致新近期已经发布新品，智能电视销量的提振有助于乐视网的营收和利润反弹。按照乐视网和乐融致新的合作协议，智能电视的销售收入已经不再划入乐视网，但公司与乐融致新在会员业务方面的合作仍在继续，采用会员分成模式。\t</p>\t<p style="text-indent:2em;">\t\t<strong>5问乐视网</strong> \t</p>\t<p style="text-indent:2em;">\t\t<strong></strong> \t</p>\t<p style="text-indent:2em;">\t\t<strong>问：</strong><a id="neilianxitong" target="_blank" href="https://www.wdzj.com/jhzt/180124/lswsfhts_140/">乐视网是否会退市？</a>有没有重组的可能？\t</p>\t<p style="text-indent:2em;">\t\t<strong>答：</strong>如果公司被交易所决定暂停上市后，公司出现<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170613/cybssgz_168/">《创业板上市规则》</a>13.4.1规定相关情形，<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170505/gsgp_168/">公司股票</a>存在被<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/180522/zzss69_12/">终止上市</a>的风险。目前公司未有明确的资产或债务重组方案，如形成相关计划，公司将及时按照有关规定进行披露。\t</p>\t<p style="text-indent:2em;">\t\t<strong>问：</strong>乐视网方面现在还有哪方面盈利点，2019年资产能否转正？\t</p>\t<p style="text-indent:2em;">\t\t<strong>答：</strong>目前公司管理层工作重点放在业务恢复、控制成本、主张关联方<a id="neilianxitong" target="_blank" href="http://baike.wdzj.com/doc-view-415.html">债权</a>、偿还债务上。业务方面，乐视网原有的广告、会员及发行、技术服务等业务仍存续，公司也通过涉足部分创新业务以期补充现金流入缓解资金紧张压力；大股东及其关联方债务偿还进度直接影响公司2019年<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170531/zchfz_168/">资产和负债</a>结果。\t</p>\t<p style="text-indent:2em;">\t\t<strong>问：</strong>贾跃亭还钱了吗？\t</p>\t<p style="text-indent:2em;">\t\t<strong>答：</strong>公司一直在和大股东及其关联方协商处理债务解决方案，积极主张上市公司债权得到实现，但债务处理小组最终未拿出可实质执行的完整处理方案、未给出与上市公司共同解决债务问题的计划，上市公司未因债务解决方案直接获得任何现金。\t</p>\t<p style="text-indent:2em;">\t\t<strong>问：</strong>外界说融创有掏空上市公司的嫌疑，是否属实？\t</p>\t<p style="text-indent:2em;">\t\t<strong>答：</strong>融创为<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170807/lswdedgd_168/">乐视网第二大股东</a>，其作为<a id="neilianxitong" target="_blank" href="https://www.wdzj.com/juhe/170519/tzf_168/">投资方</a>与上市公司间发生的交易均已按照相关规定予以审议、披露。上市公司2018年合并范围归母净资产、归母净利润为负，主要是因为公司收入大幅萎缩、版权类资产和关联方应收款项减值较大造成的。不存在融创掏空乐视网的嫌疑和情况。\t</p>\t<p style="text-indent:2em;">\t\t<strong>问：</strong>乐视网现在是不是一个空壳，后续会不会有资产注进来？\t</p>\t<p style="text-indent:2em;">\t\t<strong>答：</strong>债务方面：截至2018年12月31日，上市公司合并范围内流动负债和非流动负债总规模约120亿元，其中供应商应付欠款约34亿左右，上市公司面临巨大的到期债务无法偿还压力。上市公司对大股东及其关联方的债权如得到实质性解决，可以一定程度缓解公司债务压力。\t</p></div><p>\t<br /></p><p style="color:#3E3E3E;text-align:justify;background-color:#FFFFFF;">\t<span style="font-size:15px;color:#3F3F3F;"></span></p>'
                    },
                    {
                        id: "10005",
                        title: "来看看股神巴菲特最近在朋友圈说了些什么？",
                        source: "",
                        createtime: "5月6日",
                        content:
                            '<p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;">	<span style="font-size:15px;color:#3F3F3F;"></span></p><p>	近日，在奥马哈举行的伯克希尔·哈撒韦公司股东大会可以说是万人瞩目。在此次大会上，股神巴菲特把他的“朋友圈”向全世界开放权限，并连发了好几条“朋友圈”，给大众留下了无穷的想象空间。</p><p>	现在，让我们来看看，巴菲特在朋友圈都说了些什么？</p><p>	<br /></p>1<span style="color:#31647F;line-height:1.4;"><p>	投资界的偶像当然要正经一点</p></span><p>	巴菲特和芒格都出席了这次伯克希尔·哈撒韦公司股东大会，并花了6个多小时回答了投资者的共55个问题。巴菲特作为投资界的偶像，在这几天发布的“朋友圈”，为自己打造了一个高大上的投资者形象。但巴菲特可不是光只会给自己立人设的人，他回答的这些问题牵涉到投资的方方面面，的确值得细细品味一番，举几个例子感受一下：</p><p>	<br /></p><p>	对于有没有计划在中国置产或投资公司的这一提问，巴菲特表示，我们已经开始在中国投资了，这是一个非常大的市场，我们喜欢大的市场，未来15年内也许会在中国做一些更大的部署；</p><p>	<br /></p><p>	比特币好像不怎么被股神青睐，甚至被巴菲特称作是“赌博设备”，他认为比特币就连唯一有限的用处都和欺诈活动有关，他甚至可以用一颗纽扣来发币。此处替被嫌弃的比特币默哀三分钟；</p><p>	<br /></p><p>	巴菲特还对苹果表示了自己的“不满”：苹果股价太贵了，希望能够更加便宜一点，这样就能买到更多了。吃瓜群众们此时开始流泪：贵是真的贵，但是就算再便宜，我们也买不起更多了；</p><p>	<br /></p><p>	在杠杆投资方面，巴菲特表示不会做杠杆投资。尽管做杠杆会赚更多的钱，但他依然目睹过一些更高智商的人因为杠杆化把生意做砸了。</p><p>	<br /></p><p>	巴菲特此次大方地展示出了自己的“朋友圈”，并通过回答问题的形式，给投资界圈内圈外人士都留下了许多值得探讨的内容，提供了风向标。这样来看，巴菲特还真是一位拥有“职业素养”的偶像啊。</p><p>	<br /></p><p>	2</p><span style="color:#31647F;line-height:1.4;"><p>	偶像是怎么保养的？喝可乐！</p></span><p>	在这次股东大会上， 除了巴菲特和芒格以及他们回答的问题之外，最吸引大众的是谁？不是巴菲特“朋友圈”里的大佬，不是某家引人注目的媒体，而是——可口可乐。</p><p>	<br /></p><p>	是的，你没有看错，可乐是这位投资界偶像的心头好。巴菲特曾自称每天都要喝5罐可乐，基本上不会喝水，爱吃DQ冰淇淋。在他看来，高糖、高盐的饮食会让自己心情愉悦，对于保持健康是大有益处的。</p><p>	<br /></p><p>	听到股神的这些话，快乐肥宅们表示：我们又可以放心地吃吃喝喝了。但大家好像太天真了，这种话难道我们从大佬们那里听得还不够多吗？不知道你的朋友圈有没有这样的人：每天在朋友圈里晒着吃喝玩乐，看上去好像一点也不努力，然而人家拍完风景就马上进图书馆努力学习，吃完美食转身就立刻进了健身房，巴菲特很可能就是这样的人。再加上可口可乐和DQ都是他投资的公司，他的这番言论就更值得玩味了。所以围观群众们，大佬们说的话，只要相信你就输了，很可能到最后你会发现，大佬们都有一身好看的肌肉，只有傻傻相信了他们的你又胖又穷。</p><p>	<br /></p><p>	此次巴菲特大方开放自己的“朋友圈”给全世界，引来了极大的关注。但投资界向来风云变幻，股神会不会很快就把自己的朋友圈设置为仅三天可见呢？这个问题，谁也说不清楚。</p><p>	<br /></p><p>	<br /></p><p style="color:#3E3E3E;font-family:Helvetica, Arial, sans-serif;font-size:16px;text-align:justify;background-color:#FFFFFF;">	<span style="font-size:15px;color:#3F3F3F;"></span></p>'
                    }
                ]
            };
        },
        mixins: [require("../../mixins").default],
        methods: {},
        created() {
            this.item = this.data.filter(res => {
                return res.id == this.detailId;
            })[0];
        },
        mounted() {
        },
        onBack() {
            this.$AppBridge.activityView({
                type: "close"
            });
        },
        filters: {}
    };
</script>

<style type="text/css">
    div.content p {
        line-height: 1.5 !important;
        font-family: Helvetica, Arial, sans-serif !important;
        color: #666 !important;

    }

    div.content p a {
        color: #666 !important;
    }

    div.news-1004-img img {
        width: 100%;
        display: block;
        margin: 10px auto;
    }

    p a {
        color: #4586EE;
    }
</style>
<style lang="scss" scoped>
    .home-page-detail {
        padding-bottom: 82px;
        .c-view-content {
            padding: 0 16px;

            overflow-x: hidden;
        }
        img {
            width: 100%;
        }

        .title {
            font-family: PingFangSC-Medium;
            padding: 12px 0px;
            font-size: 18px;
            color: #333;
            letter-spacing: 0.12px;
            text-align: left;
        }

        .nav {
            display: flex;
            color: #999;
            padding: 16px 0;
            justify-content: space-between;
        }
        .content {
            color: #666;
            text-align: justify;
            line-height: 22px;
            letter-spacing: 1px;
        }
        .copyright-bottom {
            position: absolute;
            bottom: 24px;
            border-radius: 4px;
            padding: 0 16px;
            p {
                background: #f5f5f5;
                font-family: PingFangSC-Regular;
                font-size: 12px;
                padding: 6px;
                color: #999999;
                letter-spacing: 0;
            }
        }
    }


</style>
