// pages/readparty/memdetail/memdetail.js
var app =getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isEdit:false,
        isAdmin:false,
        memberInfo:null,
        isSelf:false,
        departments:['美国', '中国', '巴西', '日本']
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
        this.getReadPartyMmeberInfo();

        if(this.data.userId == app.data.userId){

            this.setData({isSelf:true});
        }

        var readpartyInfo = common.readparty.get();

        if(readpartyInfo.MemNumber == app.data.memNumber){

            this.setData({isAdmin:true});
        }
    },

    activeEdit:function(){

        this.setData({isEdit:true});
    },
    getReadPartyMmeberInfo:function(){


        var url = app.data.api + "readparty/read_party_member_detail";

        var data = {readPartyId:this.data.readPartyId,userId:this.data.userId};

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                var memberInfo = res.data.memberInfo;

                memberInfo.leanTime = (memberInfo.leanTime / 3600).toFixed(2);
                memberInfo.AddDate  = memberInfo.AddDate.substr(0,11);

                this.setData({memberInfo:memberInfo});
            }

        })
    },
    editMemberInfo:function(e){

        this.setData({isEdit:false});
    },
    //显示部门
    showDepartments:function(){

        if(this.data.isEdit == false){

            return;
        }

        wx.showActionSheet({
            itemList:this.data.departments,
            success (res) {
                console.log(res.tapIndex)
            },
            fail (res) {
                console.log(res.errMsg)
            }
        })
    }

})