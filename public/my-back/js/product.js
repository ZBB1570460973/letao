

$(function () {
  var currentPage = 1;
  var pageSize = 5;
  // 声明一个空数组,用来存放图片
  var picArr = [];
  render();
  // 1.向后台发送ajax请求,请求数据,动态渲染到页面
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        var htmlStr = template('pro-tmp', info);
        $('tbody').html(htmlStr);
        

        // 分页初始化
        $('#pagintor').bootstrapPaginator({
          // 设置版本
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          size: "normal",
          onPageClicked: function (a,b,c, page) {
            // 更新当前页
            currentPage = page;
            render();
          },
          itemTexts: function (type, page, current) {
            switch (type) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last" : 
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },
          tooltipTitles: function (type, page, current) {
            switch(type) {
              case "page":
                return "请前往" + page + "页";
              case "first":
                return "请前往首页";
              case "last":
                return "请前往尾页";
              case "prev":
                return "前往上一页";
              case "next":
                return "请前往下一页"
            }
          },
          useBootstrapTooltip: true
        })
      }
    })
  }
  // 2.点击按钮,显示模态框
  $('#addBtn').click(function () {
    $('#addModal').modal("show");
    // 当点击的时候就去后台请求数据,动态的渲染二级下拉菜单
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template('cate-tmp', info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })
  // 3.下拉菜单中a注册点击事件,(通过事件委托)
  $('.dropdown-menu').on('click', 'a', function () {
    // alert(1);
    // 获取到文本
    var txt = $(this).text();
    // 赋值给input框
    $('.addText').text(txt);
    // 获取到id
    var id = $(this).data('id');
    // console.log(id);
    // 赋值给隐藏域的input
    $('[name="brandId"]').val(id);
    // 当文本内容已经上传时,需手动设置表单的校验状态
    $('#form').data('bootstrapValidator').updateStatus('brandId', "VALID");
  })
  // 4.文件上传的初始化
  $('#fileupload').fileupload({
    dataType: "json",
    done: function (e, data) {
      // console.log(data);
      // 将上传得到的图片名称和地址放在一个数组里面
      // 由于图片是从前面添加的, 所以用unshift
      picArr.unshift(data.result);
      // 获取到图片的地址,并赋值给imgd的src属性
      var imgUrl = data.result.picAddr;
      // 图片是从前面添加的
      $('#imgBox').prepend('<img src="' + imgUrl + '" width="100">');
      // 当图片的张数大于3张时,当前添加的图片在最前面,并且删除掉最先上传的那张
      if (picArr.length > 3) {
        // 数组里面要删除最后面的那个
        picArr.pop();
        // 最后一张图片也被删除
        $('#imgBox img:last-of-type').remove();
      }
      // 当图片上传了三张时,要手动设置表单的校验状态
      if (picArr.length === 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID');
      }
    }
  })
  // 5.校验表单的状态
  $('#form').bootstrapValidator({
    // 指定不校验的类型
    excluded:[],
    // 2.校验时的图表显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 3.校验字段
    fields: {
      // 二级分类
      brandId: {
        validators: {
          notEmpty: {
            message: "二级分类名称不能为空"
          }
        }
      },
      // 商品名称
      proName: {
        validators: {
          notEmpty: {
            message: "商品名称不能为空"
          }
        }
      },
      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "商品描述不能为空"
          }
        }
      },
      // 商品库存
      num: {
        validators: {
          notEmpty: {
            message: "库存不能为空"
          },
              //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须为非0数字'
          }
        }
      },
      // 商品尺码
      size: {
        validators: {
          notEmpty: {
            message: "商品尺码不能为空"
          },
              //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是xx-xx格式'
          }
        }
      },
      // 商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "商品原价不能为空"
          }
        }
      },
      // 商品现价
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
            message: "图片最少上传三张"
          }
        }
      }
    }
  })
  // 当表单校验成功时,注册表单校验成功事件,阻止表单的默认行为,通过ajax发送请求
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    // 获取表单的内容
    var formStr = $('#form').serialize();
    // 拼接图片的地址
    formStr += "&picAddr1" + picArr[0].picAddr + "&picName1" + picArr[0].picName;
    formStr += "&picAddr2" + picArr[1].picAddr + "&picName2" + picArr[1].picName;
    formStr += "&picAddr3" + picArr[2].picAddr + "&picName3" + picArr[2].picName;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: formStr,
      dataType: "json",
      success: function (info) {
        // console.log(info);
        if (info.success) {
          // 模态框消失
          $('#addModal').modal('hide');
          // 渲染第一页
          currentPage = 1;
          render();
          // 页面渲染完成重置表单
          $('#form').data('bootstrapValidator').resetForm(true);
          // 手动重置二级分类框
          $('.addText').text('请输入二级分类名');
          // 重置图片文本框,,直接移除
          $('#imgBox img').remove();
          // 数组里面的也要重置
          picArr = [];
        }
      }
    })
  })
})