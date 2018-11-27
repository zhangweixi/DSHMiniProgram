// pages/book/comments/comments.js
var app = getApp();
var common  = require('../../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userId:10,
        showComment:false,
        comments:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.setData({bookId:options.bookId});

        //获取评论
        this.getBookComment();
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

    showCommentInput:function(e){

        if(app.data.userId == 0){

            wx.showToast({
                title: '请登录',
                icon: 'none', // "success", "loading", "none"
                duration: 1500,
                mask: false
            });
            return;
        }
        var data = e.currentTarget.dataset;
        var type = data.type;
        this.setData({commentType:data.type,topCommentId:data.topcommentid,showComment:true});
    },
    closeCommentInput:function(){

        this.setData({showComment:false});

    },
    getBookComment:function(){

        var url     = app.data.api + "comment/getMultyComment";
        var data    = {
            contentId:this.data.bookId,
            type:5,
            userId:app.data.userId,
        };

        app.request(url,data,(res,error)=>{

            res = res.data;
            data = res.data;
            if(res.data.comments){

                this.setData({comments:data.comments})
            }

        })
    },
    addComment:function(e){
        var comment = e.detail.value.comment.replace(/\s+/g, '');

        var url = app.data.api + "comment/addComment";

        if(comment.length == 0){

            wx.showToast({
                title: '内容为空',
                icon: '', 
                image:"/images/icon/toast-warning.png",
                duration: 1500,
                mask: false,
            });

            return false;
        }

        var data = {
            contentId:this.data.bookId,
            type:5,
            commentContent:comment,
            userId:app.data.userId,
            //topCommentId:this.data.topCommentId,
            parentCommentId:this.data.topCommentId,
        };

        wx.showLoading({
           title: '',
           mask: false,
        })

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){
                
                this.getBookComment();
                this.setData({showComment:false});
                wx.showToast({
                    title: '',
                    icon: 'success', // "success", "loading", "none"
                    duration: 1500,
                    mask: false
                })

            }else{
              
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1500,
                    mask: false,
                });
            }
            
        });
    },
    zan:function(e){

        var commentId = e.currentTarget.dataset.commentid;

        var url = app.data.api + "comment/addOrCancelZan";

        if(app.data.userId == 0){

            common.showDialog(this,"请登录","warning");
            return ;
        }

        var data = {commentId:commentId,userId:app.data.userId};
        app.request(url,data,(res,error)=>{
            this.getBookComment();
        })
    }
})