

/**
 * !#en CaveManager
 * !#zh 洞府数据类。
 * @class CaveManager
 * @extends
 */

const OneYearSecond = 900; // 一年

const StuffItemIds = {
    [yx.StuffItemType.LINGSHI]:yx.CyType["LINGSHI"],
    [yx.StuffItemType.MUCAI]:yx.CyType["MUCAI"],
    [yx.StuffItemType.SHIWU]:yx.CyType["SHIWU"],
    [yx.StuffItemType.YUNTIE]:yx.CyType["YUNTIE"],
};

yx.CaveManager = function () {
};

yx.CaveManager.prototype = {
    constructor:yx.CaveManager,

    init:function(){
        yx.network.addHandler(yx.proto.CmdId.DONGFU,this.onMessageDongFuInfo.bind(this));
        yx.network.addHandler(yx.proto.CmdId.UPGRADE_DONGFU,this.onMessageUpgrateDongFu.bind(this));
        yx.network.addHandler(yx.proto.CmdId.CHANGE_WORKER,this.onMessageChangeWorker.bind(this));
        yx.network.addHandler(yx.proto.CmdId.ADD_WORKER,this.onMessageAddTotalWorker.bind(this));
        yx.network.addHandler(yx.proto.CmdId.DONGFU_BUILD,this.onMessageDongFuBuild.bind(this));
        yx.network.addHandler(yx.proto.CmdId.XIULIAN_OPT,this.onMessageXiulianOpt.bind(this));
        yx.network.addHandler(yx.proto.CmdId.BUY_WINE,this.onMessageBuyWine.bind(this));
        yx.network.addHandler(yx.proto.CmdId.MAKE_ROOM,this.onMessageMakeRoom.bind(this));
        yx.network.addHandler(yx.proto.CmdId.MAKE_TREASURE,this.onMessageMakeTreasure.bind(this));
        yx.network.addHandler(yx.proto.CmdId.TAKE_TREASURE,this.onMessageTakeTreasure.bind(this));
        yx.network.addHandler(yx.proto.CmdId.DONGFU_SHUGE,this.onMessageDongfuShuge.bind(this));
        yx.network.addHandler(yx.proto.CmdId.STOP_MAKE,this.onMessageStopMake.bind(this));
        yx.network.addHandler(yx.proto.CmdId.READ_BOOK,this.onMessageReadBooK.bind(this));
        yx.network.addHandler(yx.proto.CmdId.READ_BOOK_LEVEL_UP,this.onMessageReadBooKLevelUp.bind(this));
        yx.network.addHandler(yx.proto.CmdId.ALL_BOOK,this.onMessageAllBook.bind(this));
        yx.network.addHandler(yx.proto.CmdId.BOOKING,this.onMessageBooking.bind(this));

        //灵石、食物、木材、陨铁 材料相关属性 :当前储量(从背包取)、当前仙仆、当前级别、当前产量,当前消耗的量(消耗粮食)  是否已建造等
        this._caveData = null;
        //curState 当前状态 1 - 未修炼  2 - 正在修炼    [对应于ShuGePane.SHUGE_STATE]
        //curExp -当前经验 curLevel-当前等级 curTime -当前修炼时间 maxTime-当前修炼总时间  curYear-当前修炼年数
        this._shuGeData = null;

        //当前已学习的配方（丹方、图纸）
        this._formula = {};
        this._formula[yx.FormulaType.DANFANG] = {};
        this._formula[yx.FormulaType.TUZHI] = {};
    },
    getCaveData(){
        if(!this._caveData) {
            cc.warn("CaveMgr _caveData null");
            return ;
        }
        return this._caveData;
    },
    getCaveShuGeData(){
        if(!this._shuGeData) {
            cc.warn("CaveMgr _shuGeData null");
            return ;
        }
        return this._shuGeData;
    },
    getCaveLianZhiData(){
        if(!this._lianZhiData) {
            cc.warn("CaveMgr _lianZhiData null");
            return ;
        }
        return this._lianZhiData;
    },
    //检查是否拥有炉
    checkIsOwnMachine(buildType){
        if(!this._lianZhiData || !this._lianZhiData[buildType]) {
            //cc.warn("CaveMgr checkIsOwnMachine _lianZhiData null");
            return false;
        }

        let machine = this._lianZhiData[buildType]["machine"];
        return machine.length > 0;

    },



    getStuffDataByType(type){
        if(!this._caveData) {
            cc.warn("CaveMgr _caveData null");
            return ;
        }
        if(!this._caveData.stuffData) {
            cc.warn("CaveMgr _caveData stuffData null");
            return ;
        }

        return this._caveData.stuffData[type];
    },

    getAllBook(){
        if(!this._allBook) {
            cc.warn("CaveMgr _allBook null");
            return ;
        }
        return this._allBook;
    },
    getCurReadingBook(){
        let allBook = this.getAllBook();
        if (allBook){
            let curBook = allBook.readingBook;
            if (curBook){
                return curBook;
            }
        }
        return  null;
    },
    //获取预定的书id
    getBookingId(){
        let shuGeData = this.getCaveShuGeData();
        if (shuGeData){
            return shuGeData[yx.ShuGeItemType.WUDAO]["yuDingBookId"];
        }
        return 0;
    },


    /**
     * 是否已经学习 丹方、图纸
     * itemId        itemConfig的ID
     * yx.caveMgr.hasLearnFormula(yx.FormulaType.DANFANG,4101);
     */
    hasLearnFormula(itemId){

        let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig",{ID:itemId});

        if (itemCfg && ["UseArg"] && itemCfg["UseType"]){
            let formulaType = -1;

            //获取使用后的图纸类型
            if (itemCfg["UseType"] == 9){
                formulaType = yx.FormulaType.DANFANG
            }
            else if (itemCfg["UseType"] == 7){
                formulaType = yx.FormulaType.TUZHI
            }

            if (formulaType == -1){return false}

            //查询图纸是否使用过
            for (let k = 0; k < itemCfg["UseArg"].length; k++){
                let formulaId = itemCfg["UseArg"][k];
                let isUsed = !!this._formula[formulaType][formulaId];
                if (isUsed){
                    return true;
                }
            }
        }

        return false;
    },

    //添加已学习的图纸、丹方
    addOneFormula(formulaType,formulaId){
        this._formula[formulaType][formulaId] = formulaId;
    },
    //添加已学习的图纸、丹方
    addMuchFormula(formulaType,formulaIdArr){
        for (let i = 0; i < formulaIdArr.length; i++){
            let formulaId = formulaIdArr[i];
            this._formula[formulaType][formulaId] = formulaId;
        }

    },
    //获取材料数量
    getStuffNumByType(type){
        return yx.playerMgr.getCurrency(StuffItemIds[type]);
        //return yx.bagMgr.getItemNum(StuffItemIds[type]);
    },

    //////////////////////////////////以下是请求//////////////////////////////////
    //请求获取洞府信息
    reqDongfuInfo(){
        yx.network.sendMessage(yx.proto.CmdId.DONGFU, new yx.proto.C2S_Dongfu());
    },
    //请求升级
    reqUpgradeDongfu(type){
        let upgradeDongf= new yx.proto.C2S_UpgradeDongfu();
        upgradeDongf["type"] = type;
        yx.network.sendMessage(yx.proto.CmdId.UPGRADE_DONGFU, upgradeDongf);
    },
    //请求升级
    reqChangeWorker(type,count){
        let changWork = new yx.proto.C2S_ChangeWorker();
        changWork.type  = type;
        changWork.count = count;
        yx.network.sendMessage(yx.proto.CmdId.CHANGE_WORKER, changWork);
    },
    //添加可用仙仆总数
    reqAddTotalWorker(){
        yx.network.sendMessage(yx.proto.CmdId.ADD_WORKER, new yx.proto.C2S_AddWorker());
    },
    //建造
    reqDongFuBuild(type){
        let build = new yx.proto.C2S_DongfuBuild();
        build["type"] = type;
        yx.network.sendMessage(yx.proto.CmdId.DONGFU_BUILD, build);
    },
    //修炼
    reqXiuLian(type,year){
        let xiuLianOpt = new yx.proto.C2S_XiuLianOpt();
        xiuLianOpt["type"] = type;
        xiuLianOpt["year"] = year;
        yx.network.sendMessage(yx.proto.CmdId.XIULIAN_OPT, xiuLianOpt);
    },
    //购买仙酿
    reqBuyWine(id){
        let buyWine = new yx.proto.C2S_BuyWine();
        buyWine["id"] = id;
        yx.network.sendMessage(yx.proto.CmdId.BUY_WINE, buyWine);
    },
    //丹房、器室、仙酿页信息
    reqMakeRoom(buildType){
        let makeRoom = new yx.proto.C2S_MakeRoom();
        makeRoom["type"] = buildType;
        yx.network.sendMessage(yx.proto.CmdId.MAKE_ROOM, makeRoom);
    },
    //丹房、器室、仙酿页 开始炼制
    reqMakeTreasure(buildType,id,machinePinZhi,count){
        let makeTreasure = new yx.proto.C2S_MakeTreasure();
        makeTreasure["type"] = buildType;
        makeTreasure["id"] = id;
        makeTreasure["machinePinZhi"] = machinePinZhi;
        makeTreasure["count"] = count;
        yx.network.sendMessage(yx.proto.CmdId.MAKE_TREASURE, makeTreasure);
    },
    //丹房、器室、仙酿页 取走成品
    reqTakeTreasure(buildType){
        let takeTreasure = new yx.proto.C2S_TakeTreasure();
        takeTreasure["type"] = buildType;
        yx.network.sendMessage(yx.proto.CmdId.TAKE_TREASURE, takeTreasure);
    },
    //丹房、器室、仙酿页 取走成品
    reqDongfuShuge(xiuLianType){
        let dongfuShuge = new yx.proto.C2S_DongfuShuge();
        dongfuShuge["type"] = xiuLianType;
        yx.network.sendMessage(yx.proto.CmdId.DONGFU_SHUGE, dongfuShuge);
    },
    //停止调制/炼制
    reqStopMake(buildType){
        let stopMake = new yx.proto.C2S_StopMake();
        stopMake["type"] = buildType;
        yx.network.sendMessage(yx.proto.CmdId.STOP_MAKE, stopMake);
    },
    //开始读书
    reqReadBook(id){
        let readBook = new yx.proto.C2S_ReadBook();
        readBook["id"] = id;
        yx.network.sendMessage(yx.proto.CmdId.READ_BOOK, readBook);
    },
    //读书升级
    reqReadBookLevelUp(id){
        let readBookLevelUp = new yx.proto.C2S_ReadBookLevelUp();
        readBookLevelUp["id"] = id;
        yx.network.sendMessage(yx.proto.CmdId.READ_BOOK_LEVEL_UP, readBookLevelUp);
    },
    //获取所有书籍
    reqAllBook(){
        yx.network.sendMessage(yx.proto.CmdId.ALL_BOOK, new yx.proto.C2S_AllBook());
    },

    //预订下一本书
    reqBooking(id){
        let req = new yx.proto.C2S_Booking();
        req.id = id;
        yx.network.sendMessage(yx.proto.CmdId.BOOKING, req);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////
    onMessageDongFuInfo(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageDongFuInfo] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_Dongfu.decode(data);

        if (resp){
            this._caveData = {};
            //this._caveData.totalWorker = resp["totalWorker"] ;
            this._caveData.buyTimes = resp["buyTimes"] ;

            this._caveData.isBuild = {};
            this._caveData.isBuild[yx.CaveBuildType.SHUGE] = resp["shuGe"];
            this._caveData.isBuild[yx.CaveBuildType.DANFANG] = resp["danFang"];
            this._caveData.isBuild[yx.CaveBuildType.QISHI] = resp["qiShi"];

            this._caveData.stuffData = {};

            let dongfuRes = resp["dongfuRes"];
            for (let i in dongfuRes){
                let type = dongfuRes[i]["type"];
                this._caveData.stuffData[type] = {};
                this._caveData.stuffData[type]["curXianPu"] = dongfuRes[i]["worker"];//当前仙仆
                this._caveData.stuffData[type]["curLevel"]  = dongfuRes[i]["level"];//当前等级
            }

            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);
        }
    },
    //灵石、食物、木材、陨铁升级
    onMessageUpgrateDongFu(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageUpgrateDongFu] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_UpgradeDongfu.decode(data);
        if (resp){
            //让服务器加一个type
            let stuffData = this.getStuffDataByType(resp["type"]);

            //升级
            stuffData["curLevel"] += 1;

            //由货币刷新来进行刷新
            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);

            yx.eventDispatch.dispatchMsg(yx.EventType.DONGFU_BUILD_LEVELUP,{type:resp["type"],curLevel:stuffData["curLevel"]});
        }
    },

    //洞府灵石、食物、木材、陨铁 仆人加减
    onMessageChangeWorker(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageChangeWorker] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_ChangeWorker.decode(data);
        if (resp){
            //让服务器加一个type,count
            let stuffData = this.getStuffDataByType(resp["type"]);

            //当前仆人修改为当前值
            stuffData["curXianPu"] = resp["count"];

            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);
        }
    },

    //增加总仙仆数
    onMessageAddTotalWorker(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageAddTotalWorker] error:" + errMsg);
            return;
        }
        let caveData = yx.caveMgr.getCaveData();
        if (!caveData){
            return;
        }

        caveData["buyTimes"] ++;
        //由货币刷新来进行刷新
        //yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);
    },
    //建造
    onMessageDongFuBuild(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageDongFuBuild] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_DongfuBuild.decode(data);
        if (resp){
            let caveData = yx.caveMgr.getCaveData();

            if (!caveData){
                return;
            }

            caveData["isBuild"][resp["type"]] = true;

            let buildName = "";
            if (resp["type"] == yx.CaveBuildType.DANFANG){
                buildName = "丹房";
            }else if (resp["type"] == yx.CaveBuildType.QISHI){
                buildName = "器室";
            }else {
                buildName = "书阁";
            }

            yx.eventDispatch.dispatchMsg(yx.EventType.DONGFU_UNLOCK_RES,buildName);


            yx.ToastUtil.showListToast("建造成功");
        }
    },

    //购买仙酿
    onMessageBuyWine(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageBuyWine] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_BuyWine.decode(data);
        if (resp){
            //resp.id = 1;//Store配置表中的主键id
            let xianNiangStoreCfgInfo =  yx.cfgMgr.getRecordByKey("XianNiangStoreConfig", {ID: resp["id"]});
            if (xianNiangStoreCfgInfo){
                yx.ToastUtil.showListToast("获得"+xianNiangStoreCfgInfo["Name1"]);
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG);
            }
        }
    },
    //获取丹房、器室、仙酿信息
    onMessageMakeRoom(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            //yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageMakeRoom] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_MakeRoom.decode(data);

        if (resp){

            let buildType = resp["type"];
            if (!this._lianZhiData) this._lianZhiData = {};

            this._lianZhiData[buildType] = {};

            this._lianZhiData[buildType]["normalLeft"] = resp["normalLeft"] || 0;
            this._lianZhiData[buildType]["bestLeft"] = resp["bestLeft"] || 0;
            if (buildType == yx.CaveBuildType.XIANNIANG){
                //仙酿只有此两值有意义
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG);
                return;
            }

            //这个指的是 LianQiFormulaConfig LianYaoFormulaConfig 两个炼器炼药图纸的ID
            this._lianZhiData[buildType]["instructions"] = resp["instructions"];

            this.addMuchFormula(buildType,resp["instructions"]);

            //对应于 服务器表UseArg 表的Id, 也对应于炼器炉LianQiLuConfig、炼药炉LianYaoLuConfig 的PinZhi
            this._lianZhiData[buildType]["machine"] = resp["machine"];
            this._lianZhiData[buildType]["machine"].sort(function (a,b) {return a < b ? -1:(a == b ? 0:1)});//排序

            //this._lianZhiData[buildType]["autoChoose"] = resp["autoChoose"];
            this._lianZhiData[buildType]["curSelectFormulaId"] = resp["makeId"] || 0;//丹房，图纸类型id,0表示没有正在制作中的
            this._lianZhiData[buildType]["makeCount"] = resp["makeCount"] || 0 ;//一次制作的数量
            this._lianZhiData[buildType]["curState"] = resp["makeId"] == 0 ? yx.LianZhiPanel.LIANZHI_STATE.UN_LIANZHI : yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI;
            this._lianZhiData[buildType]["curTime"] = (resp["endTime"] - yx.timeUtil.getServerTime())/1000;//最终时间，减去当前时间 -> 还需要多少秒
            this._lianZhiData[buildType]["maxTime"] = -1;
            this._lianZhiData[buildType]["curMakeMachinePinZhi"] = resp["make_Machine"];//当前制造炉的品质
            this._lianZhiData[buildType]["succCount"] = resp["succCount"];//成功次数
            this._lianZhiData[buildType]["level"] = resp["level"];//丹道、器道等级

            if (this._lianZhiData[buildType]["curState"] == yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI && resp["makeCount"]){
                //计算maxTime
                let lianLuConfigName = "LianQiLuConfig";
                if (buildType == yx.CaveBuildType.DANFANG) {
                    lianLuConfigName = "LianYaoLuConfig";
                }
                let lianLu = yx.cfgMgr.getRecordByKey(lianLuConfigName,{PinZhi:resp["make_Machine"]});
                if (lianLu){
                    this._lianZhiData[buildType]["maxTime"] = lianLu["MakeTime"] * this._lianZhiData[buildType]["makeCount"];
                }
            }


            //丹房、器室、仙酿
            if (buildType == yx.CaveBuildType.DANFANG){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_DANFANG);
            }
            else if (buildType == yx.CaveBuildType.QISHI){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_QISHI);
            }
        }
    },
    //获取丹房、器室、仙酿 炼制
    onMessageMakeTreasure(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageMakeTreasure] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_MakeTreasure.decode(data);
        if (resp){
            let buildType = resp["type"];
            let caveLianZhiData = this.getCaveLianZhiData();
            if (!caveLianZhiData) return;

            let lianZhiData = caveLianZhiData[buildType];
            if (!lianZhiData) return;

            //仙酿
            if (buildType == yx.CaveBuildType.XIANNIANG){
                if (resp["machinePinZhi"] == 5){
                    lianZhiData["bestLeft"] --;
                }else {
                    lianZhiData["normalLeft"] --;
                }
                lianZhiData["id"] = resp["id"];
                let xianNiangMakeCfg =  yx.cfgMgr.getRecordByKey("XianNiangMakeConfig",{ID:resp["id"]});
                if (xianNiangMakeCfg){
                    yx.ToastUtil.showListToast("获得"+xianNiangMakeCfg["Name1"]+"x1");
                }

                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG);
                return;
            }

            //炼药、炼器

            lianZhiData["makeCount"] = resp["count"];
            lianZhiData["succCount"] = resp["succCount"];//成功次数

            //开始状态
            lianZhiData["curState"] = yx.LianZhiPanel.LIANZHI_STATE.ON_LIANZHI;

            //设置当前进度时间
            let lianLuConfigName = "LianQiLuConfig";
            if (buildType == yx.CaveBuildType.DANFANG) {
                lianLuConfigName = "LianYaoLuConfig";
            }
            let lianLu = yx.cfgMgr.getRecordByKey(lianLuConfigName,{PinZhi:resp["machinePinZhi"]});
            if (lianLu){
                lianZhiData["maxTime"] = lianLu["MakeTime"] * resp["count"];
                lianZhiData["curTime"] = lianZhiData["maxTime"];

                //根据不同buildtype发到不同Panel
                if (buildType == yx.CaveBuildType.DANFANG){
                    yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_DANFANG);
                    yx.eventDispatch.dispatchMsg(yx.EventType.LIANYAO_MAKE);
                }
                else if (buildType == yx.CaveBuildType.QISHI){
                    yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_QISHI);
                    yx.eventDispatch.dispatchMsg(yx.EventType.LIANQI_MAKE);
                }


            }

        }
    },
    //取走丹房、器室、仙酿 炼制 成品
    onMessageTakeTreasure(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageTakeTreasure] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_TakeTreasure.decode(data);
        if (resp){
            let buildType = resp["type"];
            let caveLianZhiData = this.getCaveLianZhiData();
            if (!caveLianZhiData) return;

            let lianZhiData = caveLianZhiData[buildType];
            if (!lianZhiData) return;

            //领取完毕之后，置状态为未开始炼制
            lianZhiData["curState"] = yx.LianZhiPanel.LIANZHI_STATE.UN_LIANZHI;

            //弹出领取奖励
            let formulaConfig = yx.cfgMgr.getRecordByKey(this._getFormulaConfigName(buildType),{ID:lianZhiData["curSelectFormulaId"]});
            let itemName = "";
            if (formulaConfig){
                let itemConfig = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: formulaConfig["ItemID"]});
                if (itemConfig){
                    itemName = itemConfig["Name"];
                    yx.ToastUtil.showListToast("获得"+itemName+"x"+resp["succCount"]);
                }
            }

            //丹房、器室、仙酿
            if (buildType == yx.CaveBuildType.DANFANG){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_DANFANG);

                yx.eventDispatch.dispatchMsg(yx.EventType.LIANYAO_AWARD,{success:resp["succCount"] > 0,name:itemName});
            }
            else if (buildType == yx.CaveBuildType.QISHI){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_QISHI);
                yx.eventDispatch.dispatchMsg(yx.EventType.LIANQI_AWARD,{success:resp["succCount"] > 0,name:itemName});
            }
            else if (buildType == yx.CaveBuildType.XIANNIANG){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG);
            }
        }
    },

    _getFormulaConfigName(type){
        let formulaConfigName = "LianQiFormulaConfig";
        if (type == yx.CaveBuildType.DANFANG) {
            formulaConfigName = "LianYaoFormulaConfig";
        }
        return formulaConfigName;
    },

    //洞府书阁
    onMessageDongfuShuge(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageDongfuShuge] error:" + errMsg);
            return;
        }
        //resp["year"] 注意服务器的这个值 指的是一共修炼几年。他是不变的。
        let resp = yx.proto.S2C_DongfuShuge.decode(data);
        if (resp){
            if (!this._shuGeData) this._shuGeData = {};
            let type = resp["type"];
            this._shuGeData[type] = {};
            this._shuGeData[type]["type"] = resp["type"];
            this._shuGeData[type]["curExp"] = resp["exp"];
            this._shuGeData[type]["curLevel"] = resp["level"];

            this._shuGeData[type]["yuDingBookId"] = resp["bookId"];//test 服务器未添加 后续补全

            //悟道的时间不是按年计算的，是按不同的书，不同的阅读时间 进度
            if (type == yx.ShuGeItemType.WUDAO){
                //注意这里使用的endTime是 allBook里的endTime
                let curBook = yx.caveMgr.getCurReadingBook();
                if (curBook){
                    let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig",{ID:curBook["id"]});
                    if (wuDaoBookCfg){
                        this._shuGeData[type]["maxTime"] = wuDaoBookCfg["CanWuTime"];
                        let curTimestap = yx.timeUtil.getServerTime();
                        let leftSecondTime = (curBook["endTime"] - curTimestap)/1000;//最终时间 减去 当前时间 -> 还需要多少秒
                        if(leftSecondTime < 0){
                            //已经读书完毕
                            this._shuGeData[type]["curTime"] = -1;
                        }else {
                            let leftCountTime = Math.floor(leftSecondTime/wuDaoBookCfg["CanWuTime"]);//剩余总秒数 换成 剩余总次数
                            this._shuGeData[type]["curTime"] = leftSecondTime - wuDaoBookCfg["CanWuTime"] * (leftCountTime);
                        }
                    }
                }
                //有书，说明正在读/或者已经读完
                this._shuGeData[type]["curState"] = curBook ? yx.ShuGeWindow.SHUGE_STATE.HAD_BEGIN:yx.ShuGeWindow.SHUGE_STATE.UN_BEGIN;

            }
            //丹道，器道 按年计算进度
            else{
                let leftSecondTime = (resp["endTime"] - yx.timeUtil.getServerTime())/1000;//最终时间，减去当前时间 -> 还需要多少秒
                let leftYearTime = Math.floor(leftSecondTime/OneYearSecond);//剩余总秒数 换成 剩余总年数
                this._shuGeData[type]["curYear"] = leftYearTime+1;//剩余多少年
                this._shuGeData[type]["maxTime"] = OneYearSecond;//1年 ->15分钟-> 900秒
                this._shuGeData[type]["endTime"] = resp["endTime"];
                if (resp["year"] ){
                    this._shuGeData[type]["curState"] = resp["year"] > 0 ? yx.ShuGeWindow.SHUGE_STATE.HAD_BEGIN : yx.ShuGeWindow.SHUGE_STATE.UN_BEGIN;
                    //当前时间  = 总的还需要修炼的时间 - （剩余年 * 每年的时间）
                    this._shuGeData[type]["curTime"] = leftSecondTime - OneYearSecond * (leftYearTime);
                }else {
                    this._shuGeData[type]["curState"] = yx.ShuGeWindow.SHUGE_STATE.UN_BEGIN;
                    this._shuGeData[type]["curTime"] = OneYearSecond;
                }
            }
            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_SHUGE);
        }
    },

    //修炼
    onMessageXiulianOpt(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[Cave onMessageXiulianOpt] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_XiuLianOpt.decode(data);
        if (resp){
            let shuGeData = yx.caveMgr.getCaveShuGeData();
            let shuGeItemType = resp["type"];
            shuGeData[shuGeItemType]["curState"] = yx.ShuGeWindow.SHUGE_STATE.HAD_BEGIN;
            shuGeData[shuGeItemType]["curYear"] = resp["year"];
            shuGeData[shuGeItemType]["curTime"] = OneYearSecond;
            shuGeData[shuGeItemType]["maxTime"] = OneYearSecond;

            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_SHUGE);

            yx.eventDispatch.dispatchMsg(yx.EventType.XIULIAN,resp);
        }
    },
    //停止调制
    onMessageStopMake(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[CaveMgr onMessageStopMake] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_StopMake.decode(data);
        if (resp){
            let buildType = resp["type"];
            let caveLianZhiData = this.getCaveLianZhiData();
            if (!caveLianZhiData) return;

            let lianZhiData = caveLianZhiData[buildType];
            if (!lianZhiData) return;

            lianZhiData["curState"] =  yx.LianZhiPanel.LIANZHI_STATE.UN_LIANZHI;

            //丹房、器室、仙酿
            if (buildType == yx.CaveBuildType.DANFANG){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_DANFANG);
            }
            else if (buildType == yx.CaveBuildType.QISHI){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_QISHI);
            }
            else if (buildType == yx.CaveBuildType.XIANNIANG){
                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_LIAN_XIANNIANG);
            }
        }

    },
    //开始读书 开始参悟
    onMessageReadBooK(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[CaveMgr onMessageReadBooK] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_ReadBook.decode(data);
        if (resp){

            //id
            let allBook = this.getAllBook();
            if (allBook){
                //代表当前没有在阅读的书
                allBook.readingBook = null;
                allBook.readingBook = allBook.items[resp["id"]];
            }
            //刷新
            this.reqAllBook();

            let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig",{ID:resp["id"]});
            if (wuDaoBookCfg){
                let shuGeData = yx.caveMgr.getCaveShuGeData();
                shuGeData[yx.ShuGeItemType.WUDAO]["curState"] = yx.ShuGeWindow.SHUGE_STATE.HAD_BEGIN;
                //shuGeData[yx.ShuGeItemType.WUDAO]["curYear"] = resp["year"];
                shuGeData[yx.ShuGeItemType.WUDAO]["curTime"] = wuDaoBookCfg["CanWuTime"];
                shuGeData[yx.ShuGeItemType.WUDAO]["maxTime"] = wuDaoBookCfg["CanWuTime"];

                yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_SHUGE);

                yx.eventDispatch.dispatchMsg(yx.EventType.WUDAO_NOTIFY,wuDaoBookCfg["Name"]);
            }
        }
    },
    //书籍升级 领悟
    onMessageReadBooKLevelUp(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[CaveMgr onMessageReadBooKLevelUp] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_ReadBookLevelUp.decode(data);
        if (resp){
            //id
            let bookId = resp["id"];
            let allBook = this.getAllBook();

            let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig", {ID: bookId});
            //参悟收获
            if (wuDaoBookCfg && wuDaoBookCfg["Reward"]) {
                let str = yx.colorUtil.AddColorString("获得：", yx.colorUtil.TextYellowLight);
                let wuDaoNum = wuDaoBookCfg["Reward"][0]["count"];
                let xiuWeiNum = wuDaoBookCfg["Reward"][1]["count"];
                let numStr = yx.colorUtil.AddColorString(xiuWeiNum + "修为，" + wuDaoNum + "悟道经验", yx.colorUtil.TextGreen);
                yx.ToastUtil.showListToast("领悟成功");
                yx.ToastUtil.showListToast(str + numStr);
            }

            if (allBook && allBook.items[bookId]){
                //等级+1
                allBook.items[bookId].level += 1;
                //结束时间去掉，代表当前此书没有在阅读
                allBook.items[bookId].endTime = null;
                //当前已读此书
                allBook.items[bookId].readNum = 0;
                //代表当前没有在阅读的书
                allBook.readingBook = null;
            }
            //刷新
            this.reqAllBook();
            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_SHUGE);
        }
    },
    //获取所有书籍
    onMessageAllBook(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[CaveMgr onMessageAllBook] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_AllBook.decode(data);
        if (resp){
            //book
            this._allBook = {};
            this._allBook.items = {};
            this._allBook.readingBook = null;
            for (let i = 0,len = resp.book.length; i < len; i ++){
                let book = resp.book[i];
                this._allBook.items[book["id"]] = book;

                //可能存在多个endTime的。因为有可能没去领悟，需要去手点。readingBook必须是 当前readNum < CanWuNum
                //可不可领悟，是根据readNum CanWuNum 两值来决定
                if (book.endTime){
                    let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig",{Level:book["level"]});
                    if (wuDaoProficiencyCfg){
                        if (book["readNum"] < wuDaoProficiencyCfg["CanWuNum"]){
                            this._allBook.readingBook = book;
                        }
                    }
                }
            }
        }
    },

    //预订书籍
    onMessageBooking(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.log("[CaveMgr onMessageBooking] error:" + errMsg);
            return;
        }
        let resp = yx.proto.S2C_Booking.decode(data);
        if (resp){
            let shuGeData = this.getCaveShuGeData();
            shuGeData[yx.ShuGeItemType.WUDAO]["yuDingBookId"] = resp["id"];
            yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_CAVE_YUDING_BOOK,resp);
        }
    }

};

yx.caveMgr = new yx.CaveManager();

module.exports = yx.caveMgr;