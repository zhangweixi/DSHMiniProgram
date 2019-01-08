var app = getApp();
var common = require('../../../common.js');


Page({
    data: {
        delBtnWidth: 185, //删除按钮宽度单位（rpx） 
        hasNextPage:true,
        page:0,
        messages:[]
    },

    onLoad: function(options) {
        
        this.initEleWidth();

        //获取事件
        setTimeout(()=>{

            this.getMessages();

        },app.data.debugTime);
    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {

        this.setData({page:0,hasNextPage:true});
        this.getMessages();
    },

    /**
    * 页面上拉触底事件的处理函数
    */
    onReachBottom: function () {
          
        if(this.data.hasNextPage == true){

            this.getMessages();
        }
    },

    getMessages:function(){

        var url = app.data.api + "message/get_user_message";
        var data = {
            userId:app.data.userId,
            page:this.data.page+1
        };

        common.showLoading('加载中');
        app.request(url,{userId:app.data.userId},(res,error)=>{

            common.stopFresh();
            

            var messages    = res.data.data.data;
                


            if(messages.length == 0){

                this.setData({hasNextPage:false});

                return;
            }
            messages      = this.data.messages.concat(messages);
            this.setData({
                messages:messages,
                page:res.data.data.current_page
            });
        })
    },
    initEleWidth: function() {

        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);

        this.setData({delBtnWidth: delBtnWidth});
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
        var dataset = e.currentTarget.dataset;
        // 打印出当前选中的index
        
        var url = app.data.api + "message/del_message";
        var data = {msgId:dataset.id};
        app.request(url,data,()=>{

            // 获取到列表数据
            var list = that.data.messages;
            // 删除
            list.splice(dataset.index, 1);
            // 重新渲染
            that.setData({messages: list});

        });
    },
      // 开始滑动事件
    touchS: function(e) {
        if (e.touches.length == 1) {
             //设置触摸起始点水平方向位置 

            this.setData({
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY
            });
        }
    },
    touchM: function(e) {
        var that = this;
        //initdata(that) 
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
            var index       = e.currentTarget.dataset.index;
            var messages    = this.data.messages;
                messages[index].shows = txtStyle;
            
            console.log("1", messages[index].shows);
            //更新列表的状态 
            this.setData({messages: messages});

        } else {
            console.log("2");
        }
    },
})



