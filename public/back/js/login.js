$(function () {
  // 1. 进行表单校验配置
  //    校验要求:
  //        (1) 用户名不能为空, 长度为2-6位
  //        (2) 密码不能为空, 长度为6-12位
  $('#form').bootstrapValidator({
    // 设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //设置校验规则
    fields: {
      username : {
        validators: {
          notEmpty: {
            message: "用户名不能为空",
          },
          stringLength: {
            min: 2,
            max: 6,
            message:"用户长度为2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message:"密码长度为6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })
  // 2. 实现登录功能
  //    submit 按钮, 默认点击时会进行表单提交, 插件会在表单提交时进行检验
  //    (1) 如果校验成功, 页面会跳转, 我们需要阻止这次跳转, 通过ajax提交请求
  //    (2) 如果校验失败, 默认插件就会阻止这次提交跳转
  //注册表单校验成功事件, 在事件中阻止默认行为, 通过 ajax 进行提交请求
  $('#form').on('success.form.bv',function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      // 传递的数据是表单的数据,,所以要先获取到表单
      data: $('#form').serialize(),
      dataType: "json",
      success: function (info) {
        // console.log(info);
        // 判断是否登录成功
        if (info.success) {
          // 跳转到首页
          location.href = "index.html"
        }
        if (info.error === 1000) {
          // 如果用户名不存在, 需要将表单校验状态置成 校验失败 状态, 并提示用户
          $('#form').data('bootstrapValidator').updateStatus('username', 'INVALID', 'callback');
        }
        if (info.error === 1001) {
          // 如果密码错误,需要提示用户密码错误信息
          $('#form').data('bootstrapValidator').updateStatus('password', 'INVALID', 'callback');
        }
      }
    })
  })
  // 3. 解决重置按钮的bug
  // 给重置注册点击事件,当点击时重置表单,重置表单状态
  $('[type="reset"]').click(function () {
    // 重置表单,,bootstrap提供了方法
    $('#form').data('bootstrapValidator').resetForm();
  })
})