

var app = getApp();
/**
 * msgType有三种类型
 * success
 * warning
 * error
 */
function showDialog(obj,msg,msgType){

    obj.setData({
        "dialogStatus": true,
        "dialogMsg":msg,
        "dialogType":msgType
    });

    var dialogTimer = setTimeout(()=>{
        
        obj.setData({"dialogStatus":false});

        clearTimeout(dialogTimer);

    },2000);
}


/**
 * 数字转换时间
 * 
 * */
function numberToTime(num)
{
    var minute = parseInt(num / 60);

    var second  = parseInt(num  % 60);

    if(minute < 10){

        minute = "0" + minute;
    }

    if(second < 10 )
    {
        second = "0"+second;
    }
    
    return minute + ":" + second;
}

/**
 * 确定对话框
 * common.confirm(this,"标题","消息",this.callback);
 */
function appConfirm(obj,title,msg,callback,sureText = '确定',cancelText = '取消'){
    var data = {
    "confirmShow":true,
    "confirmTitle":title,
    "confirmMsg":msg,
    "confirmSureText":sureText,
    "confirmCancelText":cancelText};

    obj.setData(data);
    obj.confirmCallback = callback;

    obj.confirmClose = function(){
        this.setData({'confirmShow':false});
    }
}

/**
 * 播放背景音乐
 */
function playBgMusic(src, title) {
    
    var bgVideo = wx.getBackgroundAudioManager();
    bgVideo.src = src;
    bgVideo.title = title;
    bgVideo.play();
}

var bgMusic = {

    play: function(src, title) 
    {
        var bgVideo     = wx.getBackgroundAudioManager();
        bgVideo.src     = src;
        bgVideo.title   = title;
        bgVideo.play();
    },
    parse:function(){

        var bgVideo = wx.getBackgroundAudioManager();
        bgVideo.pause();
    },
    stop:function(){
        var bgVideo = wx.getBackgroundAudioManager();
        bgVideo.stop();
        wx.clearStorageSync("bgMusic");
    },
    setData:function(option){

        var bgMusic = wx.getStorageSync("bgMusic");
        
        if (!bgMusic) {
            bgMusic = {};
        }

        for(var key in option){

            bgMusic[key] = option[key];
        }
        wx.setStorageSync("bgMusic", bgMusic);
    },
    getData:function(){
        
        return wx.getStorageSync("bgMusic");
    }
};


var user = {

    login:function(code){

        var url = app.data.api + "user/login?code=" + code;

        wx.request({
            // 必需
            url: url,
            method:"POST",
            success: (res) => {
                   
                console.log(res);
            }
        })
    }
};

module.exports.showDialog   = showDialog;

module.exports.numberToTime = numberToTime;

module.exports.confirm      = appConfirm;

module.exports.bgMusic      = bgMusic;
