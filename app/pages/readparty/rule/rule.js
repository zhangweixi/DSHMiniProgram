// pages/readparty/rule/rule.js
var app = getApp();
var common  = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        readPartyInfo:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            readPartyId:options.readPartyId
        });

        var readPartyInfo = common.readparty.get();

        var isAdmin = readPartyInfo.MemNumber == app.data.memNumber ? true : false;

        this.setData({readPartyInfo:readPartyInfo,isAdmin:isAdmin});


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },
})