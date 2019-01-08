// pages/readparty/sort/sort.js
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
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

        this.setData({app:getApp()});
        this.getIntegral();
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
            this.setData({members:res.data.members.data,selfData:res.data.selfData});
        })
    },
    sendGift:function(e){

        if(this.data.sendingGift){
            return;
        }
        this.setData({sendingGift:true});
        var gainner = e.currentTarget.dataset.userId;
        var data = {
            sender:app.data.userId,
            gainner:gainner,
            giftType:"all",
            readPartyId:0
        };

        var url = app.data.api + "readparty/send_gift";
        app.request(url,data,()=>{

            var members = this.data.members;

            for(var member of members){

                if(member.UserID == gainner){
                    member.giftNum += 1;
                    member.hasGift  = 1;
                    break;
                }
            }

            this.setData({
                members:members,
                sendingGift:false
            });
        })
    }
})