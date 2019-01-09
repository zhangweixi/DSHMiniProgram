// pages/readparty/joinparty/joinparty.js
var app = getApp();
var common = require('../../../common.js');


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

        this.setData({
            readPartyId:options.readPartyId,
            app:app
        });

        this.getReadPartyInfo();
    },

    getReadPartyInfo:function(){

        common.readparty.cache(this.data.readPartyId,(res,error)=>{
            console.log(res);
            var readPartyInfo = res.data.readPartyInfo;

            this.setData({readPartyInfo:readPartyInfo});

        });
    }


})