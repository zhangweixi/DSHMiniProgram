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
        payFinish:false
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function(options) {

        setTimeout(()=>{

            this.setData({
                app:app,
                userInfo:app.data.userInfo? app.data.userInfo : false
            });

        },app.data.debugTime);
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

        this.setData({"userInfo": userInfo});


        if(this.data.payFinish && userInfo.vipTimeIsValid == 0){ //服务器还没有刷新

            common.user.fresh(userInfo.UserID);

            setTimeout(()=>{

                this.onShow();

            },1000);
        }
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

        return {
            title: this.data.userInfo.NickName+'邀请您加入教导读书会',
            imageUrl: "https://wx.laohoulundao.com/images/weixin/i-top.png",
            path: '/pages/home/index/index?userId='+app.data.userId 
        }
    },
    toWeb: function(e) {
        var url = e.currentTarget.dataset.url;
        common.toWeb(url, "常见问题");
    },
    toUpgrade:function(){

        wx.navigateTo({
            url: '/pages/user/upgrade/upgrade'
        })
    },
    copyMemNumber:function()
    {
        wx.setClipboardData({
            data: this.data.userInfo.MemNumber,
            success(res) {
               
            }
        })
    }

})