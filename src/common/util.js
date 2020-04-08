
/**
 * @desc use requestAnimationFrame to limit render frequency
 */
export function rafThrottle (fn) {
  let locked = false;
  return function (...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame((_) => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

/**
 * @desc 时间戳格式化方法
 * @param timestamp {int} 时间戳(单位:毫秒/秒)
 * @param fmt {string} 返回时间格式 'yyyy-MM-dd hh:mm:ss EEE' -> 2018-12-27 12:02:02 星期五
 * @return {string} 时间字符串 '2018-12-27 12:02:02'
 */
export function formatTimeStamp (timestamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let seconds = parseInt(timestamp, 10) || 0;
  if (seconds && (`${seconds}`).length < 13) {
    seconds *= 1000;
  }

  const date = new Date(seconds);
  const o = {
    // 月份
    'M+': date.getMonth() + 1,
    // 日
    'd+': date.getDate(),
    // 小时
    'h+': date.getHours(),
    // 分
    'm+': date.getMinutes(),
    // 秒
    's+': date.getSeconds(),
    // 季度
    'q+': Math.floor((date.getMonth() + 3) / 3),
    // 毫秒
    S: date.getMilliseconds()
  };
  const week = {
    0: '\u65e5', // Sunday
    1: '\u4e00', // Monday
    2: '\u4e8c', // Quesday
    3: '\u4e09', // Wednesday
    4: '\u56db', // Thurseday
    5: '\u4e94', // Friday
    6: '\u516d' // Saturday
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  }

  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '（\u661f\u671f' : '（\u5468') : '（') +
      week[`${date.getDay()}`]}）`);
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  }
  return fmt;
}

/**
 * @desc 将空白字段['', undefined, null]转为横线'-'展示
 * @param param [any] 要转换的参数
 */
export function transEmpty2Line (param) {
  if (['', undefined, null].indexOf(param) > -1) {
    return '-';
  }
  return param;
}

/**
 * @desc 下载文件
 * @param url {string} 下载链接
 * @param name {string} 下载文件名
 */
export function downloadFile (url, name = '') {
  const a = document.createElement('a');
  a.setAttribute('download', '');
  a.setAttribute('target', '_blank');
  a.setAttribute('href', url);
  a.click();
}

/**
 * @desc check if text-overflow happened in dom
 */
export function isEllipsis (dom) {
  const checkDom = dom.cloneNode();
  checkDom.style.width = `${dom.offsetWidth}px`;
  checkDom.style.height = `${dom.offsetHeight}px`;
  checkDom.style.overflow = 'auto';
  checkDom.style.position = 'absolute';
  checkDom.style.zIndex = -1;
  checkDom.style.opacity = 0;
  checkDom.style.whiteSpace = 'nowrap';
  checkDom.innerHTML = dom.innerHTML;

  const parent = dom.parentNode;
  parent.appendChild(checkDom);
  const flag = checkDom.scrollWidth > checkDom.offsetWidth;
  parent.removeChild(checkDom);
  return flag;
}

/**
 * @desc check if overflow happened in el
 * @param {HTML Element} el
 */
export function isElementOverflowed (el) {
  const curOverflow = el.style.overflow;
  if (!curOverflow || curOverflow === 'visible') {
    el.style.overflow = 'hidden';
  }
  const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
  el.style.overflow = curOverflow;

  return isOverflowing;
}

/**
 * @desc get highest z-index on current page
 * @reference https://blog.csdn.net/FungLeo/article/details/80535029
 */
export function findHighestZIndex () {
  return [...document.all].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0);
}
