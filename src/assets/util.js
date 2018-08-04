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

export function getCookie(val){
  var arr, reg = new RegExp("(^| )" + val + "=([^;]*)(;|$)");
  arr = document.cookie.match(reg);
  if (arr) {
      return unescape(arr[2]);
  } else {
      return null;
  }
}