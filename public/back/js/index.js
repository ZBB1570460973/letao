// 图表域
$(function () {
  // 左边的柱状图
    // 基于准备好的dom，初始化echarts实例
    var Chart1 = echarts.init(document.querySelector('.pic-left'));

    // 指定图表的配置项和数据
    var option1 = {
        title: {
            text: '2017年注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [15, 20, 36, 20, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    Chart1.setOption(option1);

    // 右边的饼图
     // 基于准备好的dom，初始化echarts实例
     var Chart2 = echarts.init(document.querySelector('.pic-right'));

     // 指定图表的配置项和数据
     option2 = {
      title : {
          text: '半年人数',
          subtext: '2017年6月',
          x:'center'
      },
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['迪奥','阿玛尼','古驰','路易威登','圣罗兰']
      },
      series : [
          {
              name: '品牌',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:1335, name:'迪奥'},
                  {value:310, name:'阿玛尼'},
                  {value:234, name:'古驰'},
                  {value:1135, name:'路易威登'},
                  {value:1548, name:'圣罗兰'}
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
  
 
     // 使用刚指定的配置项和数据显示图表。
     Chart2.setOption(option2);
})