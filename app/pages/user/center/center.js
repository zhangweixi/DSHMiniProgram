// pages/user/center/center.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     app:app,
     userInfo:app.data.userInfo ? app.data.userInfo : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('xxxxxxxx');
    console.log(this.data.userInfo);

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

      var userInfo = app.data.userInfo;
      if(!userInfo){

        userInfo = false;
      }

      this.setData({"userInfo":userInfo});  
      
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

  },
  toLogin:function(e){

    //获取用户微信信息
    wx.getUserInfo({
      success: (res) => {
        
          let userInfo = res.userInfo

          wx.setStorageSync('wxinfo', userInfo);

          //跳转到手机页面
          wx.navigateTo({
            url: '/pages/mobile/mobile/mobile'
          })
      }
    })


  }
})