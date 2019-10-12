/**
 * !#en ChuiDiaoManager
 * !#zh 垂钓数据类。
 * @class ChuiDiaoManager
 * @extends
 */
yx.ChuiDiaoManager = function () {
};

yx.ChuiDiaoManager.prototype = {
    constructor:yx.ChuiDiaoManager,
    init:function(){
        yx.network.addHandler(yx.proto.CmdId.GO_FISHING,this.onMessageGoFishing.bind(this));


    },

    //////////////////////////////////以下是请求//////////////////////////////////

    reqGoFishing(cmdType,fieldType,piaoType,testState){

        let goFinshing = new yx.proto.C2S_GoFishing;
        goFinshing.cmdType = cmdType;// 操作类型
        goFinshing.fieldType = fieldType;// 进入场地类型
        goFinshing.piaoType = piaoType;// 拉杆方式
        yx.network.sendMessage(yx.proto.CmdId.GO_FISHING, goFinshing);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageGoFishing(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[ChuiDiaoManager onMessageGoFishing] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_GoFishing.decode(data);
        if (resp){

            if (!this._diaoYuData) this._diaoYuData = {};
            if (resp["cmdType"] == yx.proto.GoFishingCmdType.GetConsume_Cmd) {
                if (resp["fieldType"] == yx.proto.GoFishingFieldType["AboveGround"]){
                    this._diaoYuData.chuiXingConsumeData = resp["consume"];
                }else {
                    this._diaoYuData.huanHaiConsumeData = resp["consume"];
                }
                yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_COUNT_INFO,this._diaoYuData);

                return;
            }else if (resp["cmdType"] == yx.proto.GoFishingCmdType.GetFishingRod_Cmd){
                yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_YUGAN_INFO,resp.fishingRodInfo);
                return;
            }


            //服务器会传null值，所以全部判断一遍

            if (resp.hasOwnProperty("cmdType")) this._diaoYuData.cmdType = resp["cmdType"];
            if (resp.hasOwnProperty("piaoType")) this._diaoYuData.piaoType = resp["piaoType"];
            if (resp.hasOwnProperty("reward")) this._diaoYuData.reward = resp["reward"];
            //if (resp["countDown"]) this._diaoYuData = resp["countDown"];
            if (resp.hasOwnProperty("gameState")) this._diaoYuData.gameState = resp["gameState"];
            if (resp.hasOwnProperty("fieldType")) this._diaoYuData.fieldType = resp["fieldType"];
            //if (resp["gameRemainTime"]) this._diaoYuData = resp["gameRemainTime"];


            this._diaoYuData.maxTime = 10;
            if (resp.hasOwnProperty("gameRemainTime")) this._diaoYuData.leftTime = resp["gameRemainTime"];
            if (resp.hasOwnProperty("countDown")) this._diaoYuData.curTime = resp["countDown"]

            switch (this._diaoYuData.cmdType) {
                case yx.proto.GoFishingCmdType.EnterField_Cmd:
                {
                    yx.windowMgr.showWindow("chuiDiaoWindow",this._diaoYuData);
                    break;
                }
                //case yx.proto.GoFishingCmdType.PaoGan_Cmd://
                case yx.proto.GoFishingCmdType.System_Calc_LaGan://系统的拉杆推荐选择
                {
                    yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_LAGAN_RECOMMEND,this._diaoYuData);
                    break;
                }
                case yx.proto.GoFishingCmdType.LaGan_Cmd://拉杆结果
                {
                    yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_LAGAN_RESULT,this._diaoYuData);
                    break;
                }
                case yx.proto.GoFishingCmdType.ChangeState_Cmd://改变游戏状态 -> PaoGan = 2;// 抛竿 LaGan = 3;// 拉杆Stop = 4;// 停止
                {
                    //resp.curTime = resp["countDown"] || 0;
                    if (this._diaoYuData.gameState == yx.proto.GameState.Inited){
                        yx.windowMgr.showWindow("chuiDiaoWindow",this._diaoYuData);
                    }else {
                        yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_CHANG_GAMESTATE,this._diaoYuData);
                    }

                    break;
                }
                case yx.proto.GoFishingCmdType.Reconnect_Cmd:
                {
                    //只在重连的时候输入时间
                    yx.eventDispatch.dispatchMsg(yx.EventType.CHUIDIAO_RECONNECT_INFO,this._diaoYuData);
                    break;
                }

            }
        }

    },

};

yx.chuiDiaoMgr = new yx.ChuiDiaoManager();

module.exports = yx.chuiDiaoMgr;