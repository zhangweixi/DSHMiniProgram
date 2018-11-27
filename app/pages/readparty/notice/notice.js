// pages/readparty/notice/notice.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        notices:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({readPartyId:options.readPartyId});
        setTimeout(()=>{
            this.getNoticeMessage();    

        },1000);
        
    },
    //获取最新消息
    getNoticeMessage:function(){

        var url     = app.data.api + "readparty/get_notice_message";
        var data    = {
            userId:app.data.userId,
            readPartyId:this.data.readPartyId,
            setReaded:1,
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            this.setData({notices:res.data.notices});
        })
    }
})