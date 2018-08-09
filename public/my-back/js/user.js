// 当渲染数据时,发送ajax请求
$(function () {
  // 定义全局变量
  var currentPage = 1;//当前页
  var pageSize = 5;//当前页显示的条数
  var currentId;
  var isDelete;
  render();
  // 1.发送ajax请求后台数据,动态的渲染表格内容
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 渲染模板引擎
        var tableStr = template('tmp', info);
        $('tbody').html(tableStr);


        // 分页的初始化
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
        
      }
    })
  }

  // 2.点击禁用和启用按钮,弹出模态框,,因为这两个按钮是动态渲染的,所以要注册事件委托
  $('tbody').on("click", ".btn", function() {
    // alert(1);
    // 模态框显示
    $('#userModal').modal("show");
    // 获取到用户的id,jquery中提供了获取自定义属性的方法 data
    currentId = $(this).parent().data("id");
    // 判断用户点击的按钮
    // 1 表示 已启用, 0 表示 已禁用, 传给后台 几, 后台就设置该用户状态为 几
    // 如果是禁用按钮, 说明需要将该用户置成禁用状态, 传 0
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })
  // 3.点击模态框里面的确认按钮,改变禁用和启用的状态,重新渲染当前页面
  $('.userBtn').click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          // 关闭模态框
          $('#userModal').modal("hide");
          // 重新渲染当前页面
          render();
        }
      }
    })
  })
})