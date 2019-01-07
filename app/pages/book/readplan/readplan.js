// pages/book/readplan/readplan.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    
        var url = app.data.host + "home/share_read_plan?bookId="+options.bookId+"&userId="+options.userId+"&mini=1";
        this.setData({url:url});
        wx.setNavigationBarTitle({
            title: '读书改进计划'
        })
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

    }
})