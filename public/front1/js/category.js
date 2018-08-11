

$(function() {
  // 1.左边导航的渲染
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      // console.log(info);
      var htmlStr = template('leftTmp', info);
      $('.lt-left-nav ul').html(htmlStr);
      // 一进入页面就渲染一级分类的第一个二级分类
      // 根据id进行渲染
      renderSecond(info.rows[0].id);
    }
  })
  // 2.给左边导航注册点击事件,获取到当前点击的id(事件委托)
  $('.lt-left-nav').on('click', 'a', function () {
    // 当前点击的元素添加current类名
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');
    var id = $(this).data('id');
    renderSecond(id);
  })
  // 渲染二级分类
  function renderSecond(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var Str = template('rightTmp', info);
        $('.lt-right-pro ul').html(Str);
      }
    })
  }
})