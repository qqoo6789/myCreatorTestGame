
const Attr2SecAttrRatio = {
    [1]: 15,//体魄 * 15
    [2]: 5,//真气 * 5
    [3]: 5,//根骨 * 5
    [4]: 3,//身法 * 3
    [5]: 3,//灵力 * 3
    [6]: 0.5,//悟性 / 2 向下取整
    [7]: 0.5,//机缘 / 2 向下取整
};

/**
 * !#en PlayerManager
 * !#zh 玩家数据类。
 * @class PlayerManager
 * @extends 
 */
yx.PlayerManager = function () {  
    //初始化虚拟货币
    this._currency = {};

    for (let i in yx.CyType)
    {
        let index = yx.CyType[i];
        if (index.constructor == Number)
        {
            this._currency[index] = 0;
        }        
    }

    //初始化属性
    this._property = {};

    for (let i in yx.proto.PropertyType)
    {
        let index = yx.proto.PropertyType[i];
        if (index.constructor == Number)
        {
            this._property[index] = 0;
        }        
    }

    //离线收益数据
    this._lixian = null;

    //丹药使用数据
    this._danyao = null;

    //手动修炼时间
    this._xiulianManualEndTime = 0;

    //先写死种族
    this._zhongzu = 1;
};

yx.PlayerManager.prototype = {
    constructor: yx.PlayerManager,
    /**
     * 初始化函数
     * 预先加载完所有表格数据，并按key做好索引
     */
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.LOGIN, this.onMessageLogin);
        yx.network.addHandler(yx.proto.CmdId.REGISTER, this.onMessageCreateRole);
        yx.network.addHandler(yx.proto.CmdId.GET_PLAYER_INFO, this.onMessageGetRoleInfo);               
        yx.network.addHandler(yx.proto.CmdId.CURRENCY_CHANGE, this.onMessageCurrencyChg);     
        yx.network.addHandler(yx.proto.CmdId.LEVEL_UP, this.onMessageLevelUp);     
        yx.network.addHandler(yx.proto.CmdId.XIU_LIAN, this.onMessageXiuLian);     
        
        yx.network.addHandler(yx.proto.CmdId.ALL_PROPERTY, this.onMessagePropertyChg);   
        yx.network.addHandler(yx.proto.CmdId.ITEM_USE_INFO, this.onMessageItemUseInfo.bind(this));
        yx.network.addHandler(yx.proto.CmdId.ITEM_EXCHANGE_INFO, this.onMessageItemExchangeInfo.bind(this));
    },

    /**
     * 获取玩家指定类型的货币数量
     * @param {yx.CyType} cyType 货币类型
     */
    getCurrency(cyType){
        return this._currency[cyType] || 0;
    },

    initCurrency(currencyList)
    {
        for (let i = 0; i < currencyList.length; i++)
        {
            let currency = currencyList[i];        
      
            this.setCurrency(currency.itemId, currency.amount);            
        }
    },

    setCurrency(cyType, value)
    {
        if (this._currency[cyType] != undefined)
        {
            this._currency[cyType] = value;
        }        
    },

    getProperty(proType)
    {
        return this._property[proType] || 0;
    },

    setProperty(proType, value){
        if (this._property[proType] != undefined)
        {
            this._property[proType] = value;
        }    
    },

    getSecAttr(proType)
    {       
        return this.attr2secAttr(proType, this.getProperty(proType));    
    },

    setPlayerMsg(playerMsg)
    {
    /**
     * Properties of a PlayerMsg.
     * @exports IPlayerMsg
     * @interface IPlayerMsg
     * @property {number|Long|null} [pid] PlayerMsg pid
     * @property {string|null} [name] PlayerMsg name
     * @property {number|null} [icon] PlayerMsg icon
     * @property {string|null} [channel] PlayerMsg channel
     * @property {number|null} [level1] PlayerMsg level1
     * @property {number|null} [level2] PlayerMsg level2
     * @property {number|null} [exp] PlayerMsg exp
     * @property {number|Long|null} [registerTime] PlayerMsg registerTime
     */

        this._pid = playerMsg.pid;
        this._name = playerMsg.name;
        this.icon = playerMsg.icon;
        this.channel = playerMsg.channel;

        yx.bagMgr.setPkgArgs(playerMsg.pkgNum, playerMsg.pkgLevel, playerMsg.pkgUse);

        this.setDuJieLevel(playerMsg.level1);
        this.setCuiTiLevel(playerMsg.level2);

        yx.timeUtil.setCreateTime(playerMsg.registerTime);

        if (CC_DEBUG)
        {
            document.title = "pid:" + this.getPid() + " 区:" + yx.serverMgr.getCurServerInfo().name;
        }
    },

    setDuJieLevel(level){
        this._level1 = level;

        this.dujieInfo = yx.cfgMgr.getRecordByKey("DuJieConfig", {Level:this.getDuJieLevel()});        
    },

    setCuiTiLevel(level){
        this._level2 = level;

        this.cuitiInfo = yx.cfgMgr.getRecordByKey("CuiTiConfig", {Level:this.getCuiTiLevel()});
    },

    setDanYao(danyaoList)
    {
        // message DanYaoInfoPB
        // {
        //     required int32 itemId = 1;			// 道具id
        //     optional int32 useCount = 2;		// 使用数量
        //     optional int32 maxCount = 3;		// 可使用最大数量
        // }
        this._danyao = new Map();

        danyaoList.forEach(elem => {
            this._danyao.set(elem.itemId, elem);
        });
    },

    /**
     * 获取指定丹药、仙酿、渡劫丹的使用次数
     * @param {Number} itemId 丹药的itemId
     */
    getDanYaoUseCount(itemId)
    {
        if (this._danyao && this._danyao.has(itemId))
        {
            return this._danyao.get(itemId).useCount;
        }

        return 0;
    },
    /**
     * 获取丹药是否已经吃满
     */
    checkDanYaoIsEatFull(itemId){
        if (this._danyao && this._danyao.has(itemId))
        {
            return this._danyao.get(itemId).useCount >= this._danyao.get(itemId).maxCount;
        }
        return false;
    },

    /**
     * 设置道具使用信息
     * @param itemUseMsgList
     */
    setItemUseInfo(itemUseMsgList)
    {
        //message ItemUseMsg {
        // 	optional int32 id = 1;//id
        // 	optional int32 amount = 2;//已使用数量
        // }
        if (!this._itemUseInfos){
            this._itemUseInfos = new Map();
        }

        itemUseMsgList.forEach(elem => {
            this._itemUseInfos.set(elem.id, elem);
        });
    },

    /**
     * 获取指定道具的使用次数
     * @param {Number} itemId 道具的itemId
     */
    getItemUseCount(itemId)
    {
        if (this._itemUseInfos && this._itemUseInfos.has(itemId))
        {
            return this._itemUseInfos.get(itemId).amount;
        }
        return 0;
    },
    /**
     * 设置道具兑换信息
     * @param itemExchangeInfo
     */
    setItemExchangeInfo(itemExchangeInfo)
    {
        //message ExchangeMsg {
        // 	optional int32 id = 1;//兑换id
        // 	optional int32 amount = 2;//已兑换数量
        // }
        if (!this._itemExchangeInfos){
            this._itemExchangeInfos = new Map();
        }

        itemExchangeInfo.forEach(elem => {
            this._itemExchangeInfos.set(elem.id, elem);
        });
    },

    /**
     * 获取指定兑换道具的已兑换次数
     * @param {Number} id 兑换表的id
     */
    getItemExchangeCount(id)
    {
        if (this._itemExchangeInfos && this._itemExchangeInfos.has(id))
        {
            return this._itemExchangeInfos.get(id).amount;
        }
        return 0;
    },
    /**
     * 获取指定丹药、仙酿、渡劫丹的最大使用次数
     * @param {Number} itemId 丹药的itemId
     */
    getDanYaoMaxCount(itemId)
    {
        if (this._danyao && this._danyao.has(itemId))
        {
            return this._danyao.get(itemId).maxCount;
        }

        return 0;
    },

    getPid(){
        return this._pid;
    },

    getName(){
        return this._name;
    },

    getZhongZu(){
        return this._zhongzu;
    },

    getDuJieLevel(){
        return this._level1;
    },

    getCuiTiLevel(){
        return this._level2;
    },

    getExp(){
        return this.getCurrency(yx.CyType.XIUWEI);
    },

    changeCurrency(currency){
        //货币类型的道具
        // message CurrencyItem {
        // 	optional int32 itemId = 1;
        // 	optional int32 count = 2;
        // }

        let diff = {};

        currency.forEach(cyItem => {
            if (yx.playerMgr.getCurrency(cyItem.itemId) != cyItem.amount)
            {
                diff[cyItem.itemId] = cyItem.amount - yx.playerMgr.getCurrency(cyItem.itemId);

                cc.log("[PlayerMgr changeCurrency] id:" + cyItem.itemId 
                + " from:" + yx.playerMgr.getCurrency(cyItem.itemId) + " to:" + cyItem.amount);

                yx.playerMgr.setCurrency(cyItem.itemId, cyItem.amount);
            }
        });
    
        //要把差值算出来通知UI界面
        yx.eventDispatch.dispatchMsg(yx.EventType.CURRENCY_CHANGE, diff);
    },

    testCurrencyAdd(){
        let diff = new yx.proto.S2C_CurrencyChange();
        diff.item = new Array();

        diff.item.push({itemId: yx.CyType.LINGSHI, count: 100});
        diff.item.push({itemId: yx.CyType.LINGQI, count: 500});
        diff.item.push({itemId: yx.CyType.WEIWANG, count: 999});

        this.onMessageCurrencyChg(null, diff.constructor.encode(diff).finish());
    },

    //一级属性转成二级属性
    attr2secAttr(type, value){
        if (Attr2SecAttrRatio[type] != undefined)
        {
            return Math.floor(value * Attr2SecAttrRatio[type]);
        }
        else
        {
            cc.warn("[PlayerMgr attr2secAttr] type error:" + type);
            return value;
        }
    },

    setLiXian(itemList)
    {
        if (!itemList)
        {
            return;
        }

        let lixian = {};

        itemList.forEach(cyItem => {           
                lixian[cyItem.itemId] = cyItem.amount;           
        });

        this._lixian = lixian;
    },

    getLiXian()
    {
        return this._lixian;
    },

    //显示了离线面板后把数据清掉，下次刷新页面就不会重复显示
    clearLiXian(){
        this._lixian = null;
    },

    setXiuLianEndTime(endTime)
    {
        this._xiulianManualEndTime = endTime;
    },

    //剩余修炼时长 单位秒
    getXiuLianElapse()
    {
        
        let elapse = (this._xiulianManualEndTime - yx.timeUtil.getServerTime()) / 1000;

        if (elapse < 0)
        {
            elapse = 0;
        }

        return elapse;
    },


    //////////////////////////////////以下是请求//////////////////////////////////

    reqPlayerMsg(){
        let getRoleInfoReq = new yx.proto.C2S_GetPlayer();

        yx.network.sendMessage(yx.proto.CmdId.GET_PLAYER_INFO, getRoleInfoReq);
    },

    reqRegister(){
        let registerReq = new yx.proto.C2S_Register();

        yx.network.sendMessage(yx.proto.CmdId.REGISTER, registerReq);
    },

    reqPlayerProperty(){
        let req = new yx.proto.C2S_PlayerProperty();

        yx.network.sendMessage(yx.proto.CmdId.ALL_PROPERTY, req);
    },

    reqDuJieLevelUp(){        
        yx.playerMgr.reqPlayerLevelUp(yx.proto.LevelUpType.DU_JIE);
    },

    reqCuiTiLevelUp(){
        yx.playerMgr.reqPlayerLevelUp(yx.proto.LevelUpType.CUI_TI);
    },

    reqPlayerLevelUp(type){
        let req = new yx.proto.C2S_LevelUp();

        req.type = type;

        yx.network.sendMessage(yx.proto.CmdId.LEVEL_UP, req);
    },

    reqPlayerXiuLian(){
        let req = new yx.proto.C2S_XiuLian();

        yx.network.sendMessage(yx.proto.CmdId.XIU_LIAN, req);
    },

    //玩家道具使用数据
    reqItemUseInfo(){
        let req = new yx.proto.C2S_ItemUseInfo();
        yx.network.sendMessage(yx.proto.CmdId.ITEM_USE_INFO, req);
    },

    //玩家道具兑换数据
    reqItemExchangeInfo(){
        let req = new yx.proto.C2S_ItemExchangeInfo();
        yx.network.sendMessage(yx.proto.CmdId.ITEM_EXCHANGE_INFO, req);
    },

    //////////////////////////////////以上是请求//////////////////////////////////

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageLogin(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[PlayMgr onMessageLogin] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let retObj = yx.proto.S2C_Login.decode(data);
        
        //需要创建角色
        if (retObj.register == true)
        {
            yx.windowMgr.showWindow("createRole");
        }
        else//已有角色
        {
            yx.playerMgr.reqPlayerMsg();
        }        
    },

    onMessageCreateRole(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[PlayMgr onMessageCreateRole] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let retObj = yx.proto.S2C_Register.decode(data);

        if (retObj.result == true)
        {
            yx.playerMgr.reqPlayerMsg();
        }
        else
        {
            //TODO:创建失败
            yx.ToastUtil.showListToast("创建失败");
        }
    },

    onMessageGetRoleInfo(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[PlayMgr onMessageGetRoleInfo] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let retObj = yx.proto.S2C_GetPlayer.decode(data);

        if (retObj == null || retObj.player == null)
        {
            cc.error("[PlayerMgr onMessageGetRoleInfo error]");
            return;
        }

        if (retObj.serverTime)
        {
            yx.timeUtil.setServerTime(retObj.serverTime);
        }
        yx.playerMgr.setPlayerMsg(retObj.player);

        yx.playerMgr.setLiXian(retObj.item);

        yx.playerMgr.setDanYao(retObj.danYao);
        yx.bagMgr.setExchangeData(retObj.exchange);
        yx.playerMgr.reqItemUseInfo();
        yx.playerMgr.reqItemExchangeInfo();

        yx.eventDispatch.dispatchMsg(yx.EventType.GET_PLAYER_INFO);

        //获取完玩家数据后可以再获取几个关键数据
        yx.bagMgr.reqAllItem();
        yx.playerMgr.reqPlayerProperty();
        yx.wudaoMgr.reqWuDaoInfo();
        yx.gongfaMgr.reqGongFaInfo();
        //有了玩家数据后可以初始化一些东西
        yx.DiarysUtil.init();

        // 活动进度
        yx.ActivityMgr.TaskInfo();
        
    },

    
    //货币变化，主要是显示用
    onMessageCurrencyChg(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[PlayerMgr onMessageCurrencyChg] error:" + errMsg);
            return;
        }

        let retObj = yx.proto.S2C_CurrencyChange.decode(data);

        if (retObj){
            yx.eventDispatch.dispatchMsg(yx.EventType.CURRENCY_CHANGE_SHOW, retObj);
        }

    },

    //等级变化
    onMessageLevelUp(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[PlayerMgr onMessageLevelUp] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_LevelUp.decode(data);

        if (resp.type == yx.proto.LevelUpType.DU_JIE)
        {
            //如果等级没变化就表示失败了
            resp.succ = resp.level == yx.playerMgr.getDuJieLevel() + 1;        
            yx.playerMgr.setDuJieLevel(resp.level);
        }
        else if (resp.type == yx.proto.LevelUpType.CUI_TI)
        {
            resp.succ = true;
            yx.playerMgr.setCuiTiLevel(resp.level);
        }
        else
        {
            cc.warn("[PlayerMgr onMessageLevelUp] error levelType:" + resp.type);
            return;
        }

        yx.eventDispatch.dispatchMsg(yx.EventType.LEVEL_UP, resp);
    },

    //修炼
    onMessageXiuLian(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[PlayerMgr onMessageXiuLian] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_XiuLian.decode(data);

        yx.playerMgr.setXiuLianEndTime(resp.endTime);

        //通知显示UI开始修炼了
        yx.eventDispatch.dispatchMsg(yx.EventType.XIU_LIAN);
    },

    onMessagePropertyChg(errMsg, data){
        try{
            let retObj = yx.proto.S2C_PlayerProperty.decode(data);

            for (let i = 0; i < retObj.property.length; i++)
            {
                let propertyMsg = retObj.property[i];
        
                yx.playerMgr.setProperty(propertyMsg.type, propertyMsg.value);                
            }

            cc.log("[PlayerMgr onMessagePropertyChg]");

            //要把差值算出来通知UI界面
            yx.eventDispatch.dispatchMsg(yx.EventType.PROPERTY_CHANGE);

        }
        catch(ex)
        {
            cc.warn("[PlayerMgr onMessagePropertyChg] error:", ex);
        }
    },

    onMessageItemUseInfo(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[PlayerMgr onMessageItemUseInfo] error:" + errMsg);
            return;
        }
        let retObj = yx.proto.S2C_ItemUseInfo.decode(data);
        if (retObj){
            let itemUseMsgs = retObj.itemUse;
            this.setItemUseInfo(itemUseMsgs);
        }

    },

    onMessageItemExchangeInfo(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[PlayerMgr onMessageItemExchangeInfo] error:" + errMsg);
            return;
        }
        let retObj = yx.proto.S2C_ItemExchangeInfo.decode(data);
        if (retObj){
            let itemExchangeMsgs = retObj.itemExchange;
            this.setItemExchangeInfo(itemExchangeMsgs);
        }
    }

};

/**
 * !#en PlayerManager
 * !#zh 玩家数据类。
 * @property playerMgr
 * @type {PlayerManager}
 */
yx.playerMgr = new yx.PlayerManager();

module.exports = yx.playerMgr;