var that;
var db = wx.cloud.database();
var collection = db.collection("test");
var _ = db.command;


// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false
  },
  tap:function(){
    that.setData({
      show:true
    })
  },
  end:function(){
    that.setData({
      show: false
    })
  },  

  longtap:function(even){
    console.log(even.currentTarget.dataset.id)
  wx.showModal({
    content:"是否删除该便签?",
    confirmText:"删除",
    cancelText:"取消",
    success:res =>{
      console.log(res);
      if (res.confirm==true){
        // 删除云存储的图片
        collection.doc(even.currentTarget.dataset.id).get({
          success:res =>{

            for (let i in res.data.delta.ops){
              (function(i){
                // console.log(res.data.delta.ops[i].insert.image)
                if (res.data.delta.ops[i].insert.image) {
                  console.log("删除图片");
                  wx.cloud.deleteFile({
                    fileList: [res.data.delta.ops[i].insert.image],
                    success: res => {
                      console.log(res);
                    },
                    fail: err => {
                      console.log(err);
                    }
                  })
                }
              })(i)
              
            }
          }
        })

       
      }
    },
    complete:() =>{
      // 删除数据库里面的条目
      collection.doc(even.currentTarget.dataset.id).remove({
         success:res =>{
           // 更新页面数据
           that.getAllDb();
         },fail:err =>{
           console.error(err)
         }
      });

     
    }
    })

  },
  // 页面跳转函数
  navigator:function(event){
    console.log(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../tips/tips?_id='+event.currentTarget.dataset.id
    })
  },
  // 输入框的完成事件，修改数据的标题
  setTitle:function(opt){
    console.log("opt_id =>",opt.currentTarget.dataset.id);
    console.log("opt_value =>",opt.detail.value);
    // 通过id 添加或修改数据
    collection.doc(opt.currentTarget.dataset.id).update({
      data:{
        title: "《"+opt.detail.value+"》"
      },
      success:() =>{
        that.getAllDb();
      }
    })
    
  },
  // 一文
  hitokoto:function(){
    wx.request({
      url: 'https://v1.hitokoto.cn?c=j&c=k&c=i&c=d',
      // https://developer.hitokoto.cn/sentence/#%E7%AE%80%E4%BB%8B
     
      method:"get",
      dataType:"json",
      success:res =>{
        
        that.setData({
          content: res.data.hitokoto,
          _from: res.data.from
        })

        // 停止下拉刷新
        wx.stopPullDownRefresh();
      }
    })
  },
  // 日期
  nowtime:function(){
    var time = new Date;
    // 星期
    var day = time.getDay();
    var date = time.getDate();

    day = day == 0 ? "星期天" : day == 1 ? "星期一" : day == 2 ? "星期二" : day == 3 ? "星期三" : day  == 4 ? "星期四" : day == 5 ? "星期五" : "星期六";
    date = date < 10 ? "0"+date : date;
  

    that.setData({
      day: day,
      date: date
    })
  },

  // 获取数据中的所有便签数据
  getAllDb:function(){
    var arr=[];

    // 逐月获取数据  0月  - 11月
    for(var i = 0;i<=11 ; i++){

      (function(i){
        collection.where({
          "date.month": _.eq(i)
        }).get({
          success: res => {
            // 对月份进行分类，组成一个12月份的数组
            arr[i] = res.data;

            //月份齐全,把所有的月份存到data里面去
            let index = 0;
            arr.forEach(function(){
              index++;
            });

            if (index == 12){
              that.setData({
                all: arr
              })
              // console.log("all =>",that.data.all);
            }
          }
        })
      })(i)
    };
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this;

    that.nowtime();
    that.hitokoto();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.getAllDb();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    that.hitokoto();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})