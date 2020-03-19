// 删除数据库所有数据
function _delete() {
  wx.cloud.callFunction({
    name: "delete",
    success: res => {
      console.log("res =>", res);
    },
    fail: err => {
      console.log("err =>", err);
    }
  });
};


// 加粗
function bolder() {
  // 创建选择器对象
  var query = wx.createSelectorQuery();
  // 通过css选择器获取节点
  var editor = query.select("#editor");

  // 通过节点获取富文本编辑器的内容对象
  editor.context(function (res) {
    // 修改富文本编辑器的内容样式 - 加粗
    res.context.format("bold");
  }).exec(); //按顺序执行方法,将结果返回成数组

};


// 斜体
function italic() {
  // 创建选择器对象
  var query = wx.createSelectorQuery();
  // 通过css选择器获取节点
  var editor = query.select("#editor");

  // 通过节点获取富文本编辑器的内容对象
  editor.context(function (res) {
    // 修改富文本编辑器的内容样式 - 斜体
    res.context.format("italic");
  }).exec(); //按顺序执行方法,将结果返回成数组
};


// 下划线
function uline(){
  // 创建选择器对象
  var query = wx.createSelectorQuery();
  // 通过css选择器获取节点
  var editor = query.select("#editor");

  // 通过节点获取富文本编辑器的内容对象
  editor.context(function (res) {
    // 修改富文本编辑器的内容样式 - 下划线
    res.context.format("underline");
  }).exec(); //按顺序执行方法,将结果返回成数组
};


// 添加图片
function append_img() {
  // 创建选择器对象
  var query = wx.createSelectorQuery();
  // 通过css选择器获取节点
  var editor = query.select("#editor");

  // 打开相册选择图片
  wx.chooseImage({
    sizeType: ["compressed"],
    success: function (e) {

      // 临时图片路径 e.tempFilePaths ;

      // 把图片插入到编辑器里面
      editor.context(function (res) {
        // 循环所有的图片路径
        for (var i = 0; i < e.tempFilePaths.length; i++) { //插入每一个图片
          res.context.insertImage({
            src: e.tempFilePaths[i]
          })
        }

      }).exec();
    },
  })
}


// 初始化富文本编辑器的内容
function setContents(delta) {
  // 选择器对象
  var query = wx.createSelectorQuery();
  // 通过选择器获取节点
  var ele = query.select("#editor");
  ele.context(function (res) {
    res.context.setContents({
      delta: delta
    });

    res.context.getContents({
      success:res =>{
        console.log(res);
      }
    })
  }).exec();
}


// 对外暴露
module.exports = {
  _delete: _delete,
  bolder: bolder,
  italic: italic,
  uline: uline,
  append_img: append_img,
  setContents: setContents
}