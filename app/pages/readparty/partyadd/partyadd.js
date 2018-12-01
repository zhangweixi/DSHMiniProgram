// pages/readparty/partyadd/partyadd.js
var WeCropper = require('../../../template/we-cropper/we-cropper.js');
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
        headImg:"/images/temp/video-bg.png",
        cropperOpt: {
            id: 'cropper',
            width,  // 画布宽度
            height, // 画布高度
            scale: 2.5, // 最大缩放倍数
            zoom: 8, // 缩放系数
            cut: {
                x: (width - 200) / 2, // 裁剪框x轴起点
                y: (width - 200) / 2, // 裁剪框y轴期起点
                width: 200, // 裁剪框宽度
                height: 200 // 裁剪框高度
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

         const { cropperOpt } = this.data;
          // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
        new WeCropper(cropperOpt)
            .on('ready', (ctx) => {
                console.log(`wecropper is ready for work!`)
            })
            .on('beforeImageLoad', (ctx) => {
                console.log(`before picture loaded, i can do something`)
                console.log(`current canvas context: ${ctx}`)
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                console.log(`picture loaded`)
                console.log(`current canvas context: ${ctx}`)
                wx.hideToast()
            })   

            // 若同一个页面由多个裁剪容器，需要主动做如下处理
            //this.A = new weCropper(cropperOptA)
            //this.B = new weCropper(cropperOptB)
    },
    selectedImg:function(){
        var option = {
            count:1,
            success:(res)=>
            {
                const files = res.tempFilePaths;
                this.setData({headImg:files[0]});
                this.wecropper.pushOrign(files[0]);
                console.log(this.wecropper);
               

                this.wecropper.getCropperImage((src) => {
                    console.log(src);
                    return ;
                    if (src) {
                      wx.previewImage({
                        current: '', // 当前显示图片的http链接
                        urls: [src] // 需要预览的图片http链接列表
                      })
                    } else {
                      console.log('获取图片地址失败，请稍后重试')
                    }
                })
            }
        };
        wx.chooseImage(option);
    },
    uploadFile:function(){
        
        wx.uploadFile({
            url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {'user': 'test'},
            success:(res)=>{
                const data = res.data
                //do something


            }
        })
    }
})