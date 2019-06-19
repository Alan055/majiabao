<template lang="html">
  <div class="view">
    <div class="c-view-content">
      <div class="content c-font-m">

        <p>克什克腾旗农丰小额贷款有限责任公司（以下简称“农丰小贷”）成立于2016年，经内蒙古自治区人民政府金融工作办公室、赤峰市人民政府金融办公室、克什克腾旗金融办公室批准，在克什克腾旗开展农村牧区承包土地（草牧场）经营权抵押贷款等相关的金融业务。自成立以来，农丰小贷始终秉承“诚信经营，以人为本”的发展理念，设计并打造具有农牧地区特色的金融服务模式，专注为农牧民提供更加便捷、高效的规范化金融服务。</p>
  
        <p>农丰小贷，致力于强化克什克腾旗农牧区经济生态建设和提升“三农三牧”金融服务水平，通过优化审批手续、完善风控机制等方式，提高放款速度，及时满足客户资金流转需求。在农牧业生产环节上，农丰小贷覆盖了农牧民从农资采购与生产、加工和销售全产业链的金融服务；同时，公司还聚焦农牧民生活消费环节，为农牧民办理多样化信贷业务。</p>
        
        <p>目前，农丰小贷在服务“三农三牧”政策方针的指引下，已为克旗地区人民累计发放贷款金额过亿元；未来五年，农丰小贷将继续发扬“团结协作、务实创新、严谨高效”的企业精神，扩展内蒙地区服务范围，焕发农牧区金融活力，矢志成为“惠农惠牧、富农富牧”的金融服务集成商，引导并带动现代农牧业经济建设，成为推动金融行业发展的中坚力量。</p>
      </div>
    </div>
  </div>

</template>

<script>
import util from "@/utils";
export default {
	data() {
		return {
			pageTitle: "猛下款介绍"
		};
	},
	computed: {
		
	},
	mounted() {
		document.title = this.pageTitle;
		this.$root.setWebAttribute({
			title: this.pageTitle
		});
		this.$root.loadingClose();
	}
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
    width: 2px;
    background-color: #eee;
}
.content {
	font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 1px;
    line-height: 24px;
    padding: 20px;

	p {
		text-indent: 24px;
		margin-bottom: 20px;
		&.title {
			text-align: center;
			color: #333;
			font-size: 22px;
			text-indent: 0px;
		}
	}

	.no-m-b {
		margin-bottom: 0;
	}
	.red {
		color: rgb(255, 0, 0);
	}

	.drakblue {
		color: rgb(68, 84, 106);
	}

	.lightblue {
		text-indent: 0;
		margin-bottom: 8px;
		color: #333333;
		font-weight: 700;
	}
	.orange {
		color: rgb(237, 125, 49);
	}
	.strong {
		font-weight: 700;
	}

	.underline {
		text-decoration: underline;
	}
}
</style>

