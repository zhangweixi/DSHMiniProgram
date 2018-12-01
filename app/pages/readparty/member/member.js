var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        departmentId:-1,
        members:[],
        isAdmin:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
        this.getMembers();

        var readpartyInfo = common.readparty.get();

        if(readpartyInfo.MemNumber == app.data.memNumber){

            this.setData({isAdmin:true});
        }
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

        if(this.data.members.length > 0){

            this.getMembers();
        }
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    getMembers:function(){


        var url = app.data.api + "readparty/get_read_party_member";
        var data = {
                readPartyId:this.data.readPartyId,
                departmentId:this.data.departmentId
            };

            app.request(url,data,(res,error)=>{

                res = res.data;

                this.setData({members:res.data.members});
            });

    },
    nav:function(e){
        var userId = e.currentTarget.dataset.userId;
        wx.navigateTo({
            url: "/pages/readparty/memdetail/memdetail?readPartyId="+this.data.readPartyId + "&userId=" + userId
        })
    },
    toAddPage:function(){

        wx.navigateTo({
            url:"/pages/readparty/memedit/memedit?readPartyId="+this.data.readPartyId
        })
    }
})