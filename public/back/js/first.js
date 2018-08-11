

$(function () {
  // 声明全局变量
  var currentPage = 1;
  var pageSize = 5;
  render();
  // 1.表格的动态渲染
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
        console.log(info);
        var htmlStr = template('tableTmp', info);
        $('tbody').html(htmlStr);
        // 分页初始化
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          size:"normal",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          },
          itemTexts: function (type, page, current) {
            switch (type) {
              case 'page':
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
            switch (type) {
              case 'page':
                return "请前往" + page + "页";
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

  // 2.点击添加分类按钮,显示模态框
  $('.add-cate').click(function () {
    $('#addModal').modal('show');
  })
  // 3.表单校验
  $('#form').bootstrapValidator({
    // 表单的字体图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类名称"
          }
        }
      }
    }
  })

  // 4.注册表单校验成功事件
  $('#form').on('success.form.bv', function (e) {
    // 阻止表单的默认提交
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          currentPage = 1;
          $('#addModal').modal('hide');
          render();
          // 表单重置
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })
})