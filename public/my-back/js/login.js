$(function () {

  // 1.表单校验,当输入密码和用户名输错时,提示用户
  $('#form').bootstrapValidator({
      // 字体图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          // 判断不能为空
          notEmpty: {
            message: "用户名不能为空"
          },
          // 长度是2-6位
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在2-6位"
          },
          callback : {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          // 判断不能为空
          notEmpty: {
            message: "密码不能为空"
          },
          // 长度是2-6位
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })
  // 2.校验表单,阻止表单的默认提交行为,当表单的内容是正确的,跳转到首页
  $('#form').on('success.form.bv', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 判断状态码
        if (info.success) {
          location.href = "index.html"
        }
        if (info.error === 1000) {
          // 如果用户名不存在,要重置表单,提示用户用户名不存在
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        if (info.error === 1001) {
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
      }
    })
  })
  // 3.当点击重置按钮时,重置表单状态,重置表单内容
  $('[type="reset"]').click(function() {
    // 通过表单的实例化来重置
    $('#form').data('bootstrapValidator').resetForm();
  })
})