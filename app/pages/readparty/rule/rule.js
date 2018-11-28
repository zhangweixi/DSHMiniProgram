// pages/readparty/rule/rule.js
var app = getApp();
var common  = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        readPartyInfo:null,
        changed:false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            readPartyId:options.readPartyId
        });

        common.readparty.cache(options.readPartyId);
        this.getReadPartyInfo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },
    getReadPartyInfo:function(){
        var readPartyInfo = common.readparty.get();
        var isAdmin = readPartyInfo.MemNumber == app.data.memNumber ? true : false;
        this.setData({readPartyInfo:readPartyInfo,isAdmin:isAdmin});
    },

    updateReadParty:function(e){

        var regulation = e.detail.value.regulation;

        var data = {
            readPartyId:this.data.readPartyId,
            Regulation:regulation,
            userId:app.data.userId
        };
        var url = app.data.api + "readparty/update_read_party_info";

        app.request(url,data,(res,error)=>{
            res = res.data;

            if(res.code == 200){
            
                common.readparty.cache(this.data.readPartyId,(res,error)=>{

                    this.getReadPartyInfo();
                    this.setData({changed:false});
                });
                

                wx.showToast({
                    title: '',
                    icon: 'success', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                })

               
            }

        })

    },

    contentChange:function(e){


        if(e.detail.value.length == 0){
            
            this.setData({changed:false});
            return;
        }


        if(encodeURI(e.detail.value) == encodeURI(this.data.readPartyInfo.Regulation)){

            this.setData({changed:false});

        }else{
        
            this.setData({changed:true});
            
        }
    }
})