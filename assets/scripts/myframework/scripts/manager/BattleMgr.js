
/**
 * !#en BattleManager
 * !#zh 战斗管理类。
 * @class BattleManager
 * @extends 
 */
yx.BattleManager = function () {
    this._lilianMapInfo = {};
    this._lilianMapInfo.curMapId = 1;
    this._lilianMapInfo.topMapId = 1;
};

yx.BattleManager.prototype = {
    constructor: yx.BattleManager,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.LILIAN_MAP, this.onMessageLiLianMap);
        yx.network.addHandler(yx.proto.CmdId.ENTER_MAP, this.onMessageEnterMap);
        yx.network.addHandler(yx.proto.CmdId.STEP_IN_MAP, this.onMessageStepInMap);
        yx.network.addHandler(yx.proto.CmdId.FIGHT_MONSTER, this.onMessageFightMonster);
    },

    setLiLianMap(curMapId, topMapId)
    {
        this._lilianMapInfo.curMapId = curMapId;
        this._lilianMapInfo.topMapId = topMapId;
    },

    getLiLianCurMapId(){
        if (this._lilianMapInfo)
        {
            return this._lilianMapInfo.curMapId;
        }

        return 1;
    },

    getLiLianTopMapId(){
        if (this._lilianMapInfo)
        {
            return this._lilianMapInfo.topMapId;
        }

        return 1;
    },
   
    //////////////////////////////////以下是请求//////////////////////////////////

    //历练地图
    reqLiLianMap(){
        let req = new yx.proto.C2S_LilianMap();    

        yx.network.sendMessage(yx.proto.CmdId.LILIAN_MAP, req);
    },

    //进入地图
    reqEnterMap(mapId){  
        let req = new yx.proto.C2S_EnterMap();
        req.mapId = mapId;

        yx.network.sendMessage(yx.proto.CmdId.ENTER_MAP, req);
    },

    //地图内移动
    reqMove(posX, posY){
        let req = new yx.proto.C2S_StepInMap();
        req.posX = posX;
        req.posY = posY;

        yx.network.sendMessage(yx.proto.CmdId.STEP_IN_MAP, req);
    },

    //攻击怪物
    reqFightMonster(){
        let req = new yx.proto.C2S_FightMonster();     

        yx.network.sendMessage(yx.proto.CmdId.FIGHT_MONSTER, req);
    },


    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageLiLianMap(errMsg, data)
    {
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[battleMgr onMessageEnterMap] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_LilianMap.decode(data);

        yx.battleMgr.setLiLianMap(resp.currentMapId, resp.topMapId);

        yx.eventDispatch.dispatchMsg(yx.EventType.LILIAN_MAP, resp);
    },

    onMessageEnterMap(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[battleMgr onMessageEnterMap] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_EnterMap.decode(data);

        yx.eventDispatch.dispatchMsg(yx.EventType.ENTER_MAP, resp);
    },

    onMessageStepInMap(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[battleMgr onMessageStepInMap] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_StepInMap.decode(data);

        yx.eventDispatch.dispatchMsg(yx.EventType.STEP_IN_MAP, resp);
    },

    onMessageFightMonster(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[battleMgr onMessageFightMonster] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_FightMonster.decode(data);

        yx.eventDispatch.dispatchMsg(yx.EventType.FIGHT_MONSTER, resp.result);
    },
};

/**
 * !#en BattleManager
 * !#zh 战斗管理类。
 * @property battleMgr
 * @type {BattleManager}
 */
yx.battleMgr = new yx.BattleManager();

module.exports = yx.battleMgr;