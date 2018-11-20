const digitsRE = /(\d{3})(?=\d)/g

// 金额数据格式化
export function currency (value, currency, decimals) {
  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  decimals = decimals != null ? decimals : 2
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') +
    _float
}

// 获取cookie值
export function getCookie(val){
  var arr, reg = new RegExp("(^| )" + val + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr) {
      return unescape(arr[2]);
  } else {
      return null;
  }
}

export function getFormatTime(d){
    if(d.length<20) return null;
    var str = '';
    str = str.replace(/ GMT.+$/, ''); // Or str = str.substring(0, 24)
    var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for (var i = 0, len = a.length; i < len; i++) {
      if (a[i] < 10) {
        a[i] = '0' + a[i];
      }
    }
    str = a[0] + '-' + a[1] + '-' + a[2] + ' '+a[3]+':'+a[4]+':'+a[5] ;  //年-月-日
    return str;
}


Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}