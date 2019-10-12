

const socketWrapper = require("SocketWrapper");
//----------------------------------------------------------------------------------------------------------------------

//网络检测时间间隔
const CST_NetWork_Check_Time = 1000;
//最大重连次数
const CST_RETRY_TIMES_MAX = 6;
//----------------------------------------------------------------------------------------------------------------------

/**
 * !#en NetWork
 * !#zh 窗口管理类。
 * @class NetWork
 * @type {NetWork}
 */
yx.NetWork = function () {
    this._currIp = null;
    this._currPort = null;
    //定时器ID
    this._timeoutId = null;
    //重连的次数
    this._retryTimes = 0;
    //服务器类型
    this._currServerType = 0;
    //重连timer
    this._reconnectTimerId = null;

    //this._init();
};



yx.NetWork.prototype = {
    constructor: yx.NetWork,
    init: function () {

        this._msgHandlerMap = new Map();

        yx.serverMgr.init();
        yx.playerMgr.init();
        yx.bagMgr.init();
        yx.mailMgr.init();
        yx.wudaoMgr.init();
        yx.gongfaMgr.init();
        yx.caveMgr.init();
        yx.fangshiMgr.init();
        yx.chuiDiaoMgr.init();
        yx.battleMgr.init();
        yx.shengShouMgr.init();
 		yx.menPaiMgr.init();
        yx.JiYuanMgr.init();
        yx.daoLvMgr.init();
        yx.heiShiMgr.init();
        yx.shenYouMgr.init();
        yx.ActivityMgr.init();

        cc.log("NetWork init");
        return true;
    },

    
    /**
     * 连接服务器
     * @param {Number} ip 
     * @param {Number} port
     */
    connectServer(ip, port) {    
        this._initSocket(ip, port);
    },

    disConnect: function () {
        this._currIp = null;
        socketWrapper.closeSocket();
    },

    /**
     * 一般的重连逻辑在内部就处理完了，这里留个接口给弹框重连
     */
    reconnect() {
        // if (self._reconnectTimerId) {
        //     clearTimeout(self._reconnectTimerId);
        //     self._reconnectTimerId = null;
        // }
        // if(self.isNetConnected()){
        //     cc.log("reconnectCurrIP, isNetConnected!!!");
        //     return;
        // }
        // if (self._currIp == null){  //使用CloseNetwork主动关闭网络，不用进行重连
        //     cc.log("reconnectCurrIP, self._currIp == null!!!");
        //     return;
        // }
        // //由于我们处理网络消息会有延时，所以这里必须延迟处理
        // self._reconnectTimerId = setTimeout(() => {
        //     if (self._currIp != null) {
        //         self._connectTo(self._currIp, self._currPort);
        //     }
        // }, 2000);
    },


    /**
     * 检查网络状态，如果当前有连接，就先关闭
     * @param {Number} ip 
     * @param {Number} port 
     */
    _initSocket: function (ip, port) {
        if (socketWrapper.isConnected()) 
        {
            this._currIp = null;

            socketWrapper.closeSocket();

            if (this._timeoutId == null) { //防止重复进入...
                this._timeoutId = setTimeout(() => { this._initSocket(ip, port) }, CST_NetWork_Check_Time);
            }
        }
        else 
        {
            if (this._timeoutId != null) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }

            this._connectTo(ip, port);
        }
    },

    _connectTo(ip, port){
        this._currIp = ip;
        this._currPort = port;
        cc.log("_connectTo, ip=" + ip + ", this._retryTimes=" + this._retryTimes);

        socketWrapper.socketConnection(ip, port, this._socketEvtCb);
    },

    _socketEvtCb: function (evtType, evt) {
        cc.log("Network socketevtcb evttype:" + evtType);
        switch (evtType) {
            case "onopen":
                yx.network._retryTimes = 0;
                //self._showMaskPanel(false);
                //连接上以后要发登录请求
                // var _token = dataAccount.getAccessToken();
                 //require("LoginMsgHandler").sendLoginHallReq(_token);
                // let obj = new yx.proto.TipMessage();
                // obj.code = 101;
                // obj.parameters = ["112233", "dsf", "fffffffffffff"];
                // obj.cmd = 3;


                // //yx.network.sendMessage(3, obj);
                //yx.network.sendTestData();

                yx.eventDispatch.dispatchMsg(yx.EventType.SERVER_CONNECTED);
                break;
            case "onmessage":
                yx.network.recvMessage(evt.data);
                break;
            case "onerror":
                break;
            case "onclose":
                yx.network.reconnect();
                break;
        }
    },

    addHandler(cmd, handlerFunction){
        if (this._msgHandlerMap.has(cmd))
        {
            //请不要重复注册
            cc.error("[NetWork addHanler] cmdid:" + cmd + " Cmd:" + yx.proto.CmdId[cmd]  + " duplicate");
            return;
        }
        this._msgHandlerMap.set(cmd, handlerFunction);
    },

    //仅作为测试用，直接发数据
    sendTestData(){
        let sendObj = new yx.proto.S2C_Login();
        sendObj.register = true;
        let msgPackObj = new yx.proto.S2C_MsgPack();
        msgPackObj.cmd = 1;
     
        msgPackObj.data = sendObj.constructor.encode(sendObj).finish();

        let data = msgPackObj.constructor.encode(msgPackObj).finish();
        
        yx.network.recvMessage(data);
    },  

    sendMessageData(cmd, msgObj){
        if (msgObj == undefined || msgObj.constructor.encode == undefined)
        {
            cc.warn("[Network sendMessage] msgObj undefined or type is error");
            return;
        }

        let data = msgObj.constructor.encode(msgObj).finish();

        cc.log("send test data");
        socketWrapper.sendMessage(data);
    },

    /**
     * 发送protobuf消息
     * @param {Number} cmdId 消息ID，定义在protores文件的cmdId枚举里
     * @param {Object} msgObj 要发送的消息对象
     */
    sendMessage(cmdId, msgObj){
        if (cmdId == undefined)
        {
            cc.warn("[Network sendMessage] cmdId undefined");
            return;
        }

        //msgObj不能不传，就算是没有任何内容的消息，也要有一个message Object传过来
        //有cmdId就要有对象的pb message对象
        if (msgObj == undefined || msgObj.constructor.encode == undefined)
        {
            cc.warn("[Network sendMessage] msgObj undefined or type is error");
            return;
        }

        //TODO:要加网络状态判断，没联网就不发了

        let msgPackObj = new yx.proto.C2S_MsgPack();

        msgPackObj.cmd = cmdId;
        //msgPackObj.data = msgObj.encode().finish();
        msgPackObj.data = msgObj.constructor.encode(msgObj).finish();

        let data = msgPackObj.constructor.encode(msgPackObj).finish();

        cc.log("[Network SendData] cmdid:" + cmdId + " Cmd:" + yx.proto.CmdId[cmdId] + " len:" + data.length + " time:" + yx.timeUtil.getNowTimeString());
        socketWrapper.sendMessage(data);
    },

    recvMessage(data) {
        //不使用分开的那一套，把所有信息装到一个统一的proto里面，
        //所以解的时候先解一个统一的proto

        try
        {
            var msgPack = yx.proto.S2C_MsgPack.decode(new Uint8Array(data));

            cc.log("[Network RecvData] cmdid:" + msgPack.cmd + " Cmd:" + yx.proto.CmdId[msgPack.cmd] + " len:" + data.byteLength + " time:" + yx.timeUtil.getNowTimeString());
        
            // if (msgPack.errMsg != null && msgPack.errMsg.length > 0)
            // {
            //     cc.log("recvmessage error:" + msgPack.errMsg);
            //     return;
            // }
            
            if (this._msgHandlerMap.has(msgPack.cmd))
            {
                let handler = this._msgHandlerMap.get(msgPack.cmd);

                if (handler)
                {
                    handler(msgPack.errMsg, msgPack.data);
                }                
            }   
        }
        catch(ex)
        {
            cc.warn("[Network RecvData]", ex);
            cc.log("[Network RecvData] org:", data);
        }        
   },
};

yx.network = new yx.NetWork();

module.exports = yx.network;