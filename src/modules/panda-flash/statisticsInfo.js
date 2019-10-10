import about from './pages/about/aboutAds';
import feedback from './pages/feedback/feedbackAds';
import message from './pages/message/messageAds';
import bill from './pages/bill/billAds';
import bankCard from './pages/bankCard/bankCardAds';
import news from './pages/news/newsAds';

// ����������è���� ���
let prefix_common = 'XM_pandaflash_diversionXmLoan_';

let diversionXmLoan = {
  billpopover: prefix_common + '01', // �˵������ع�
  billclick: prefix_common + '02', // �˵����������ת
  billclickclose: prefix_common + '03', // �˵���������ر�
  repaypopover: prefix_common + '04', // ������ع�
  repayclick: prefix_common + '05', // ����������ת
  repayclickclose: prefix_common + '06', // ���������ر�
  homepopover: prefix_common + '07', // ��ҳ�����ع�
  homeclick: prefix_common + '08', // ��ҳ���������ת
  homeclickclose: prefix_common + '09', // ��ҳ��������ر�
  homeTopclick: prefix_common + '10', // ��ҳ��������ر�
};


export default {
  about, feedback, message, bill, bankCard, news, diversionXmLoan
};
