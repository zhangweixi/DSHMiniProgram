var app     = getApp();
var common  = require("../../../common.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        advice:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //查看缓存中是否有
        var advice = wx.getStorageSync('advice');
        if(advice)
        {
            this.setData({advice:advice});
        }
    },
    addAdvice:function(e){
        
        var advice  = e.detail.value.advice;
        
        if(!advice.trim()){

            common.showToast("内容不能为空","none");
            return;
        }
        wx.showModal({
            title: '',
            content: '确定提交吗',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#FFB800',
            success: (res) => {
                if(res.confirm) {
                   
                   this.addAdviceAction(advice);
                }
            }
        })
    },
    addAdviceAction:function(content){

        var url     = app.data.api + "member/suggestionsStore";
        var data    = {userId:app.data.userId,content:content};

        app.request(url,data,(res,error)=>{

            res = res.data;

            if(res.code == 200){
                common.showToast('已提交','success');
                wx.clearStorage("advice");
                
            }
        })
    },
    adviceChange:function(e){

        var advice = e.detail.value;

        if(advice){

            wx.setStorageSync('advice', advice)        
        }
    }
})