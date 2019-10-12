const BaseWindow = require('BaseWindow');
const ServerInfoWidget = require("ServerInfoWidget");



cc.Class({
    //name: 'LoginWindow',
    extends: BaseWindow,

    properties: {        
        //loginStatusLabel:   cc.Label,
        //serverNameLabel:    cc.Label,
        //serverStatusSp:     cc.Sprite,

        curServerWidget:    ServerInfoWidget,
        usernameEditBox:    cc.EditBox,
    },

    _onInit(){
        cc.log("LoginWindow _onInit");

        yx.eventDispatch.addOnceListener(yx.EventType.SERVER_CONNECTED, this.onEventServerConnected, this);
        yx.eventDispatch.addOnceListener(yx.EventType.GET_PLAYER_INFO, this.onEventGetPlayerInfo, this);
        //yx.eventDispatch.addListener(yx.EventType.LOGIN_SELECT_SERVER, this.onEventSelectServer, this);
        yx.eventDispatch.addListener(yx.EventType.LOGIN_GET_SERVER_LIST, this.onEventServerListChg, this);
        //yx.network.addHandler(yx.proto.CmdId.C2S_Login, this.onMessageHandler);
        
        this.curServerWidget.init(null);
        this.curServerWidget.node.on('click', this.onServerBtnClick, this);

        //请求登录服务器获取服务器列表
        //yx.serverMgr.reqLoginServer();

        let username = yx.localStorage.Load(yx.LSKey.USERNAME);

        if (username)
        {
            this.usernameEditBox.string = username;

            yx.serverMgr.setUserName(this.usernameEditBox.string);
        }

        // let lastlogin = yx.localStorage.Load(yx.LSKey.LAST_LOGIN);

        // if (lastlogin)
        // {
        //     this.curServerWidget.init(lastlogin);
        //     yx.serverMgr.setCurServerInfo(lastlogin);
        // }
    },

    _onShow(){
        //TODO:登录界面显示后根据SDK需要可以考虑自动弹出SDK的登录来
        //yx.network.connectServer("192.168.101.38", 8888);
    },

    _onHide(){
     
    }, 

    onUserNameEditDidEnded(editbox, customEventData){
        if (this.usernameEditBox.string.length > 0)
        {
            yx.serverMgr.setUserName(this.usernameEditBox.string);

            //缓存用户名
            yx.localStorage.Save(yx.LSKey.USERNAME, this.usernameEditBox.string);
        }        
    },

    onEnterGameClick(){
        //cc.log(yx.textDict.TestAttr);
        if (YX_LOCAL_TEST)
        {
            this.onEventGetPlayerInfo();
        }
        else
        {
            if (this.usernameEditBox.string.length == 0)
            {
                yx.ToastUtil.showListToast("请输入用户名", this.node);
                return;
            }

            let serverInfo = yx.serverMgr.getCurServerInfo();
            if (serverInfo != null && serverInfo.host.length > 0)
            {
                yx.network.connectServer(serverInfo.host, serverInfo.port);
            }  
            else
            {
                yx.ToastUtil.showListToast("服务器为空", this.node);
            }
        }
    },    

    onLoginBtnClick(){
        //login or logout
        cc.log("onLoginBtnClick");

        //
    },

    onServerBtnClick(){
        //show server list
        cc.log("onServerBtnClick");
        if (this.usernameEditBox.string.length == 0)
        {
            yx.ToastUtil.showListToast("请输入用户名", this.node);
            return;
        }

        // if (this.curServerWidget.getInfo() != null)
        // {
        //     yx.serverMgr.reqLoginServer();
        // }   
        // else
        {
            yx.windowMgr.showWindow("serverlist");
        }        
    },

    onGaoShiBtnClick(){
        cc.log("onGaoShiBtnClick");
    },


     //服务器连接成功，可以发第一条协议了
     onEventServerConnected(){
        

        let loginReq = new yx.proto.C2S_Login();

        loginReq.channel = yx.serverMgr.getChannel();
        loginReq.session = yx.serverMgr.getSession();
        loginReq.uid = yx.serverMgr.getUid();
        loginReq.openId = yx.serverMgr.getOpenId();
        loginReq.sid = yx.serverMgr.getCurServerInfo().id;

        cc.log("[LoginWindow onServerConnected] login with:", loginReq);

        yx.network.sendMessage(yx.proto.CmdId.LOGIN, loginReq);
    },

    onEventGetPlayerInfo(){
        //获取玩家信息成功了就跳转场景
        yx.sceneMgr.loadScene("main", function(isSucc){
            cc.log("onEnterGameClick load scene succ:" + isSucc);

            if (isSucc)
            {
                //要改到windowMgr自己的注册事件中处理
                //yx.windowMgr.resetRootNode();
                yx.windowMgr.showWindow("main");
                //yx.windowMgr.showWindow("TownWindow");
            }
        });
    },

    //服务器列表有更新
    onEventServerListChg(){
        this.curServerWidget.init(yx.serverMgr.getCurServerInfo());
    },
});