

$(function () {
  // 声明全局变量
  var currentPage = 1;
  var pageSize = 5;
  var currentId;
  var isDelete;
  render();
  // 1.向后台发送请求,动态的渲染表格
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
        console.log(info);
        var tableStr = template('tableTmp', info);
        $('tbody').html(tableStr);

        // 渲染分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(a, b, c,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          },
          itemTexts: function (type, page, current) {
            switch(type) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev": 
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          tooltipTitles: function(type, page, current) {
            switch(type) {
              case "page":
                return "请前往" + page +"页";
              case "first":
                return "请前往首页";
              case "last":
                return "请前往尾页";
              case "prev": 
                return "请前往上一页";
              case "next":
                return "请前往下一页";
            }
          },
          useBootstrapTooltip: true,
        })
      }
    })
  }

  // 2.点击显示模态框
  $('tbody').on('click', '.btn', function () {
    $('#btnModal').modal('show');
    // 获取到当前点击的按钮的id
    currentId = $(this).parent().data('id');
    // 修改状态
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })
  // 3.当用户点击模态框里面的确定按钮时,模态框消失,渲染当前页面
  $('.outBtn').click(function () {
    $.ajax({
      type: "post",
      url: "/user/updateUser",
      data: {
        id: currentId,
        isDelete: isDelete
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          $('#btnModal').modal('hide');
          render();
        }
      }
    })
  })

})