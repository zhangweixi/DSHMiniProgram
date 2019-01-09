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

        //检查用户是否已经是读书会会员
    },

    getReadPartyInfo:function(){

        common.readparty.cache(this.data.readPartyId,(res,error)=>
        {    
            var readPartyInfo = res.data.readPartyInfo;

            this.setData({readPartyInfo:readPartyInfo});
        });
    },
    joinParty:function(){

        if(app.data.userId == 0){ //用户没有注册

            wx.switchTab({url:"/pages/user/center/center"});
            return;
        }

        //加入到读书会
        var url = app.data.api + "readparty/add_persoanl_read_party_member";
        var data = {
            userId:app.data.userId,
            readPartyId:this.data.readPartyId
        };

        app.request(url,data,(res,error)=>{

            if(res.data.code == 200){

                common.showToast("已加入","success");

                //跳转社群首页
                setTimeout(()=>{this.toIndex()},2000);

            }else{

                common.showToast(res.data.message,"none");

                if(res.data.code == 3102){

                    setTimeout(()=>{this.toIndex()},2000);
                }
            }
        })
    },
    toIndex:function(){
         wx.switchTab({url:"/pages/readparty/index/index"});  
    }
})