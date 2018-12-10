// pages/readparty/partyadd/partyadd.js
var WeCropper = require('../../../template/we-cropper/we-cropper.js');
var common = require('../../../common.js');
var app = getApp();
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = width;


Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        cansubmit:false,
        cutImgPath:"",
        reaname:"",
        rule:"",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        
    },
    onShow:function(){
        this.freshButtonStatus();
    },
    selectedImg:function(){
        var option = {
            count:1,
            success:(res)=>
            {
                const files = res.tempFilePaths;
                //this.setData({cutImgPath:files[0]});
                wx.navigateTo({
                    url: '/pages/readparty/cutimage/cutimage?imgpath='+files[0]
                })
            }
        };
        wx.chooseImage(option);
    },
    //创建社群
    createParty:function(e){

        if(this.data.cansubmit == false){

            return false;
        }

        const values = e.detail.value;
        
        var url = app.data.api + "readparty/add_personal_read_party";
        var img = this.data.cutImgPath;

        if(values.partyname.length ==0){

            common.showToast('名称不能为空',"none");
            return;
        }

        if(values.regulation.length == 0){

            common.showToast('请填写规则',"none");
            return;
        }

        var data = {
            userId:app.data.userId,
            loginKey:app.data.userInfo.LoginKey,
            reaparname:values.partyname,
            regulation:values.regulation,
            imgName:"xx."+img.substr(img.lastIndexOf(".")+1)
        };
        
        wx.showLoading({
            title: '请稍等',
            mask: false,
        })

        wx.uploadFile({
            url: url, //仅为示例，非真实的接口地址
            filePath: img,
            name: 'readPartyImg',
            formData:data,
            success:(res)=>{
                
                wx.hideLoading();

                const data = JSON.parse(res.data);
                

                if(data.code == "200"){

                    common.showToast("创建成功","success");
                    setTimeout(()=>{
                         wx.navigateBack({delta: 1});
                    },1500);

                }else{

                    common.showToast(data.message,'none');

                }
                //do something
            }
        })
    },
    freshText:function(e){
        var k = e.currentTarget.dataset.type;
        var v = e.detail.value;
        if(k == "rule"){
            this.setData({rule:v});        
        }else{
            this.setData({reaname:v});        
        }    

        this.freshButtonStatus();
    },
    freshButtonStatus:function(){
        var d = this.data;
        if(d.reaname && d.cutImgPath && d.rule){
            this.setData({cansubmit:true});
        }else{
            this.setData({cansubmit:false});
        }
    }
})