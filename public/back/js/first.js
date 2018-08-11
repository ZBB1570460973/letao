
$(function () {
  // 声明全局变量
  var currentPage = 
  // 1.表格的动态渲染
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {

      }
    })
  }
})