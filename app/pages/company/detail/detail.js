// pages/company/detai/detail.js
var app = getApp();
var common = require('../../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        sourceInfo:null,
        comments:[],
        topCommentId:0,
        parentCommentId:0,
        commentData:{
            showComment:false,
            title:"您的评论",
            btnTitle:"提交评论",
            closeEvent:"closeCommentInput",
            submitEvent:"addComment",
            focus:false
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData(options);
       
        setTimeout(()=>{
            this.getSourceDetail();
        },2000);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
    getSourceDetail:function(){

        var url = app.data.api + "company/detail_company_source";
        var data = {
            sourceId:this.data.sourceId,
            // sourceId:5,
            userId:app.data.userId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            this.setData({
                sourceInfo:res.data.source,
                comments:res.data.comments
            })
        })
    },
    showComment:function(e){
        var parentCommentId = e.currentTarget.dataset.parentCommentId;
        this.setData({['commentData.showComment']:true,parentCommentId:parentCommentId});
        this.setData({['commentData.focus']:true});
    },
    closeCommentInput:function(){
        this.setData({['commentData.focus']:false});
        this.setData({['commentData.showComment']:false});
    },
    addComment:function(e){

        var comment = e.detail.value.inputContent;

        var url     = app.data.api + "comment/addComment";

        var data    = {
            userId:app.data.userId,
            type:4,
            contentId:this.data.sourceId,
            commentContent:comment,
            parentCommentId:this.data.parentCommentId,
            topCommentId:0
        };

        
        app.request(url,data,(res,error)=>{

            this.closeCommentInput();
            common.showToast("","success")
            this.getSourceDetail();

        })
    },
    zan:function(e){

        var commentId = e.currentTarget.dataset.commentId;
        var url = app.data.api + "comment/addOrCancelZan";
        var data = {
            commentId:commentId,
            userId:app.data.userId
        };
        
        app.request(url,data,(res,error)=>{

            this.getSourceDetail();
        })
    }
})