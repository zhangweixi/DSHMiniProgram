// pages/wenda/category/category.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        app:null,
        questions:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        wx.setNavigationBarTitle({
            title: options.type
        })

        setTimeout(()=>{

            this.setData({
                app:app,
                questionType:options.type,
                page:0,
            })

            this.getQuestion();

        },1000);
        
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
    getQuestion:function(){

        var url     = app.data.api + "companyQuestion/question_page";
        var data    = {
            showType:0,
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
                        quest.question  = quest.question.substr(0,50)+"...";
                        
                    }

                    if(typeof quest.anwser != 'undefined' && quest.anwser.length > 30){

                        quest.anwser    = quest.anwser.substr(0,30)+"...";
                    }

                    if(quest.is_anonymous == 1){

                        quest.YourName = "匿名";
                        quest.head_img = "https://wx.laohoulundao.com/images/default-images/default-head-img.jpg";

                    }

                    this.data.questions.push(quest);
                }

                this.setData({questions:this.data.questions,page:question.current_page});

            }
        })
        
    },
    nav:function(e){
        var url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url
        })
    },
})