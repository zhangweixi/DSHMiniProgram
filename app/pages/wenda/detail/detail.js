// pages/wenda/detail/detail.js
var app = getApp();
var common = require('../../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        commentData:{
            showComment:false,
            title:"您的回答",
            btnTitle:"提交答案",
            closeEvent:"closeCommentInput",
            submitEvent:"addAnswer",
            focus:false
        },
        questionInfo:null,
        answers:null,
        selfQuestion:false,
        hasAnswer:false,
        acceptAnswers:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var questionId = options.questionId;
        this.setData({questionId:questionId,app:app})

        setTimeout(()=>{

            if(app.data.userId >0)
            {
                this.getQuestionDetail();        
            }else{
                setTimeout(()=>{
                    if(app.data.userId >0)
                    {
                        this.getQuestionDetail();        
                    }else{
                        
                    }
                },1000);
            }
        },1000);
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    showComment:function(){
        this.setData({['commentData.showComment']:true});
        this.setData({['commentData.focus']:true});
    },
    closeCommentInput:function(){
        this.setData({['commentData.focus']:false});
        this.setData({['commentData.showComment']:false});
    },
    // 新增回复
    addAnswer:function(e){
        
       
        var answer = e.detail.value.inputContent;

        var url = app.data.api + "companyQuestion/add_answer";
        var data = {
            questionId:this.data.questionId,
            userId:app.data.userId,
            answer:answer
        };
        if(answer.length == 0){

            common.showToast('答案不能为空',"none");
            return;
        }

        this.closeCommentInput();
        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                this.getQuestionDetail();
            }
        })
    },
    addZan:function(e){

        var url = app.data.api + "companyQuestion/like_answer";
        var data = {
            userId:app.data.userId,
            answerId:e.currentTarget.dataset.answerId
        };

        console.log(data);
        app.request(url,data,(res,error)=>{

            res = res.data;
            if(res.code == 200){

                this.getQuestionDetail();
            }
        })
    },
    getQuestionDetail:function(){

        var url     = app.data.api + "companyQuestion/question_detail";
        var data    = {
            userId:app.data.userId,
            questionId:this.data.questionId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                //找到正确的答案
                var answers         = res.data.answers;
                var acceptAnswers   = [];
                var hasAnswer       = false;

                for(var key in answers){

                    if(answers[key].is_accept == 1)
                    {
                        acceptAnswers.push(answers[key]);
                        answers.splice(key,1);
                        hasAnswer = true;
                    }
                }

                var questionInfo = res.data.questionInfo;
                var selfQuestion = questionInfo.user_id == app.data.userId ? true : false;
                
                this.setData({
                    questionInfo:res.data.questionInfo,
                    answers:answers,
                    acceptAnswers:acceptAnswers,
                    selfQuestion:selfQuestion,
                    hasAnswer:hasAnswer
                });
            }
        });
    },
    acceptAnswer:function(e){


        var url = app.data.api + "companyQuestion/accept_answer";

        var data = {
            questionId:this.data.questionId,
            answerId:e.currentTarget.dataset.answerId,
            userId:app.data.userId
        };

        wx.showModal({
           title: '采纳答案',
           content: '确定采纳吗',
           showCancel: true,
           cancelText: '取消',
           cancelColor: '#000000',
           confirmText: '确定',
           confirmColor: '#3CC51F',
           success: (res) => {
                // res.confirm 为 true 时，表示用户点击了确定按钮
                if(!res.confirm) {

                    return ; 
                }
                app.request(url,data,(res,error)=>{

                    res = res.data;

                    if(res.code == 200){

                        this.getQuestionDetail();
                    }
                })
            }
       })
    }

})