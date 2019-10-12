/**
 * !#en ShengShouManager
 * !#zh 圣兽数据类。
 * @class ShengShouManager
 * @extends
 */
yx.ShengShouManager = function () {
};

yx.ShengShouManager.prototype = {
    constructor:yx.ShengShouManager,
    init:function(){
        yx.network.addHandler(yx.proto.CmdId.FENG_YIN_BOSS,this.onMessageGetFengyin.bind(this));
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    reqGetFengyin(cmdType){
        //this.testOnMessageGetFengyin();
        //return;

        let fengYinBoss = new yx.proto.C2S_FengYinBoss;
        fengYinBoss.cmdType = cmdType;// 操作类型
        yx.network.sendMessage(yx.proto.CmdId.FENG_YIN_BOSS, fengYinBoss);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageGetFengyin(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ShengShouManager onMessageGetFengyin] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_FengYinBoss.decode(data);
        if (resp){

            if (!this._fengYinData) this._fengYinData = {};

            if (resp.hasOwnProperty("cmdType")) this._fengYinData.cmdType = resp["cmdType"];
            if (resp.hasOwnProperty("bossID")) this._fengYinData.bossID  = resp["bossID"];
            if (resp.hasOwnProperty("isOrder")) this._fengYinData.isOrder  = resp["isOrder"];
            if (resp.hasOwnProperty("fengYinState")) this._fengYinData.fengYinState  = resp["fengYinState"];
            if (resp.hasOwnProperty("fightingBossInfo")) this._fengYinData.fightingBossInfo   = resp["fightingBossInfo"];

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGSHOU_REFRESH_INFO,this._fengYinData);

            /*//获取界面
            if (resp["cmdType"] == yx.proto.FengYinCmdType.GetFengYinBoss_Cmd) {

                yx.eventDispatch.dispatchMsg(yx.EventType.SHENGSHOU_REFRESH_INFO,this._fengYinData);
            }
            //预定圣兽
            else if (resp["cmdType"] == yx.proto.FengYinCmdType.OrderFengYinBoss_Cmd){

            }*/

        }
    },
    testOnMessageGetFengyin(){
        let resp = {};
        resp.cmdType = yx.proto.FengYinCmdType.GetFengYinBoss_Cmd;
        resp.bossID = 1;
        resp.isOrder = true;
        resp.fengYinState = yx.proto.FengYinStateType.Fighting;
        resp.fightingBossInfo = {};
        resp.fightingBossInfo.curBloodVolume = 120000;
        resp.fightingBossInfo.averagePlayerLevel = 35;
        resp.fightingBossInfo.totalOrder = 1000;
        resp.fightingBossInfo.orderInfos = [];
        for (let i = 0; i <= 50; i ++){
            let info = {};
            info.playerID = yx.playerMgr.getPid()+i;
            info.nickName = "xiao"+i;
            info.registerTime = 1568908800000;
            info.level = 31+i*2;
            info.output = 1000;
            resp.fightingBossInfo.orderInfos.push(info);
        }


        if (!this._fengYinData) this._fengYinData = {};

        if (resp.hasOwnProperty("cmdType")) this._fengYinData.cmdType = resp["cmdType"];
        if (resp.hasOwnProperty("bossID")) this._fengYinData.bossID  = resp["bossID"];
        if (resp.hasOwnProperty("isOrder")) this._fengYinData.isOrder  = resp["isOrder"];
        if (resp.hasOwnProperty("fengYinState")) this._fengYinData.fengYinState  = resp["fengYinState"];
        if (resp.hasOwnProperty("fightingBossInfo")) this._fengYinData.fightingBossInfo   = resp["fightingBossInfo"];

        //获取界面
        if (resp["cmdType"] == yx.proto.FengYinCmdType.GetFengYinBoss_Cmd) {

            yx.eventDispatch.dispatchMsg(yx.EventType.SHENGSHOU_REFRESH_INFO,this._fengYinData);
        }
        //预定圣兽
        else if (resp["cmdType"] == yx.proto.FengYinCmdType.OrderFengYinBoss_Cmd){

        }
    }

};

yx.shengShouMgr = new yx.ShengShouManager();

module.exports = yx.shengShouMgr;