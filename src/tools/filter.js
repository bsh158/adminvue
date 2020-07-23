import Vue from 'vue'
export default (function () {
  Vue.filter('status', function (value) {
    if (value == 1) {
      return '启用'
    } else if (value == 0) {
      return '禁用'
    } else {
      return '未知状态'
    }
  })

  Vue.filter('memberType', function (value) {
    if (value == 1) {
      return '高中在校生'
    } else if (value == 2) {
      return '高中毕业生'
    } else if(value == 3){
      return '大学在校生'
    }else if(value == 4){
      return '大学毕业生'
    }else if(value == 5){
      return '父母'
    }
  })
  Vue.filter('examineState', function (value) {
    if (value == 0) {
      return '待审核'
    } else if (value == 2) {
      return '审核未通过'
    }
  })

  Vue.filter('cashType', function (value) {
    if (value == 1) {
      return '商户提现'
    } else if (value == 2) {
      return '用户提现'
    }
  })

  Vue.filter('UserState', function (value) {
    if (value == 1) {
      return '正常'
    } else if (value == 2) {
      return '已冻结'
    }
  })

  Vue.filter('TravelState', function (value) {
    if (value == "待接单") {
      return '已下单'
    } else if (value == "已接单") {
      return '已下单'
    } else if(value == "已送达/完成"){
      return '已到达'
    }else{
      return value
    }
  })



  //时间戳转日期
  Vue.filter('unixToDate', function (value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;  
  })

  // 日期格式
  Vue.filter('formatDate', function (value) {
    if(value == null || value == '' || !value){
      return ''
    } else {
        var arr = value.split(/[- : \/]/);
        var d = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate() <10 ? '0' + d.getDate() : '' + d.getDate();
        // var hour = d.getHours();
        // var minutes = d.getMinutes();
        // var seconds = d.getSeconds();
      return  year+ '-' + month + '-' + day;
    }
    
  })
  // 
  Vue.filter('payType', function (value) {
    if (value == 'wxpay') {
      return '微信'
    } else if (value == 'alipay') {
      return '支付宝'
    } else if (value == 'icpay'){
      return 'IC卡'
    }
  })
  Vue.filter('rules', function (value) {
    return value
  })
  Vue.filter('fileLink', function (value) {
    const link = window.imgUrl + value
    return link
  })
  Vue.filter('toolType', function (value) {
    let type = ''
    if (value == 1) {
      type = '系统工具'
    } else if (value == 2) {
      type = '说明知道'
    }
    return type
  })
  Vue.filter('numToString', function (value) {
    const string = value.toString()
    return string
  })
  Vue.filter('projectState', function (value) {
    let string = ''
    switch (value) {
      case '1':
        string = '售前项目'
        break
      case '2':
        string = '服务中项目'
        break
      case '3':
        string = '已结束项目'
        break
    }
    return string
  })
  Vue.filter('time', function (value) {
    let day = moment.unix(value)
    let date = moment(day).format('YYYY/MM/DD H:mm')
    return date
  })
  Vue.filter('date', function (value) {
    let day = moment.unix(value)
    let date = moment(day).format('YYYY/MM/DD')
    return date
  })
  Vue.filter('abstract', function (value) {
    let abstract = ''
    if (value.length > 70) {
      abstract = value.substr(0, 70) + '...'
    } else {
      abstract = value
    }
    return abstract
  })
  Vue.filter('posStatus', function (value) {
    let status = ''
    switch (value) {
      case 1:
        status = '在职'
        break
      case 2:
        status = '待入职'
        break
      case 3:
        status = '离职'
        break
    }
    return status
  })
  Vue.filter('template', function (value) {
    let template = ''
    if (value == '') {
      template = '上传'
    } else {
      template = '上传更新'
    }
    return template
  })
})()
