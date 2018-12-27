// pages/wenda/index/index.js
var app = getApp();
var common = require('../../../common.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        questionType:0,
        page:0,
        userId:0,
        questions:[],
        showType:0,//0全部，1已解答 2我的 3 按类型
        hasNextPage:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({userId:app.data.userId});    
        this.getQuestion();
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

        this.setData({page:0});

        this.getQuestion();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        this.getQuestion();
    },
    nav:function(e){
        var obj         = e.currentTarget;
        var needUser    = obj.dataset.user;
        var url         = obj.dataset.url;
        if(needUser == 1 && app.data.userId == 0){

            common.showToast('请登录','none');
            return ;
        }
        wx.navigateTo({url: url});
    },
    getQuestion:function(){

        if(this.data.hasNextPage == false){

            return;
        }

        var url     = app.data.api + "companyQuestion/question_page";
        var data    = {
            showType:this.data.showType,
            userId:app.data.userId,
            questionType:this.data.questionType,
            page:this.data.page+1,
        };

        wx.showLoading({
            title: '',
            mask: false
        })

        app.request(url,data,(res,error)=>{

            wx.hideLoading();

            res = res.data;
            var question = res.data.questions;

            if(question.current_page <=1){
                
                this.setData({questions:[]});
            }

           
            
            if(question.data.length > 0){

                for(var quest of question.data){

                    if(quest.question.length > 50){
                        quest.question = quest.question.substr(0,50)+"...";
                    }

                    this.data.questions.push(quest);
                }

                this.setData(
                {
                    questions:this.data.questions,
                    page:question.current_page,
                    hasNextPage:question.data.length < question.per_page ? false : true
                });

            }else{

                this.setData({hasNextPage:false});

            }
        })
        
    },
    //切换类型
    triggleType:function(e){

        var showType = e.currentTarget.dataset.type;
        if(showType == this.data.showType){

            return;
        }

        this.setData({showType:showType,page:0,hasNextPage:true});
        this.getQuestion();
    }
})