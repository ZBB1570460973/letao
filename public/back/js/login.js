$(function () {
  $('#form').bootstrapValidator({
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
          }
        }
      }
    }
  })
})