$(function () {
  var currentPage = 1;
  var pageSize = 5;
  // 1.渲染表格数据
  render();
 function render() {
  $.ajax({
    type: "get",
    url: "/category/queryTopCategoryPaging",
    data: {
      page: currentPage,
      pageSize: pageSize
    },
    dataType: "json",
    success: function (info) {
      // console.log(info);
      // 模板引擎和后台返回数据结合
      var htmlStr = template('tmp', info);
      $('tbody').html(htmlStr);

      // 分页初始化
      
      $("#pagintor").bootstrapPaginator({
        // 版本
        bootstrapMajorVersion: 3,
        // 当前页
        currentPage: info.page,
        totalPages: Math.ceil(info.total / info.size),
        // 当点击页码时,重新渲染当前页
        // 传四个参数
        onPageClicked: function (a, b, c, page) {
          // console.log(page);
          // 页码更新
          currentPage = page;
          //重新渲染当前页
          render();
        }
      })
    }
  })
 }
//  2.点击添加分类按钮,显示模态框
 $('#addBtn').click(function () {
   $('#firstModal').modal("show");
 })
//  3.当点击模态框的添加按钮时,校验表单是否为空,获取用户输入的一级分类,动态渲染在
//表格里面,清空模态框
//  校验表单
 $('#form').bootstrapValidator({
    //小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验规则
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类不能为空"
          }
        }
      }
    }
 })

//  4.阻止表单默认提交的行为
 $('#form').on('success.form.bv', function (e) {
  e.preventDefault();
  // 通过ajax发送请求
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          // 模态框隐藏
          $('#firstModal').modal('hide');
          // 重新渲染当前页面
          currentPage = 1;
          render();
        }
      }
    })
 })
})