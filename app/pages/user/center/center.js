// pages/user/center/center.js
var app = getApp();
var common = require('../../../common.js');

Page({

        /**
   * 页面的初始数据
   */
    data: {
		app: app,
		userInfo: app.data.userInfo ? app.data.userInfo: false,
    },

	/**
   	* 生命周期函数--监听页面加载
   	*/
    onLoad: function(options) {

            console.log(this.data.userInfo);

    },

	/**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

	},

	/**
   	 * 生命周期函数--监听页面显示
   	 */
   	onShow: function() {

		var userInfo = app.data.userInfo;

        if (!userInfo) {

                userInfo = false;
        }

        this.setData({
                "userInfo": userInfo
        });
        console.log(userInfo);
	},

	/**
   	* 生命周期函数--监听页面隐藏
   	*/
        onHide: function() {

	},
	/**
   	* 用户点击右上角分享
   	*/
	onShareAppMessage: function() {

	},
	toWeb:function(e){
		var url = e.currentTarget.dataset.url;
		common.toWeb(url,"常见问题");
	},
  upgrade:function(){
    var url = "https://wx.laohoulundao.com/web/weblogin/buy_vip?vipType=1&userId="+app.data.userId;
    common.toWeb(url);
  }
})