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
        waitingMember:false, //是否是选择会员
        searchWords:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        setTimeout(()=>{

            this.setData(options);
            this.getMembers();

            var readPartyInfo = common.readparty.get();
            var isAdmin =  readPartyInfo.MemNumber == app.data.memNumber ? true : false;
            
            this.setData({isAdmin:true,readPartyInfo:readPartyInfo});

        },app.data.debugTime);
        
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

    onShareAppMessage:function(e){
        var readPartyInfo = this.data.readPartyInfo;
        return {
            title:app.data.userInfo.NickName+"邀请您加入"+ readPartyInfo.ReaParName,
            path:'pages/readparty/joinparty/joinparty?readPartyId='+readPartyInfo.ReaParID,
            imageUrl:readPartyInfo.filePath1
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

            var members  = res.data.data.members;
            this.setData({allMembers:members});
            this.filterMembers(this.data.searchWords);
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
    //搜索会员
    search:function(e){

        var searchKey   = e.detail.value;
        this.setData({searchWords:searchKey});
        this.filterMembers(searchKey);
        this.triggleSearch();
    },
    //过滤会员
    filterMembers:function(keyWords){

        var members     = [];
        
        for(var member of this.data.allMembers){
            
            if(member.YourName.indexOf(keyWords) > -1 || member.department_name.indexOf(keyWords) > -1){

                members.push(member);
            }
        }
        this.setData({members:members});
    }
})