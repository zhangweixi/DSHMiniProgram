// pages/readparty/framework/framework.js
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

        this.getReadPartyInfo();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
        this.getReadPartyInfo();


    },
    nav:function(e){
        var url = "/pages/readparty/"+e.currentTarget.dataset.url + "?";
            url = url + "readPartyId=" + this.data.readPartyId +"&";
            url = url + "companyId=" + this.data.readPartyInfo.company_id + "&";
            url = url + "readPartyName="+this.data.readPartyInfo.ReaParName;
            wx.navigateTo({url: url});
    },

    getReadPartyInfo:function()
    {

        var readPartyInfo           = common.readparty.get();
            readPartyInfo.AddDate   = readPartyInfo.AddDate.substr(0,10);
            if(readPartyInfo.Regulation.length > 80)
            {
                readPartyInfo.Regulation = readPartyInfo.Regulation.substr(0,80)+"...";    
            }
            this.setData({readPartyInfo:readPartyInfo});
    }
})