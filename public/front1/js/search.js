
$(function () {
  render();
  // 约定键名时history-list
  // 功能1: 历史记录渲染功能
  // (1) 读取本地历史, 得到 jsonStr
  // (2) 将 jsonStr 转换成 数组
  // (3) 通过数组, 进行页面渲染(模板引擎)
  // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
  // var jsonStr = JSON.stringify( arr );
  // localStorage.setItem( "search_list", jsonStr );
  function getHistory() {
    var history = localStorage.getItem("search_list") || "[]";
    // 转化为数组
    var arr = JSON.parse(history);
    // 返回数组   
    return arr
  }
  function render() {
    var arr = getHistory();
    var htmlStr = template('histTmp', {arr: arr});
    $('.lt-history').html(htmlStr);
  }

  // 功能2: 清空历史记录功能
  // (1) 通过事件委托给清空记录绑定点击事件
  // (2) 清空, 将本地的 search_list 移除, removeItem(key);
  // (3) 重新渲染页面
  $('.lt-history').on('click', '.btn-empty', function () {
    // 弹出确认框
    mui.confirm('您确定要删除全部的历史记录吗?', '温馨提示', ['取消', '确定'], function (e) {
     console.log(e);//e的index为1和0   1 说明按下的是确认键
      // 判断按下的是否是确认键
      if (e.index == 1) {
       localStorage.removeItem('search_list');
        render();
      }
    });

  })

   // 功能3: 删除单条历史记录
  // (1) 事件委托绑定点击事件
  // (2) 将下标存在删除按钮中, 点击后获取下标
  // (3) 读取本地存储, 拿到数组
  // (4) 根据下标, 从数组中将该下标的项移除,  splice
  // (5) 将数组转换成 jsonStr
  // (6) 存到本地存储中
  // (7) 重新渲染
  $('.lt-history').on('click', '.btn-del', function () {
    var that = this;
    mui.confirm('确定要删除这条记录吗?', "温馨提示", ['取消', '确认'], function (e) {
      console.log(e);
      if (e.index == 1) {
         // 把下标存在当前点击的图标里面
        //  获取到下标
        var index = $(that).data('index');
        // 获取到数组
        var arr = getHistory();
        // 根据下标删除改下标的项
        arr.splice(index, 1);
        // 转化为jsonStr字符串
        var jsonStr = JSON.stringify(arr);
        // 存到本地存储中
        localStorage.setItem('search_list', jsonStr);
        // 重新渲染页面
        render();
      }
    })
  })

  // 功能4: 点击搜索按钮, 添加搜索记录
  // (1) 给 搜索按钮 注册点击事件
  // (2) 获取搜索框的内容
  // (3) 读取本地存储, 拿到数组
  // (4) 判断搜索框的内容是否为空
  // (5) 判断数组的长度是否大于10
  // (6)  判断是否有重复的,如果有,就删除原来的,在数组的最前面添加新的
  // (7) 将搜索框的内容, unshift 到数组的最前面
  // (8) 将数组转成jsonStr, 存到本地存储中
  // (9) 重新渲染
  $('.search').click(function () {
    var txt = $('.sea-input').val();
    var arr = getHistory();
    if (txt.trim() === "") {
      // 弹出提示框
      mui.toast("请输入搜索关键字", {
        duration: 2000
      })
      // 弹出框就结束进程
      return;
    }
  // (6)  判断是否有重复的,如果有,就删除原来的,在数组的最前面添加新的  
    var index = arr.indexOf(txt);
    // console.log(index);
    if (index > -1) {
      // 说明有重复项
      // 删除改下标
      arr.splice(index, 1);
    }
    // (5) 判断数组的长度是否大于10
    if (arr.length >= 10) {
      arr.pop();
    }
    arr.unshift(txt);
    var jsonStr = JSON.stringify(arr);
    localStorage.setItem('search_list', jsonStr);
    render();
    // 搜索框清空
    $('.sea-input').val("");
    // 搜索完成, 跳转到搜索列表, 并将搜索关键字传递过去
    location.href = "searchList.html?key=" + txt;
  })
 
})