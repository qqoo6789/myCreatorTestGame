
var _global = typeof window === 'undefined' ? global : window;


_global.yx.proto = require("protores");

/** string **/
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}


function defineMacro (name, defaultValue) {
    // if "global_defs" not preprocessed by uglify, just declare them globally,
    // this may happened in release version's preview page.
    if (typeof _global[name] === 'undefined') {
        _global[name] = defaultValue;
    }
}

defineMacro('YX_LOCAL_TEST', false);//本地测试宏 如果打开，就不请求服务器，全流程本地，用测试数据


require("EnumDefine");

