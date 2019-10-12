const BaseWindow = require('BaseWindow');
const ServerInfoWidget = require("ServerInfoWidget");


cc.Class({
    extends: BaseWindow,

    properties: { 
        lastServer:             ServerInfoWidget,
        listParentNode:         cc.Node,

        serverInfoPrefab:       cc.Prefab,

        _serverlist:            null,
        _lastlogin:             null,
        _recommond:             null,
    },

    _onInit(){
        //yx.eventDispatch.addListener(yx.EventType.LOGIN_SELECT_SERVER, this.onEventSelectServer, this);
        yx.eventDispatch.addListener(yx.EventType.LOGIN_GET_SERVER_LIST, this.onEventServerListChg, this);
    },

    _onShow(){
        if (yx.serverMgr.getServerList() == null)
        {
            yx.serverMgr.reqLoginServer();
        }
        else
        {
            this._refresh();
        }        
    },

    _refresh(){
        let serverlist = yx.serverMgr.getServerList();

        if (!serverlist)
        {
            return;
        }

        for (let i = 0; i < serverlist.length; i++)
        {
            let serverWidget = cc.instantiate(this.serverInfoPrefab);
            let serverSrc = serverWidget.getComponent(ServerInfoWidget);

            if (serverSrc)
            {
                serverSrc.init(serverlist[i]);
                this.setServerBtnCallback(serverWidget);

                serverWidget.parent = this.listParentNode;
            }
        }

        let lastLogin = yx.serverMgr.getLastLogin();

        if (lastLogin)
        {
            this.lastServer.init(lastLogin);
            this.setServerBtnCallback(this.lastServer.node);
        }       
    },

    setServerBtnCallback(node){
        node.on('click', this.onServerBtnClick, this);
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
    },

    onServerBtnClick(serverBtn){
        let serverInfoSrc = serverBtn.getComponent(ServerInfoWidget);

        if (serverInfoSrc)
        {
            yx.serverMgr.setCurServerInfo(serverInfoSrc.getInfo());
        
            yx.eventDispatch.dispatchMsg(yx.EventType.LOGIN_GET_SERVER_LIST);
        }
        
        this.onCloseBtnClick();
    },

    //服务器列表有更新
    onEventServerListChg(){
        if (this.isShown()){
            this._refresh();
        }
    },

    // onEventSelectServer(info){
    //     if (info != null)
    //     {
    //         this._lastlogin = info.id;
    //         //this.lastServer.init(info);
    //     }
    //     this.onCloseBtnClick();
    // },
});