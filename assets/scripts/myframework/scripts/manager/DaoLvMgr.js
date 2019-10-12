/**
 * !#en DaoLvManager
 * !#zh 道侣数据类。
 * @class DaoLvManager
 * @extends
 */
yx.DaoLvManager = function () {
};

yx.DaoLvManager.prototype = {
    constructor:yx.DaoLvManager,
    init:function(){
        yx.network.addHandler(yx.proto.CmdId.DaoLv,this.onMessageDaoLv.bind(this));
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    reqDaoLv(cmdType,daoLvId){
        //this.testOnMessageGetFengyin();
        //return;

        let daoLv = new yx.proto.C2S_DaoLv;
        daoLv.cmdType = cmdType;// 操作类型
        daoLv.id = daoLvId;
        yx.network.sendMessage(yx.proto.CmdId.DaoLv, daoLv);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageDaoLv(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[DaoLvManager onMessageDaoLv] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_DaoLv.decode(data);
        if (resp){

            if (resp.result && !resp.result.result){ //操作有误
                yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_ERROR_TIP,resp);
                return;
            }

            switch (resp.cmdType) {
                case yx.proto.DaoLvCmdType.GetDaoLv_Cmd:{// 获取道侣信息
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_REFRESH_INFO,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.GifgGiving_Cmd:{//赠礼
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_ZENGLI,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.TakeHome_Cmd:{// 带回洞府
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_DAIHUI,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.YuanJin_Cmd:{// 缘尽
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_YUANJIN,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.TakeRoom_Cmd:{// 带入房间
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_TAKEHOME,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.ShuangXiu_Cmd:{// 双修
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_SHUANGXIU,resp);
                    break;
                }
                case yx.proto.DaoLvCmdType.ShuangXiuLog_Cmd:{// 双修日志
                    yx.eventDispatch.dispatchMsg(yx.EventType.DAOLV_SHUANGXIU_LOG,resp);
                    break;
                }
            }
        }
    },

};

yx.daoLvMgr = new yx.DaoLvManager();

module.exports = yx.daoLvMgr;