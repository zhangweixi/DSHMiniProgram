// pages/readparty/cutimage/cutimage.js
 import WeCropper from '../../../template/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
//const height = device.windowHeight
const height = width
const cutwidth = width-100
console.log(height)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgpath:"",
        cropperOpt: {
            id: 'cropper',
            width,  // 画布宽度
            height, // 画布高度
            scale: 2.5, // 最大缩放倍数
            zoom: 8, // 缩放系数
            src:"http://tmp/wxb8842464f6dac6b2.o6zAJswewAqQcoljv90U7RTR9NIw.ZKHtXjE92iOfc33f2b2d239eabbe2859f91b4b704641.jpg",
            cut: {
                x: (width - cutwidth) / 2, // 裁剪框x轴起点
                y: (width - cutwidth) / 2, // 裁剪框y轴期起点
                width: cutwidth, // 裁剪框宽度
                height: cutwidth // 裁剪框高度
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        const { cropperOpt } = this.data

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

        //设置图片
        var imgpath = options.imgpath;
        if(imgpath){

            this.wecropper.pushOrign(imgpath)    
        }
    },
    touchStart (e) {
        this.wecropper.touchStart(e)
    },
    touchMove (e) {
        this.wecropper.touchMove(e)
    },
    touchEnd (e) {
        this.wecropper.touchEnd(e)
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    uploadTap () {
        const self = this

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success (res) {
                const src = res.tempFilePaths[0]

                self.wecropper.pushOrign(src)
            }
      })
    },
    //图片确定好了
    getCropperImage () {
        this.wecropper.getCropperImage((src) => 
        {
            //设置前一个界面的数据
            if (src) {

                let pages = getCurrentPages();
                //prevPage 相当于上个页面的this，可以通过setData修改上个页面参数执行上个页面的方法等
                let prevPage = pages[pages.length - 2]

                prevPage.setData({cutImgPath:src});
                wx.navigateBack({
                    delta: 1
                });
            } else {
                console.log('获取图片地址失败，请稍后重试')
            }
        })
     }
})