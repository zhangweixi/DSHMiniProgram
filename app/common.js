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

module.exports.showDialog = showDialog;