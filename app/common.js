

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


function appConfirmInputShow(obj,defaultValue, title, msg, sureCallback, cancelCallback, sureText = '确定', cancelText = '取消') {
    var data = {
        "confirmInputShow": true,
        "confirmTitle": title,
        "confirmMsg": msg,
        "confirmSureText": sureText,
        "confirmCancelText": cancelText,
        "confirmInputValue": defaultValue
    };

    obj.setData(data);
    obj.confirmFromCallback = sureCallback;

    obj.confirmInputClose = function () {
        
        this.setData({ 'confirmInputShow': false });

        if(cancelCallback != null){

            cancelCallback();
        }
        
    }
}


function appConfirmInputClose(obj) {
   
    obj.setData({ 'confirmInputShow': false });
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
    },
    //检查用户是否是有效的用户
    checkIsLogin:function(pageScope){
        
        if(app.data.userId > 0){

            return true;
        }
        var tologin=function(){

            wx.switchBar({url:"/pages/user/center/center"});
        };

        common.appConfirm(pageScope,"请先登录","现在就去登录",tologin,"去登录","取消");

    }
};

function request(url,data,callback){

    wx.request({
        url: url,
        data: data,
        method: 'POST',
        success: function (res) {
            typeof callback == "function" && callback(null, res)
        },
        fail: function () {
            typeof callback == "function" && callback(res)
        }
  })
}

var readparty= {
    cache:function(readPartyId,callback){

        var app = getApp();
        var url = app.data.api + "readparty/get_read_party_detail";
        var data = {
            readPartyId:readPartyId
        };

        app.request(url,data,(res,error)=>{

            res = res.data;
            var readPartyInfo = res.data.readPartyInfo;
            wx.setStorageSync('readpartyInfo',readPartyInfo);
            //缓存
            if(callback != null){

                callback(res,error);    
            }
        });
    },
    get:function(){

        return wx.getStorageSync('readpartyInfo');
    },
    getDepartments:function(){

        return wx.getStorageSync('departments');

    },
    cacheDepartments:function(readPartyId,callback){
        
        var app = getApp();
        var url = app.data.api + "company/get_department";

        var data = {
            readPartyId:readPartyId
        };
        
        app.request(url,data,(res,error)=>{

            var departments =res.data.data.departments;
            
            wx.setStorageSync('departments', departments);
            
            if(callback != null){

                callback(departments);
            }
        });

    }
}

module.exports.showDialog   = showDialog;

module.exports.numberToTime = numberToTime;

module.exports.confirm      = appConfirm;

module.exports.confirmInput = appConfirmInputShow;

module.exports.confirmInputClose = appConfirmInputClose;


module.exports.bgMusic      = bgMusic;

module.exports.request      = request;

module.exports.readparty    = readparty;
