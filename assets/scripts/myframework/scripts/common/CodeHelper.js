

let codeHelper = {

    NewClickEvent(component, callbackName){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = component.node;
        clickEventHandler.component = component.constructor.name; //"GongFaWindow";
        clickEventHandler.handler = callbackName;//"onUpgradeConfirmBtnClick";

        return clickEventHandler;
    },

    //深度克隆
    deepClone(origin, target) {
        var target = target || {}, toStr = Object.prototype.toString, arrStr = "[object Array]";
        for (var prop in origin) {
            if (origin.hasOwnProperty(prop)) {
                if (origin[prop] !== "null" && typeof (origin[prop]) == "object"){
                    target[prop] = (toStr.call(origin[prop]) == arrStr) ? [] : {};
                    this.deepClone(origin[prop], target[prop]);
                } else {
                    target[prop] = origin[prop];
                }
            }
        }
    },  

    array2ccv2(array){
        let v = cc.v2(0, 0);

        if (array && array instanceof Array && array.length == 2)
        {
            v = cc.v2(array[0], array[1]);
        }

        return v;
    },
};


module.exports = yx.CodeHelper = codeHelper;