
/**
 * !#en ServerMgr
 * !#zh 服务器数据类
 * @class ServerMgr
 * @extends 
 */

let _channel = "default0";

yx.ServerMgr = function () {
   
};

yx.ServerMgr.prototype = {
    constructor: yx.ServerMgr,
  
    init: function () {
        this._serverlist = null;
        this._lastlogin = null;
        this._recommond = null;

        this._userInfo = {};
        this._userInfo.uid = 0;
        this._userInfo.channel = _channel;
        this._userInfo.openId = 0;
        this._userInfo.session = 0;

        this._curServerInfo = null;
        this._lastServerInfo = null;

        this._username = "";
    },

    createServerInfo(serverInfo){
        let obj = {};

        obj.id = serverInfo.id;
        obj.name = serverInfo.name;
        obj.host = serverInfo.host;
        obj.port = serverInfo.port;
        obj.status = serverInfo.status;

        return obj;
    },

    setUserName(username){
        this._username = username;
    },

    getUserName(){
        return this._username;
    },

    setCurServerInfo(serverInfo){
        this._curServerInfo = this.createServerInfo(serverInfo);

        //缓存服务器信息 不能缓存，要找登录服拿session
        //yx.localStorage.Save(yx.LSKey.LAST_LOGIN, this._curServerInfo);
    },

    getCurServerInfo(){
        return this._curServerInfo;
    },

    getLastLogin(){
        return this._lastServerInfo;
    },

    getServerList(){
        return this._serverlist;
    },

    setAllServerInfo(serverlist, lastlogin, recommond)
    {
        this._serverlist = serverlist;
        this._lastlogin = lastlogin;
        this._recommond = recommond;

        if (this._lastlogin.constructor != Number)
        {        
            this._lastlogin = 1;
        }

        let lastloginid = this._lastlogin;
        let lastloginInfo = this._serverlist.find(serverinfo=>{
            if (serverinfo.id == lastloginid)
            {
                return serverinfo;
            }
        });

        if (!lastloginInfo)
        {
            lastloginInfo = this._serverlist[0];
        }

        this._lastServerInfo = this.createServerInfo(lastloginInfo);

        //this._curServerInfo = this.createServerInfo(this._lastServerInfo);        
    },

    setUserInfo(uid, channel, openId, session){
        this._userInfo.uid = uid;    
        this._userInfo.channel = channel;   
        this._userInfo.openId = openId;
        this._userInfo.session = session;  
    },

    getUid(){
        return this._userInfo.uid;
    },

    getChannel(){
        return this._userInfo.channel;
    },    

    getOpenId(){
        return this._userInfo.openId;
    },

    getSession(){
        return this._userInfo.session;
    },





    //////////////////////////////////以下是请求//////////////////////////////////

    reqLoginServer()
    {
        //TODO: 请求服务器列表 获取登录TOKEN
        let url = "http://120.24.102.251:8080/xgame-login/login";
        let params = {
            version: "1.0",
            channel: _channel,
            openId: yx.serverMgr.getUserName()
        };

        yx.http.httpPost(url, JSON.stringify(params),  yx.serverMgr.respLoginServer);
    },

    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////
    respLoginServer(isSucc, result){  
        if (isSucc)
        {
            cc.log("login http result:", result);

            let retObj;
            try{
                retObj = JSON.parse(result);

                if (retObj.code == 0)
                {
                    yx.serverMgr.setAllServerInfo(retObj.serverlist, retObj.lastlogin, retObj.recommond);

                    yx.serverMgr.setUserInfo(retObj.userId, _channel, retObj.openId, retObj.session);   
                    
                    //通知服务器列表有更新了
                    yx.eventDispatch.dispatchMsg(yx.EventType.LOGIN_GET_SERVER_LIST);
                }
                else
                {
                    yx.ToastUtil.showListToast("code:" + retObj.code + " " + retObj.msg);
                }
            }
            catch(ex)
            {
                cc.error("[ServerMgr respLoginServer] error:", ex);
            } 
        }
        else
        {
            cc.warn("login http err:", result);
        }
    }, 
};

/**
 * !#en ServerMgr
 * !#zh 服务器数据类
 * @property serverMgr
 * @type {ServerMgr}
 */
yx.serverMgr = new yx.ServerMgr();

module.exports = yx.serverMgr;