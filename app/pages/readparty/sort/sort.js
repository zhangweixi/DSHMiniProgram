// pages/readparty/sort/sort.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        showRule:false,
        float:false,
        members:[],
        selfData:null,
        readPartyId:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        //this.setData({readPartyId:options.readPartyId});
        setTimeout(()=>{

            this.getIntegral();

        },1000);
    },
    onPageScroll:function(e){

        if(e.scrollTop > 50){

            this.setData({float:true});

        }else{

            this.setData({float:false});
        }
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
    triggleRule:function(){

        this.setData({showRule:!this.data.showRule});
    },
    empty:function(){},
    getIntegral:function(){

        var url = app.data.api + "readparty/all_integral_rank";
        console.log(url);
        var data = {
            userId:app.data.userId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;
            console.log("===================");
            console.log(res);

            this.setData({members:res.data.members.data,selfData:res.data.selfData});
        })
    }

})