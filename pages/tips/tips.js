// 引入utils
var utils = require("../../utils/utils.js");
var editor = require("../../utils/editor.js")
var that;
var uid;

var img_number = 0;
var url_number = 0;
var fileUrl_arr = [];

var collection = wx.cloud.database().collection("test");


// pages/tips/tips.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    change:false
  },

  // 完成
  finish: function() {
    // 开始提交数据
    wx.showLoading({
      title: '上传中....',
    })
    // 不管修改便签还是添加便签
    var editor = wx.createSelectorQuery().select("#editor");

    // 获取到富文本编辑器里面的对象
    editor.context(function(e) {
      // 拿到编辑器里面的所有内容
      e.context.getContents({
        success: res => {

          // 当前的富文本编辑器的内容
          console.log(res.delta)

          
          if (res.delta.ops.length==1 &&res.delta.ops[0].insert == "\n") {
            wx.showToast({
              title: '内容不能为空',
              icon: "none"
            })
          }else {
              // 判断是否有图片:
              console.log("添加数据")
              var flag = true;
              for (var i in res.delta.ops) {
                // 有图片 - 先上传图片,再传数据库
                if (res.delta.ops[i].insert.image) {
                  flag = false;
                  // 对图片进行计数
                  img_number++;
                  // 上传图片的方法
                  that.uploadImage(res.delta.ops[i].insert.image, res.delta, res.text);
                }
              };
              //没有图片 直接存富文本的内容到数据库里面
              if (flag) {
                utils.addDataBase(res.delta, res.text)
              }
            }
        }
      })
    }).exec()

  },

  // 上传图片的
  uploadImage: function(path, delta, text) {
    // 存到云存储  只能一张一张传
    wx.cloud.uploadFile({
      cloudPath: "tips/" + (new Date()).getTime() + ".png",
      filePath: path,
      success: e => {
        // TODO 文件id 一条一条的回
        // console.log(e.fileID);

        //把每一条文件id存到数组中
        fileUrl_arr.push(e.fileID);
        // 文件id的数量
        url_number++;

        if (url_number == img_number) {
          // fileUrl_arr = [];

          // 把富文本编辑器里面的图片路径改成文件id         
          let i = 0;
          for (var key in delta.ops) {
            // 判断富文本编辑器里面的图片
            if (delta.ops[key].insert.image) {

              // 把富文本编辑器里面的所有的图片路径 改成 文件id
              delta.ops[key].insert.image = fileUrl_arr[i];
              i++;
            }
          }
          // 把内容存到数据库里面
          utils.addDataBase(delta, text, fileUrl_arr[0]);
          fileUrl_arr = [];


        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

    uid = options._id;
    // ➕号进来 为false
    // 便签进来为true

    //存在id的情况下
    if (options._id) {
      // 通过便签的id获取数据
      collection.doc(options._id).get({
        success: res => {
          // 把数据库的数据存到data里面
          that.setData({
            db: res.data
          })
          
          that.setContents(res.data.delta)
        }
      })

      // 把富文本编辑器改为只读的
      that.setData({
        change: true
      })
    }
  },


  // 点击列表修改便签
  setContents: function(delta) {
    editor.setContents(delta);
  },
  _delete: function() {
    editor._delete();
  },
  // 加粗
  bolder: function() {
    editor.bolder();
  },
  // 斜体
  italic: function() {
    editor.italic();
  },
  // 下划线
  uline: function() {
    editor.uline()
  },
  // 添加图片
  append_img: function() {
    editor.append_img();
  }
})