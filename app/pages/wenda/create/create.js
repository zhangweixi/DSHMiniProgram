// pages/wenda/create/create.js
var app     = getApp();
var common = require('../../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        content:'',
        isAnonymous:false,
        questionType:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            questionType:options.type
        })
    },
    freshContent:function(e){

        this.setData({
            content:e.detail.value
        });
    },
    triggleAnonymous:function(){

        this.setData({isAnonymous:!this.data.isAnonymous});
    },

    addQuestion:function(){

        if(this.data.content.length < 10){

            return;
        }

        var url = app.data.api + "companyQuestion/add_question";

        var data = {
            userId:app.data.userId,
            isAnonymous:this.data.isAnonymous,
            question:this.data.content,
            questionType:this.data.questionType
        };

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){

                common.showToast("已添加","success");

            }

        })
    }
})