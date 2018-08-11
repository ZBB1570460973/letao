

$(function () {
  var currentPage = 1;
  var pageSize = 3;
  // 1.表格的动态渲染
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
          }
        
        })
      }
    })

  }

  // 2.点击添加分类按钮,显示模态框
  $('.add-cate').click(function () {
    $('#addModal').modal('show');
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);    
        var Str = template('cateTmp', info);
        $('.dropdown-menu').html(Str);
      }
    })
  })
  //3. 点击下拉的二级分类菜单,展示在页面上
  $('.dropdown-menu').on('click', 'a', function () {
    // 获取到文本
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    // 获取到id,赋值给隐藏的input框
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);
    // 手动恢复二级菜单的校验状态
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
  })
  // 4.文件初始化
  $('#fileupload').fileupload({
    dataType: "json",
    done: function (e, data) {
      console.log(data);
      var imgUrl = data.result.picAddr;
      $('#imgBox img').attr('src', imgUrl);
      $('[name="brandLogo"]').val(imgUrl);
      // 手动恢复图片的校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
    }
  })
  // 5.表单校验
  $('#form').bootstrapValidator({
      //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "一级分类不能为空"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "二级分类不能为空"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择图片"
          }
        }
      }
    }
  })
  // 6.表单校验成功事件,阻止表单的默认提交事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    // 通过ajax发送请求
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          // 模态框隐藏 
          $('#addModal').modal('hide');
          // 重新渲染当前页面
          currentPage = 1;
          render();
          $('#form').data('bootstrapValidator').resetForm(true);  
          // 手动恢复二级菜单和文本的状态
          $('#dropdownText').text('请输入一级分类名称');
          $('#imgBox img').attr('src', './images/none.png');
        }
      }
    })
  })
})