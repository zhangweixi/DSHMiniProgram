var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readPartyId:0,
        departmentId:-1,
        allMembers:[],
        members:[],
        isAdmin:false,
        showSearchInput:false,
        waitingMember:false //是否是选择会员
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setTimeout(()=>{

            this.setData(options);
            this.getMembers();

            var readpartyInfo = common.readparty.get();

            if(readpartyInfo.MemNumber == app.data.memNumber){

                this.setData({isAdmin:true});
            }    
        },2000);
        
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

        //检查是否是选择会员的界面
        var waitingMember  = wx.getStorageSync('waitingMember')
        if(waitingMember){

            this.setData({waitingMember:waitingMember});    
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

            res         = res.data;
            var members =  res.data.members;
            this.setData({
                members:members,
                allMembers:members
            });
        });
    },
    nav:function(e){
        
        var userId = e.currentTarget.dataset.userId;

        if(this.data.waitingMember){

            for(var member of this.data.members){

                if(userId == member.UserID){

                    wx.setStorageSync('selectedMember', member);
                }
            }
            wx.navigateBack({delta: 1});

        }else{

            wx.navigateTo({
                url: "/pages/readparty/memdetail/memdetail?readPartyId="+this.data.readPartyId + "&userId=" + userId
            })    
        }
    },
    toAddPage:function(){

        wx.navigateTo({
            url:"/pages/readparty/memedit/memedit?readPartyId="+this.data.readPartyId
        })
    },
    triggleSearch:function(){
        this.setData({showSearchInput:!this.data.showSearchInput});
    },
    search:function(e){

        var searchKey   = e.detail.value;
        var members     = [];
        
        for(var member of this.data.allMembers){
            
            if(member.YourName.indexOf(searchKey) > -1 || member.department_name.indexOf(searchKey) > -1){

                members.push(member);
            }
        }

        this.triggleSearch();
        this.setData({members:members});
    }
})