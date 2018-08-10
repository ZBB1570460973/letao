$(function () {
  var currentPage = 1;
  var pageSize = 5;
  // 1.渲染表格
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      }, 
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template('tmp', info);
        $('tbody').html(htmlStr);

        // 渲染分页
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          // 点击页码时的回调函数
          onPageClicked: function (a, b, c, page) {
            // 跳转到当前点击的页面
            currentPage = page;
            // 渲染当前页
            render();
          }
        })
      }
    })
  }
  // 2.点击添加分类按钮,模态框显示
  $('#addBtn').click(function () {
    $('#secondModal').modal('show');
    // 在点击分类按钮时,就渲染下拉框数据,,获取全部的分类数据,
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
       var dropStr = template('dropDown', info);
       $('ul').html(dropStr);
        
      }
    })
  })
  // 3.给下拉菜单注册点击事件,通过事件委托
  $('.dropdown-menu').on('click', 'a', function () {
    //获取到点击的a标签的文本
    var txt = $(this).text();
    $('.addText').text(txt);
    //获取到id
    var id = $(this).data('id');
    // 把获取到的id设置给input
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");
  })
  //4. 获取图片,,文本初始化
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data);
      var imgUrl = data.result.picAddr;
      // 赋值给img的src属性
      $('#imgBox img').attr('src', imgUrl);
      // 赋值给input
      $('[ name="brandLogo"]').val(imgUrl);

      $('#form').data("bootstrapValidator").updateStatus("brandName", "VALID");
    }
});
  // 5.表单校验
  $('#form').bootstrapValidator({
     //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    //   我们需要对隐藏域进行校验, 所以不需要将隐藏域 排除到 校验范围外
    excluded: [],
      //小图标
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      // 校验规则
      fields: {
        categoryId:{
          validators: {
            notEmpty: {
              message: "一级分类不能为空"
            }
          }
        },
        categoryName:{
          validators: {
            notEmpty: {
              message: "二级分类不能为空"
            }
          }
        },
        brandName:{
          validators: {
            notEmpty: {
              message: "图片不能为空"
            }
          }
        }
        
      }
      // 隐藏域的文本校验要手动设置
  })
  // 6.阻止表单发送默认请求,通过ajax请求后台
  // 表单校验成功事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 模态框消失
          $('#secondModal').modal('hide');
          currentPage = 1;
          render();
          // 设置表单的状态
          $('#form').data('bootstrapValidator').resetForm(true);
          // 手动的设置隐藏内容的状态
          $('.addText').text("请输入一级分类名");
          $('#imgBox img').attr('src', "./images/none.png");
        }
      }
    })
  })
})