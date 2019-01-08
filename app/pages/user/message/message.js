var app = getApp();
var common = require('../../../common.js');


Page({
    data: {
        delBtnWidth: 185,
        //删除按钮宽度单位（rpx） 
        // 列表数据
        list: [{
            // 删除状态
            shows: "",
            // 列表中图片
            image: "/images/icon/video-off.png",
            // 昵称
            name: "菜鸟老五",
            // 简介title
            title: "主办方：小米科技",
            // 日期
            datas: "2017.02.21"
        },
        {
            shows: "",
            image: "/images/icon/video-off.png",
            name: "菜鸟老五",
            title: "主办方：小米科技",
            datas: "2017.02.21"
        },
        {
            shows: "",
            image: "/images/icon/video-off.png",
            name: "菜鸟老五",
            title: "主办方：小科技",
            datas: "2017.02.21"
        },
        {
            shows: "",
            image: "/images/icon/video-off.png",
            name: "菜鸟老五",
            title: "主办方：小米科技",
            datas: "2017.02.21"
        },
        {
            shows: "",
            image: "/images/icon/video-off.png",
            name: "菜鸟老五",
            title: "主办方：小米科技",
            datas: "2017.02.21"
        },

        ],

    },

    onLoad: function(options) {
        
        this.initEleWidth();
    },

    initEleWidth: function() {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },

     //获取元素自适应后的实际宽度 
    getEleWidth: function(w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth;
            var scale = (750 / 2) / (w / 2); //以宽度750px设计稿做宽度的自适应 
            // console.log(scale); 
            real = Math.floor(res / scale);
            return real;
        } catch(e) {
            return false;
            // Do something when catch error 
        }
    },

    //点击删除按钮事件 
    delItem:function(e) {

        var that = this;
        // 打印出当前选中的index
        console.log(e.currentTarget.dataset.index);
        // 获取到列表数据
        var list = that.data.list;
        // 删除
        list.splice(e.currentTarget.dataset.index, 1);
        // 重新渲染
        that.setData({
            list: list
        });

        initdata(that)
    },
      // 开始滑动事件
    touchS: function(e) {
        if (e.touches.length == 1) {
            this.setData({
                //设置触摸起始点水平方向位置 
                startX: e.touches[0].clientX
            });
        }
    },
    touchM: function(e) {
        var that = this;
        initdata(that) 
        if (e.touches.length == 1) {
            //手指移动时水平方向位置 
            var moveX = e.touches[0].clientX;
            //手指起始点位置与移动期间的差值 
            var disX = this.data.startX - moveX;
            var delBtnWidth = this.data.delBtnWidth;
            // var txtStyle = "";
            if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变 
                // txtStyle = "left:0px";
            } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离 
                // txtStyle = "left:-" + disX + "px";
                if (disX >= delBtnWidth) {
                    //控制手指移动距离最大值为删除按钮的宽度 
                    // txtStyle = "left:-" + delBtnWidth + "px";
                }
            }

        }
    },
    // 滑动中事件
    touchE: function(e) {
        if (e.changedTouches.length == 1) {

            //手指移动结束后水平位置 
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离 
            var disX = this.data.startX - endX;
            var delBtnWidth = this.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮 
            var txtStyle = "";
            txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px": "left:0px";

            //获取手指触摸的是哪一项 
            var index   = e.currentTarget.dataset.index;
            var list    = this.data.list;
            list[index].shows = txtStyle;
            console.log("1", list[index].shows);
            //更新列表的状态 
            this.setData({
                list: list
            });

        } else {
            console.log("2");
        }
    },
})



