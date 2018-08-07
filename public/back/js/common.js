
// 实现进度条功能测试
//// 开启进度条
// ajax全局事件
// 1. ajaxComplete() 每个ajax请求完成时调用 (不管成功还是失败都会调用)
// 2. ajaxError()   每个ajax失败时调用
// 3. ajaxSend()    每个ajax发送前调用
// 4. ajaxStart()   第一个ajax请求被发送时调用
// 5. ajaxStop()    全部的ajax请求完成时调用
// 6. ajaxSuccess() 每个ajax成功时调用
//在发送第一个ajax请求时,开启进度条
$(document).ajaxStart(function () {
  NProgress.start();
})
//当最后一个ajax发送结束时,,关闭进度条
$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  }, 1000);
})

$(function () {
  // 1.当点击分类管理按钮时,显示二级菜单
  $('.lt-aside .category').click(function () {
    $('.lt-aside .child').stop().slideToggle();
  })
  // 2.当点击退出菜单时,弹出模态框
  $('.icon-logout').click(function () {
    $('#logoutModal').modal('show');
  })
  // 3.当点击退出按钮时,退出模态框,跳转到登录页面
  $('.logoutBtn').click(function () {
    $.ajax({
      type: "get",
      url: "/employee/employeeLogout",
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 当成功时跳转页面到登录页
        if (info.success) {
          location.href = "login.html"
        }
      }
    })
    
  })

  // 4.当点击左边菜单按钮时,左边侧边栏慢慢消失,中间内容部分慢慢想左边拉伸
  $('.icon-menu').click(function () {
    $('.lt-aside').toggleClass('hiddenMenu');
    $('.lt-main').toggleClass('hiddenMenu');
    $('.lt-main .topbar').toggleClass('hiddenMenu');
  })
})

// 5. 判断用户是否登陆, 实现登陆拦截
//    前端不知道当前用户是否登录, 但是后台知道, 需要访问后台接口, 获取该用户登陆状态
//    (1) 用户已登陆, 让其继续访问
//    (2) 如果用户没登陆, 拦截到登陆页

// 一进入页面, 发送 ajax 请求, 获取当前用户登陆状态
// 如果是登陆页, 不需要登陆, 就可以访问, 不需要判断登陆状态
if (location.href.indexOf('login.html') === -1) {
  //等于-1,说明当前所在的页面不是登录页面,则需要进行拦截
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function (info) {
      // console.log(info);
      if (info.error === 400) {
        location.href = "login.html"
      }
    }
  })
}