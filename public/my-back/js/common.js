
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
$(function () {
  // 1.点击按钮侧边栏二级菜单显示和隐藏
  $('.category').click(function () {
    $('.lt-aside .child').stop().slideToggle();
  })
  // 2.点击切换图标按钮,左边的侧边栏向左边慢慢消失,右边慢慢向左边滑动
  $('.icon-menu').click(function () {
    $('.lt-aside').toggleClass('hiddenMenu');
    $('.lt-main .topbar').toggleClass('hiddenMenu');
    $('.lt-main').toggleClass('hiddenMenu');
  })
  // 3.给退出按钮注册点击事件,当点击时,弹出模态框
  $('.icon-logout').click(function() {
    $('#logoutModal').modal('show')
  })
  // 4.点击退出按钮,退出模态框,重新发送ajax请求,退回到登录页面
  $('.logoutBtn').click(function () {
    $.ajax({
      url: "/employee/employeeLogout",
      type: "get",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          location.href = "login.html"
        }
      }
    })
  })
})
// 5.判断用户是否登录过,如果登录过,可以浏览,如果没有,要重新登录
// 如果一开始在的页面不是登录页面,也要登录
  if (location.href.indexOf("login.html") == -1) {
    $.ajax({
      type: "get",
      url: "/employee/checkRootLogin",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          console.log('已登陆')
        }
        if (info.error === 400) {
          location.href = "login.html"
        }
      }
    })
  }
