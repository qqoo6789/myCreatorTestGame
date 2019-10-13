let engine = require('MatchvsEngine');
let response = require("MatchvsResponse");
let msg = require("MatvhsvsMessage");
let GameData = require('ExamplesData');
let mvs = require("Matchvs");

const RoomItem = require("RoomItem");
const PlayerItem = require("PlayerItem");
cc.Class({
    extends: cc.Component,

    properties: {
        createRoomBtn:cc.Button,
        loginBtn:cc.Button,
        refreshRoomBtn:cc.Button,
        roomItemLayout:cc.Layout,
        roomItemScrView:cc.ScrollView,
        roomItemPrefab:cc.Prefab,
        playerItemPrefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        RoomItem.prefab = this.roomItemPrefab;
        PlayerItem.prefab = this.playerItemPrefab;

        this.createRoomBtn.node.on('click',this.createRoomBtnClick,this);
        this.loginBtn.node.on('click',this.loginBtnClick,this);
        this.refreshRoomBtn.node.on('click',this.refreshRoomBtnClick,this);

        //在应用开始时手动绑定一下所有的回调事件
        response.prototype.bind();
        response.prototype.init(this);
        this.node.on(msg.MATCHVS_INIT, this.initResponse, this);
        this.node.on(msg.MATCHVS_REGISTER_USER, this.registerUserResponse, this);
        this.node.on(msg.MATCHVS_LOGIN, this.loginResponse, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_RSP, this.joinRoomResponse, this);
        this.node.on(msg.MATCHVS_JOIN_ROOM_NOTIFY, this.joinRoomNotify, this);
        this.node.on(msg.MATCHVS_JOIN_OVER_RSP, this.joinOverResponse, this);
        this.node.on(msg.MATCHVS_JOIN_OVER_NOTIFY, this.joinOverNotify, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_RSP, this.sendEventResponse, this);
        this.node.on(msg.MATCHVS_SEND_EVENT_NOTIFY, this.sendEventNotify, this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM, this.leaveRoomResponse, this);
        this.node.on(msg.MATCHVS_LEAVE_ROOM_NOTIFY, this.leaveRoomNotify, this);
        this.node.on(msg.MATCHVS_LOGOUT, this.logoutResponse, this);
        this.node.on(msg.MATCHVS_ERROE_MSG, this.errorResponse, this);
        this.node.on(msg.MATCHVS_ROOM_LIST_EX, this.getRoomListResponse, this);
        this.node.on(msg.MATCHVS_CREATE_ROOM, this.createRoomResponse, this);
        this.node.on(msg.MATCHVS_ROOM_DETAIL, this.getRoomDetailResponse, this);

    },
    createRoomBtnClick(){
        let userProfile = "好好玩的来呀简介";
        let watchSet = null;
        let createRoomInfo = new mvs.MsCreateRoomInfo(
            "roomName111",//roomName
            3,//maxPlayer
            1,//mode
            0,//canWatch
            1,//visibility
            "roompropty111"
        );
        //engine.prototype.joinRandomRoom(GameData.mxaNumer);//进入房间
        engine.prototype.createRoom(createRoomInfo,userProfile,watchSet);//房间
    },
    loginBtnClick(){
        engine.prototype.login(GameData.userID, GameData.token);
    },
    start () {

        engine.prototype.init(GameData.channel, GameData.platform, GameData.gameID, GameData.appKey);

        //this.schedule(this.scheduleCb.bind(this),5,100,0);
    },


    /**
     {"joinType":3,"userID":7631155,"roomID":0,"gameID":217350,"maxPlayer":3,"mode":0,"canWatch":0,"tags":[{"name":"matchvs"}],"userProfile":"玩家Bjax4dHR进入了房间"}     */
    refreshRoomBtnClick(){
        let filter = new mvs.MsRoomFilterEx(
            3,         //maxPlayer
            1,            //mode
            0,        //canWatch
            "roompropty111",    //roomProperty
            0,     //full 0-未满
            1,  //state 0-全部，1-开放 2-关闭
            0,  //sort 0-不排序 1-创建时间排序 2-玩家数量排序 3-状态排序 都可以
            0,  //order 0-ASC  1-DESC 都可以
            0,  //pageNo 从0开始 0为第一页
            3,  //pageSize 每页数量 大于0
        );
        engine.prototype.getRoomListEx(filter);
    },
    getRoomDetailResponse(msGetRoomDetailRsp){
        cc.log("getRoomDetailResponse:");
        cc.log(msGetRoomDetailRsp);
        for (let j in this.roomItenSrcArr){
            this.roomItenSrcArr[j].updatePlayer(msGetRoomDetailRsp.userInfos);
        }
    },
    getRoomListResponse(msGetRoomListExRsp){
        cc.log("getRoomListResponse:");
        cc.log(msGetRoomListExRsp);
        this.roomItemLayout.node.removeAllChildren(true);
        this.roomItenSrcArr = {};
        for (let i in msGetRoomListExRsp.roomAttrs){
            this.roomItenSrcArr[i] = RoomItem.createItemSync(RoomItem.prefab,this.roomItemLayout.node,msGetRoomListExRsp.roomAttrs[i]);
        }

        for (let j in this.roomItenSrcArr){
            engine.prototype.getRoomDetail(this.roomItenSrcArr[j].getRoomId());
        }


    },
    createRoomResponse(msCreateRoomRsp){
        cc.log("createRoomResponse:");
        cc.log(msCreateRoomRsp);
    },
    /**
     * 初始化回调
     * @param info
     */
    initResponse(status) {
        if (status == 200) {
            cc.log('initResponse：初始化成功，status：' + status);
            engine.prototype.registerUser();
        } else {
            cc.log('initResponse：初始化失败，status：' + status)
        }
    },

    /**
     * 错误信息回调
     * @param errorCode
     * @param errorMsg
     */
    errorResponse(errorCode, errorMsg) {
        cc.log('errorMsg:' + errorMsg + 'errorCode:' + errorCode);
    },
    /**
     * 注册回调
     * @param userInfo
     */
    registerUserResponse(userInfo) {
        if (userInfo.status == 0) {
            cc.log('registerUserResponse：注册用户成功,id = ' + userInfo.id + 'token = ' + userInfo.token + 'name:' + userInfo.name +
                'avatar:' + userInfo.avatar);
            GameData.userID = userInfo.id;
            GameData.token = userInfo.token;
            GameData.userName = userInfo.name;
        } else {
            cc.log('registerUserResponse: 注册用户失败');
        }
    },

    /**
     * 登陆回调
     * @param MsLoginRsp
     */
    loginResponse(MsLoginRsp) {
        if (MsLoginRsp.status == 200) {
            cc.log('loginResponse: 登录成功');
        } else if (MsLoginRsp.status == 402) {
            cc.log('loginResponse: 应用校验失败，确认是否在未上线时用了release环境，并检查gameID、appkey 和 secret');
        } else if (MsLoginRsp.status == 403) {
            cc.log('loginResponse：检测到该账号已在其他设备登录');
        } else if (MsLoginRsp.status == 404) {
            cc.log('loginResponse：无效用户 ');
        } else if (MsLoginRsp.status == 500) {
            cc.log('loginResponse：服务器内部错误');
        }
    },

    /**
     * 进入房间回调
     * @param status
     * @param userInfoList
     * @param roomInfo
     */
    joinRoomResponse(status, userInfoList, roomInfo) {
        if (status == 200) {
            cc.log('joinRoomResponse: 进入房间成功：房间ID为：' + roomInfo.roomID + '房主ID：' + roomInfo.ownerId + '房间属性为：' + roomInfo.roomProperty);
            for (var i = 0; i < userInfoList.length; i++) {
                cc.log('joinRoomResponse：房间的玩家ID是' + userInfoList[i].userID);
            }
            if (userInfoList.length == 0) {
                cc.log('joinRoomResponse：房间暂时无其他玩家');
            }
        } else {
            cc.log('joinRoomResponse：进入房间失败');
        }
    },

    /**
     * 其他玩家加入房间通知
     * @param roomUserInfo
     */
    joinRoomNotify(roomUserInfo) {
        cc.log('joinRoomNotify：加入房间的玩家ID是' + roomUserInfo.userID);
    },

    /**
     * 关闭房间成功
     * @param joinOverRsp
     */
    joinOverResponse(joinOverRsp) {
        if (joinOverRsp.status == 200) {
            cc.log('joinOverResponse: 关闭房间成功');
        } else if (joinOverRsp.status == 400) {
            cc.log('joinOverResponse: 客户端参数错误 ');
        } else if (joinOverRsp.status == 403) {
            cc.log('joinOverResponse: 该用户不在房间 ');
        } else if (joinOverRsp.status == 404) {
            cc.log('joinOverResponse: 用户或房间不存在');
        } else if (joinOverRsp.status == 500) {
            cc.log('joinOverResponse: 服务器内部错误');
        }
    },

    /**
     * 关闭房间通知
     * @param notifyInfo
     */
    joinOverNotify(notifyInfo) {
        cc.log('joinOverNotify：用户' + notifyInfo.srcUserID + '关闭了房间，房间ID为：' + notifyInfo.roomID);
    },

    /**
     * 发送消息回调
     * @param sendEventRsp
     */
    sendEventResponse(sendEventRsp) {
        if (sendEventRsp.status == 200) {
            cc.log('sendEventResponse：发送消息成功');
        } else {
            cc.log('sendEventResponse：发送消息失败');
        }
    },

    /**
     * 接收到其他用户消息通知
     * @param eventInfo
     */
    sendEventNotify(eventInfo) {
        cc.log('sendEventNotify：用户' + eventInfo.srcUserID + '对你使出了一招' + eventInfo.cpProto);
    },

    /**
     * 离开房间回调
     * @param leaveRoomRsp
     */
    leaveRoomResponse(leaveRoomRsp) {
        if (leaveRoomRsp.status == 200) {
            cc.log('leaveRoomResponse：离开房间成功，房间ID是' + leaveRoomRsp.roomID);
        } else if (leaveRoomRsp.status == 400) {
            cc.log('leaveRoomResponse：客户端参数错误,请检查参数');
        } else if (leaveRoomRsp.status == 404) {
            cc.log('leaveRoomResponse：房间不存在')
        } else if (leaveRoomRsp.status == 500) {
            cc.log('leaveRoomResponse：服务器错误');
        }
    },

    /**
     * 其他离开房间通知
     * @param leaveRoomInfo
     */
    leaveRoomNotify(leaveRoomInfo) {
        cc.log('leaveRoomNotify：' + leaveRoomInfo.userID + '离开房间，房间ID是' + leaveRoomInfo.roomID);
    },

    /**
     * 注销回调
     * @param status
     */
    logoutResponse(status) {
        if (status == 200) {
            cc.log('logoutResponse：注销成功');
        } else if (status == 500) {
            cc.log('logoutResponse：注销失败，服务器错误');
        }

    },
});
