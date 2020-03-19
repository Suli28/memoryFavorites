var db = wx.cloud.database();
var collection = db.collection("test");
var _ = db.command;

// 把富文本编辑器里面的内容存储到数据库
function addDataBase(delta, text, url,uid,title) {
  console.log("执行了");

  // 时间对象
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth(); //月份是从0开始的
  var day = date.getDate();
  var hours = date.getHours();
  var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  var xingqi = date.getDay();
  xingqi = xingqi == 0 ? "周日" : xingqi == 1 ? "周一" : xingqi == 2 ? "周二" : xingqi == 3 ? "周三" : xingqi == 4 ? "周四" : xingqi == 5 ? "周五" : "周六";

  if (uid) {
    // set 修改数据
    collection.doc(uid).set({
      data: {
        delta: delta,
        date: {
          year: year,
          month: month,
          day: day,
          hours: hours,
          min: min,
          xingqi: xingqi
        },
        text: text,
        url: url,
        title: title
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '更新成功',
        });

        setTimeout(function () {
          wx.navigateBack()
        }, 1800)
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({
          title: '更新失败' + err,
        })
      }
    })
  } else {
    // 添加数据
    collection.add({
      data: {
        delta: delta,
        date: {
          year: year,
          month: month,
          day: day,
          hours: hours,
          min: min,
          xingqi: xingqi
        },
        text: text,
        url: url
      },
      success: res => {
        console.log("成功添加数据")
        // 关闭loding
        wx.hideLoading();
        // 添加成功的吐司
        wx.showToast({
          title: '添加成功',
        })

        // 数据添加成功，两秒钟后回到首页（给吐司一个显示的时间）
        setTimeout(function () {
          wx.navigateBack()
        }, 1800)
      },

      fail: err => {
        console.log("添加数据失败 =>", err)
        // 关闭loding
        wx.hideLoading();
        // 添加失败的吐司
        wx.showToast({
          title: '添加失败' + err,
          // 添加失败不要 打勾的图标
          icon: "none"
        })
      }
    })
  }
}





// 将接口暴露出去
module.exports={
  addDataBase: addDataBase
}