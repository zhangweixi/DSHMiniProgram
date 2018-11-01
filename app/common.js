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

module.exports.showDialog   = showDialog;

module.exports.numberToTime = numberToTime;

module.exports.confirm      = appConfirm;