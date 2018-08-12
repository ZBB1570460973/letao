
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];
  render();
  // 1.动态渲染表格
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var str = template('tableTmp', info);
        $('tbody').html(str);
        // 渲染分页
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
  // 2.点击添加商品按钮,显示模态框
  $('.add-cate').click(function () {
    $('#addModal').modal('show');
    // 渲染二级分类
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var str = template('sec-cate', info);
        $('.dropdown-menu').html(str);
      }
    })
  })
  //3. 通过事件委托,注册点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
  })
  // 4.文本初始化
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      console.log(data);
      picArr.unshift(data.result);
      var imgUrl = data.result.picAddr;
      $('#imgBox').prepend('<img src="' + imgUrl +  '" width="100">');
      if (picArr.length > 3) {
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if(picArr.length == 3) {
      $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
        
      }
    }
  });
  //5. 表单校验
  $('#form').bootstrapValidator({
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 校验字段
      fields: {
        brandId: {
          validators: {
            notEmpty: {
              message: "二级分类名不能为空"
            }
          }
        },
        proName: {
          validators: {
            notEmpty: {
              message: "商品名称不能为空"
            }
          }
        },
        proDesc: {
          validators: {
            notEmpty: {
              message: "商品描述不能为空"
            }
          }
        },
        num: {
          validators: {
            notEmpty: {
              message: "商品库存不能为空"
            },
            regexp: {
              regexp: /^[1-9]\d*$/,
              message: '库存必须是非零数字'
            }
          }
        },
        size: {
          validators: {
            notEmpty: {
              message: "商品尺码不能为空"
            },
            regexp: {
              regexp: /^\d{2}-\d{2}$/,
              message: '尺码必须是xx-xx格式'
            }
          }
        },
        oldPrice: {
          validators: {
            notEmpty: {
              message: "商品原价不能为空"
            }
          }
        },
        price: {
          validators: {
            notEmpty: {
              message: "商品现价不能为空"
            }
          }
        },
        picStatus: {
          validators: {
            notEmpty: {
              message: "请选择图片"
            }
          }
        },
      }
  
  })
  // 6.表单校验成功事件
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    var formStr = $('#form').serialize();
    formStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    formStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    formStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: formStr,
      dataType: "json",
      success: function (info) {
        console.log(1);  
        console.log(info);
        // 关闭模态框

      }
    })
  })
})