
// 添加进度条
//setTimeout(function() {
//  // 关闭进度条
//  NProgress.done();
//}, 1000)


// ajax全局事件
// 1. ajaxComplete() 每个ajax请求完成时调用 (不管成功还是失败都会调用)
// 2. ajaxError()   每个ajax失败时调用
// 3. ajaxSend()    每个ajax发送前调用
// 4. ajaxStart()   第一个ajax请求被发送时调用
// 5. ajaxStop()    全部的ajax请求完成时调用
// 6. ajaxSuccess() 每个ajax成功时调用
// 当第一个请求发送时,开启进度条
$(document).ajaxStart(function () {
  NProgress.start();
})
// 最后一个请求完成时关闭进度条
$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  }, 1000)
})