// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//const eventDispatch = require("EventDispatch");

require("FrameWork");


cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    /**
     * 各大模块的初始化调用可以放在这里
     */
    onLoad () 
    {
        cc.log("GameMain onLoad3333333");

        cc.game.addPersistRootNode(this.node);

        //require("framework");
        yx.cfgMgr.init();    
        yx.windowMgr.init();
        yx.network.init();  
        

        //yx.evtDispatch.dispatchMsg(eventDispatch.EventType.Global.AppInit);

        // require("ProtoBufManager").loadProtoBuf();
        // require("TableUtil").initAllTable();
        yx.eventDispatch.addListener("test1", this.test1, this);
        yx.eventDispatch.addListener("test2", this.test2, this);
        yx.eventDispatch.addListener("test3", this.test3, this);

    },

    start () {       
        yx.windowMgr.showWindow("login");
    },
    
    //1.测试发送的时候删除
    //a.删除自己
    //b.删除其他人

    //2.测试发送的时候添加
    //a.添加自己
    //b.添加其他人

    //3.测试发送的时候发送
    //a.发送自己
    //b.发送其他人

    test1(a){
        cc.log("test1:", a);
        //yx.evtDispatch.dispatchMsg("test1", "333");

        var callback = function (isSuccess, data) {
            cc.log("isSuccess = " + isSuccess);
            if (isSuccess) {
                
            } else {
                
            }
        };

        // yx.http.httpGet("http://www.baidu.com", callback);
        // yx.http.httpRequest("http://www.baidu.com", callback);
    },

    test2(b)
    {
        cc.log("test2", b);
    },

    test3(c){
        cc.log("test3", c);
    },

    // onDestroy: function(){

    // },
});
