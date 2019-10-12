const BaseWindow = require('BaseWindow');

cc.Class({
    //name: 'LoginWindow',
    extends: BaseWindow,

    properties: {        
        
    },

    _onInit(){
        yx.eventDispatch.addOnceListener(yx.EventType.GET_PLAYER_INFO, this.onEventGetPlayerInfo, this);
    },

    onSelectClick(){

    },

    onCreateClick(){
        yx.playerMgr.reqRegister();
    },

    onEventGetPlayerInfo(){
        //LoginWindow已经监听了这个事件，有加跳转处理，这里就不再跳转了
        // //获取玩家信息成功了就跳转场景
        // yx.sceneMgr.loadScene("main", function(isSucc){
        //     cc.log("onEnterGameClick load scene succ:" + isSucc);

        //     if (isSucc)
        //     {
        //         //要改到windowMgr自己的注册事件中处理
        //         //yx.windowMgr.resetRootNode();
        //         yx.windowMgr.showWindow("main");
        //         //yx.windowMgr.showWindow("TownWindow");
        //     }
        // });
    },

   
});