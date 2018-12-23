// pages/other/web/web.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weburl:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var weburl  = wx.getStorageSync('weburl');
        var title   = wx.getStorageSync('webtitle',"教导读书会");

        this.setData({
            weburl:weburl
        })

        wx.setNavigationBarTitle({
            title: title
        })
    }
})