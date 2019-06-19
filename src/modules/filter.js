import Vue from 'vue'
import util from '@/utils'
import dictionary from './dictionary'

// 时间格式化
Vue.filter('format',util.format);

// 本地时间
Vue.filter('localTime', function (value) {
  let date = moment(value)
  if(! date.isValid()) {
    return ''
  }
  return date.calendar(null, {
    sameDay: '[今天] HH:mm',
    nextDay: 'YYYY-MM-DD HH:mm',
    nextWeek: 'YYYY-MM-DD HH:mm',
    lastDay: '[昨天] HH:mm',
    lastWeek: 'YYYY-MM-DD HH:mm',
    sameElse: 'YYYY-MM-DD HH:mm'
  })
});

// number 123,456,789
Vue.filter('money',util.moneyFormat);
//金额保持2位
Vue.filter('money2Fixed',function(value){
    let num = Number(value)
    if(!num && num !== 0) {
        return value
    }
    return num.toFixed(2);
});

/* 高亮
	Usage:
		{{{developer.developerName | highlight(q)}}}
*/
Vue.filter('highlight', function (value, str) {
    new RegExp('(' + str + ')', 'i').test(value);
    var highlight = RegExp.$1;
    return value.replace(new RegExp(highlight), '<span class="text-highlight">' + highlight + '</span>');
});

/* 替换
	Usage:
		{{str | replace('a', 'b')}}
*/
Vue.filter('replace', function (value, a,b) {
    if(value===undefined || value===null){
      return '';
    }
    return String(value).replace(a,b);
});

//银行卡尾号
Vue.filter('bank-tail-number', function (value) {
    let str = value + '';
    let length = str.length;
    return str.substring(length-4);
});

Vue.filter('bank-number-fortmat', function (value) {
    let str = value + '';
    return str.substr(0,4) + ' ****  **** ' + str.substr(str.length-4);
});

Vue.filter('mobile-fortmat-mask', function (value) {
    let str = value + '';
    return str.substr(0,3) + ' **** ' + str.substr(str.length-4);
});

//手机号格式化
Vue.filter('mobile-fortmat', function (value) {
    // 返回处理后的值
    let str = value + '';
    return str.substr(0,3) + ' **** ' + str.substr(str.length-4);
});

// filter from dictionary
for (let key in dictionary) {
  Vue.filter(key, function (value) {
    let match = dictionary[key].filter(item => item.value == value)[0]
    return match ? match.text : ''
  })
}