// pages/readparty/detail/detail.js
var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page:1,
        focus:false,
        showComment:false,
        bookId:0,
        bookName:null,
        readPartyId:0,
        companyInfo:null,
        departments:[],
        notices:[],
        departmentId:-1,
        readPlans:[],
        commentReadPlanId:0,
        commentReplayedId:0,
        commentReplayedUser:null,
        commentContent:null,
        commentPlaceHolder:null,
        
    },
    noticeTimer:null,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var readpartyId = options.readPartyId;

        this.setData({readPartyId:readpartyId});
console.log(this.data);
        setTimeout(()=>{


            this.getReadPartyDepartments();

            this.checkHasBook();

            this.getReadPartyPlans(true);

        },500);

        setTimeout(()=>{

            common.readparty.cache(this.data.readPartyId,null);

        },1000);

        this.noticeTimer = setInterval(()=>{

            this.getNoticeMessage();

        },10000); //10秒获取一次
       
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

        var bookId  = this.data.bookId;

        this.checkHasBook();

        if(bookId == this.data.bookId){

            return false;
        }
        
        this.getReadPartyPlans(true);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

        clearInterval(this.noticeTimer);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (e) {
        
        this.getReadPartyPlans(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.setData({page:this.data.page+1});
        this.getReadPartyPlans(false);
       
    },
    nav:function(e){

        wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },
    checkHasBook:function(){

        if(typeof(app.data.readparty) == 'undefined'){

            return false;
        }
        
        if(typeof(app.data.readparty.bookId) == 'undefined'){

            return;
        }

        var bookInfo = app.data.readparty;
        this.setData({bookId:bookInfo.bookId,bookName:bookInfo.bookName});
    },
    cleanBook:function(){

        this.setData({bookId:0,bookName:null});
        
        app.data.readparty.bookId   = 0;
        app.data.readparty.bookName = null;

        this.getReadPartyPlans(true);
    },
    //显示评论
    showComment:function(e){
        var data        = e.currentTarget.dataset;
        var type        = data.commentType;
        var readPlanId  = data.readPlanId;
        var replayedId  = data.replayedId;
        var replayedUser= data.replayedUser;

        if(readPlanId != this.data.commentReadPlanId || replayedId != this.data.commentReplayedId){

            var commentContent  = "";

        }else{

            var commentContent = this.data.commentContent;

        }

        var commentPlaceHolder = type == "comment"?"评论":"@"+replayedUser;

        this.setData({
            showComment:true,
            commentPlaceHolder:commentPlaceHolder,
            commentType:type,
            commentReadPlanId:readPlanId,
            commentReplayedId:replayedId,
            commentContent:commentContent
        });


        setTimeout(()=>{
            this.setData({focus:true});
        },100);
    },
    //关闭评论
    closeComment:function(e){
        
        
        var comment = e.detail.value;

        var data = {
            focus:false,
            showComment:false,
            commentContent:comment
        };

        this.setData(data);

    },
    addComment:function(e){

        this.closeComment(e);

        if(this.data.commentContent.length == 0){

            wx.showToast({
                title: '内容为空',
                icon: 'none'
            });

            return;
        }

        var url = app.data.api + "readparty/add_comment";

        var requestData = {
            type:0,
            userId:app.data.userId,
            ReaParID:this.data.readPartyId,
            readPlanId:this.data.commentReadPlanId,
            pid:this.data.commentReplayedId,
            commentContent:this.data.commentContent,
        }

        app.request(url,requestData,(res,error)=>
        {
            res = res.data;
            if(res.code != 200){
                wx.showToast({
                    title: '内容为空',
                    icon: 'none'
                });
            }

            var commentList = res.data.comments;
            var readPlans   = this.data.readPlans;

            for(var key in readPlans){

                if(readPlans[key].SumUpID ==requestData.readPlanId ){

                    this.setData({["readPlans["+key+"].commentlist"]:commentList});
                    break;
                }
            }
        });
    },
    addOrCancelZan:function(e){


        var url = app.data.api + "readparty/isLikeBookSumup";

        var requestData = {
            sumUpID:e.currentTarget.dataset.readPlanId,
            userId:app.data.userId,
        };

        app.request(url,requestData,(res,error)=>{

            //查看当前改进计划的赞列表，没有加上，有去掉
            var readPlans = this.data.readPlans;

            for(var key in readPlans){


                if(readPlans[key].SumUpID == requestData.sumUpID){

                    var zans    = readPlans[key].zan;

                    var hasZan  = false;
                    var isLike  = 1;

                    for(var k1 in zans){

                        if(zans[k1].UserID == requestData.userId){

                            zans.splice(k1,1);
                            hasZan = true;
                            isLike = 0;
                            break;
                        }
                    }

                    if(hasZan == false)
                    {
                        zans.push({YourName:app.data.userInfo.YourName,UserID:requestData.userId})
                    }

                    var data = {["readPlans["+ key +"].zan"]:zans,["readPlans["+ key +"].isLike"]:isLike};
                    this.setData(data);
                    break;
                }
            }
        });

    },
    //获得读书会部门
    getReadPartyDepartments:function(){

        var url = app.data.api + "company/get_company_orgization";

        var data = {
            readPartyId:
            this.data.readPartyId,
            userId:app.data.userId,
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){
                res.data.departments.unshift({department_id:-1,department_name:"全部",selected:1})
                this.setData({
                    companyInfo:res.data.companyInfo,
                    departments:res.data.departments
                });
            }


        });

    },
    //获取读书改进计划
    getReadPartyPlans:function(clear=false){

        if(clear){

            this.setData({page:1,canFresh:true});
        }

        if(this.data.canFresh == false){

            return;
        }
        var url = app.data.api + "readparty/readPlanListPaginate";
        var data = {
            page:this.data.page,
            userId:app.data.userId,
            bookId:this.data.bookId,
            readPartyId:this.data.readPartyId,
            departmentId:this.data.departmentId
        };
        
        wx.showLoading();
        app.request(url,data,(res,error)=>
        {
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
            wx.hideLoading();


            res = res.data;

            if(res.code != 200){

                wx.showToast({
                    title: res.message,
                    icon: 'none', // "success", "loading", "none"
                    duration: 1500,
                    mask: false,
                })
                return;
            }

            var readPlans   = res.data.readPlanList; 
            var pageData    = {};
            if(readPlans.data.length < readPlans.per_page){

                this.setData({canFresh:false});

            }

            if(clear == true){

                var readPlanList = readPlans.data;

            }else{

                var readPlanList = this.data.readPlans.concat(readPlans.data);
            }
            
            this.setData({readPlans:readPlanList});
            
        });

    },
    selectDepartment:function(e){
        
        var departmentId = e.currentTarget.dataset.departmentId;

        if(this.data.departmentId == departmentId)
        {
            return;
        }

        var departments = this.data.departments;

        for(var department of departments){

            if(department.department_id == departmentId){

                department.selected = 1;

            }else{

                department.selected = 0;
            }
        }

        this.setData({
            departmentId:departmentId,
            departments:departments
        });

        this.getReadPartyPlans(true);
    },

    //获取最新消息
    getNoticeMessage:function(){

        var url     = app.data.api + "readparty/get_notice_message";
        var data    = {
            userId:app.data.userId,
            readPartyId:this.data.readPartyId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            this.setData({notices:res.data.notices});
        })
    }
})

