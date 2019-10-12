
/**
 * !#en BagManager
 * !#zh 背包管理类。
 * @class BagManager
 * @extends 
 */
yx.BagManager = function () {
    //格子数
    this._slotsNum = 0;
    //背包等级
    this._pkgLevel = 0;
    //虚空石使用数
    this._stoneUse = 0;

    //道具列表 实际上是个Map
    this._itemList = null;

    this._equipmentMap = new Map();

    // 道具兑换次数列表
    this._exchangeList = null;
};

yx.BagManager.prototype = {
    constructor: yx.BagManager,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.ITEM_CHANGE, this.onMessageItemChange);
        yx.network.addHandler(yx.proto.CmdId.ALL_ITEM, this.onMessageAllItem);
        yx.network.addHandler(yx.proto.CmdId.USE_ITEM, this.onMessageUseItem);
        yx.network.addHandler(yx.proto.CmdId.EXCHANGE_ITEM, this.onMessageExchangeItem);
        yx.network.addHandler(yx.proto.CmdId.SELL_ITEM, this.onMessageSellItem);
        yx.network.addHandler(yx.proto.CmdId.SELL_MANY_EQUIP, this.onMessageSellOneKey);
        yx.network.addHandler(yx.proto.CmdId.EQUIPMENT_OPT, this.onMessageEquipmentOpt);        
        yx.network.addHandler(yx.proto.CmdId.PKG_LEVEL_CHANGE, this.onMessagePkgChg);        
    
    },
   
    initItemList(itemList){  
        this._itemList = new Map();  

        itemList.forEach(itemMsg => {
            if (this._itemList.has(itemMsg.id))
            {
                cc.warn("[BagMgr initItemList] item.id:" + itemMsg.id + " duplicate");
            }
            else
            {                
                let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", itemMsg.itemId);

                if (itemCfg)
                {
                    if (itemMsg.wear == true && itemCfg.Type == yx.ItemType.EQUIP)
                    {
                        if (this._equipmentMap.has(itemCfg.SubType))
                        {
                            //重复的装备位置
                            cc.error("[BagMgr initItemList] equipment duplicate subtype");
                        }
                        else
                        {
                            this._equipmentMap.set(itemCfg.SubType, itemMsg.id);
                        }                       
                    }
                  
                    this._itemList.set(itemMsg.id, itemMsg);                    
                }
                else
                {
                    //道具配置不存在，可能是新增道具，要更新配置表
                    cc.warn("[BagMgr initItemList] cfg is not exist! itemid:" + itemMsg.itemId);
                }
                
            }            
        });
    },

    getItemList()
    {
        let newList = new Array();

        for (let itemMsg of this._itemList.values())
        {
            newList.push(yx.proto.ItemMsg.create(itemMsg));
        }

        return newList;
    },

    /**
     * 获取道具的数量
     * @param {Number} itemId 道具ID
     */
    getItemNum(itemId){
        if (this._itemList == null)
        {
            return 0;
        }

        let count = 0;

        this._itemList.forEach(item => {
            if (item.itemId == itemId)
            {
                count += item.amount;
            }
        });

        return count;
    },

    //兼容单个值或者数组
    getItemNumByPinZhi(pinzhi, itemType){
        let pinzhiList = new Array();
        if (pinzhi instanceof Number)
        {
            pinzhiList.push(pinzhi);
        }
        else if (pinzhi instanceof Array)
        {
            pinzhiList = pinzhi;
        }
        else
        {
            return 0;
        }

        let count = 0;

        this._itemList.forEach(item => {
            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", item.itemId);

            if (itemCfg && itemCfg.Type == itemType && pinzhiList.includes(itemCfg.PinZhi))
            {
                count++;
            }
        });

        return count;
    },

    //这个ID是服务端下发的UID
    getItemById(id){
        if (this._itemList.has(id))
        {
            return yx.proto.ItemMsg.create(this._itemList.get(id));
        }

        return null;
    },

    //用itemId查找item信息，如果不存在返回null
    getItemByItemId(itemId){
        let itemMsg = null;

        this._itemList.forEach(item => {
            if (item.itemId == itemId)
            {
                itemMsg = item;
            }
        });

        if (itemMsg != null)
        {
            return yx.proto.ItemMsg.create(itemMsg);
        }
        else
        {
            return null;
        }
    },

    getEquipment(equipType)
    {
        if (this._equipmentMap.has(equipType))
        {
            return this.getItemById(this._equipmentMap.get(equipType));
        }

        return null;
    },

    //道具变化
    changeItem(itemlist){ 
        if (itemlist == null || itemlist.length == 0)
        {
            return;
        }

        cc.log("[BagMgr changeItem] change length:" + itemlist.length);

        let changeNotify = {};
        changeNotify.add = new Array();
        changeNotify.sub = new Array();
        changeNotify.wear = new Array();
        // changeNotify.add = new Map();
        // changeNotify.sub = new Map();

        itemlist.forEach(itemMsg =>{
            let findItem = this._itemList.get(itemMsg.id);
            if (findItem)
            {
                let diff = Math.abs(findItem.amount - itemMsg.amount);
          
                if (findItem.amount < itemMsg.amount)
                {                    
                    findItem.amount = itemMsg.amount
                    itemMsg.amount = diff;
                    changeNotify.add.push(itemMsg);
                }
                else if (findItem.amount > itemMsg.amount)
                {
                    findItem.amount = itemMsg.amount
                    itemMsg.amount = diff;
                    changeNotify.sub.push(itemMsg);

                    if (findItem.amount == 0)
                    {
                        this._itemList.delete(itemMsg.id);
                    }
                }
                else if (findItem.wear != itemMsg.wear)//更新装备穿脱状态
                {
                    findItem.wear = itemMsg.wear;

                    this.changeEquipWear(findItem.id, findItem.wear);

                    changeNotify.wear.push(itemMsg);
                }
            }
            else
            {
                this._itemList.set(itemMsg.id, itemMsg);
                changeNotify.add.push(itemMsg);
            }
        });
        
        yx.eventDispatch.dispatchMsg(yx.EventType.PLAYER_ITEM_CHG, changeNotify);
    },

    setPkgArgs(num, level, useTimes){
        this._slotsNum = num;
        this._pkgLevel = level;
        this._stoneUse = useTimes;
    },

    getSlotsNum(){
        return this._slotsNum;
    },

    getBagLevel(){
        return this._pkgLevel;
    },

    getStoneUse(){
        return this._stoneUse;
    },

    // 获取玩家数据后调用，初始化所有兑换次数
    setExchangeData(list){
        cc.log("setExchangeData");
        if(list)
        {
            cc.log("list  setExchangeData");
            this._exchangeList = {};
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                cc.log("element.id=="+element.id);
                cc.log("element.amount=="+element.amount);
                this._exchangeList[element.id] = element.amount;
            }
        }
    },

    // 增加兑换次数
    addExchangeAmount(exchangeId){
        this._exchangeList[exchangeId] = this.getExchangeAmount(exchangeId) + 1;
    },

     // 获取兑换次数
    getExchangeAmount(exchangeId){
        if(this._exchangeList && this._exchangeList[exchangeId])
            return this._exchangeList[exchangeId];

        return 0;
    },

    // 跨天时调用，清空所有每日兑换的兑换次数
    clearDailyExchangeAmount(){
        if(this._exchangeList)
        {
            for (const key in this._exchangeList) {
                cc.log("key=="+key);
                if (this._exchangeList.hasOwnProperty(key)) {
                    let exchangeCfg = yx.cfgMgr.getOneRecord("ExchangeConfig", {ID:key});
                    if(exchangeCfg.DayNum > 0)
                    {
                        this._exchangeList[key] = 0; 
                    }
                }
            }
        }
    },

    // 获取物品或者材料的名字
    GetItemName(type,id){
        let itemId = id;
        if(type == 0 && id < 80000)
        {
            itemId = id + 80000;
        }
        let rewardItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", itemId);
        if(rewardItemCfg)
            return rewardItemCfg.Name;

        return "";
    },

    // 获取物品或者材料当前拥有的个数
    GetItemOwnCount(type,id){
        let itemId = id;
        let count = 0;
        if(type == 0 && id < 80000)
        {
            itemId = id + 80000;
            count = yx.playerMgr.getCurrency(itemId); 
        }
        else
        {
            count = yx.bagMgr.getItemNum(itemId);
        }
        return count;
    },

    changeEquipWear(id, wear)
    {     
        if (wear)//穿
        {
            let itemMsg = this.getItemById(id);

            if (!itemMsg)
            {
                return;
            }

            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", itemMsg.itemId);

            if (!itemCfg)
            {
                //道具配置不存在，可能是新增道具，要更新配置表
                cc.warn("[BagMgr initItemList] cfg is not exist! itemid:" + itemMsg.itemId);
                return;
            }

            if (itemMsg.wear == true && itemCfg.Type == yx.ItemType.EQUIP)
            {          
                this._equipmentMap.set(itemCfg.SubType, itemMsg.id);                                     
            }   
        }
        else//脱
        {
            for (let [key, value] of this._equipmentMap)
            {
                if (value == id)
                {
                    this._equipmentMap.delete(key);
                    break;
                }
            }
        }        
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    //获取道具列表
    reqAllItem(){  
        yx.network.sendMessage(yx.proto.CmdId.ALL_ITEM, new yx.proto.C2S_GetAllItem());
    },

    //使用道具
    reqUseItem(itemId, count){
        let reqObj = new yx.proto.C2S_UseItem();

        reqObj.itemId = itemId;
        reqObj.count = count;

        yx.network.sendMessage(yx.proto.CmdId.USE_ITEM, reqObj);
    },

    //兑换道具
    reqExchangeItem(changeId){
        let reqObj = new yx.proto.C2S_ExchangeItem();

        reqObj.id = changeId;    

        yx.network.sendMessage(yx.proto.CmdId.EXCHANGE_ITEM, reqObj);
    },

    //出售道具
    reqSellItem(id, itemId, count){
        let reqObj = new yx.proto.C2S_SellItem();

        reqObj.id = id;
        reqObj.itemId = itemId;
        reqObj.count = count;

        yx.network.sendMessage(yx.proto.CmdId.SELL_ITEM, reqObj);
    },

    //一键出售装备
    reqSellOneKey(pinzhiList){
        let req = new yx.proto.C2S_SellManyEquip();

        req.equipQuality = pinzhiList;

        yx.network.sendMessage(yx.proto.CmdId.SELL_MANY_EQUIP, req);
    },

    reqEquipmentOpt(id, wear){
        let reqObj = new yx.proto.C2S_EquipmentOpt();

        reqObj.id = id;
        reqObj.wear = wear;

        yx.network.sendMessage(yx.proto.CmdId.EQUIPMENT_OPT, reqObj);
    },

    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    //所有道具变化，包括货币变化 这里只处理道具变化 货币变化放在playerMgr中处理
    onMessageItemChange(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageItemChg] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_ItemChange.decode(data);

        yx.playerMgr.changeCurrency(resp.currency);
        yx.bagMgr.changeItem(resp.item);
    },

    onMessageAllItem(errMsg, data){
        let retObj = yx.proto.S2C_GetAllItem.decode(data);

        if (retObj != null)
        {
            if (retObj.item != null)
            {
                yx.bagMgr.initItemList(retObj.item);

                yx.eventDispatch.dispatchMsg(yx.EventType.PLAYER_ITEM_CHG);
            }
            
            if (retObj.currency)
            {
                yx.playerMgr.initCurrency(retObj.currency);

                yx.eventDispatch.dispatchMsg(yx.EventType.CURRENCY_CHANGE);
            }
        }
    },

    onMessageUseItem(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageUseItem] error:" + errMsg);
            return;
        }

        let retObj = yx.proto.S2C_UseItem.decode(data);
        if (retObj){
            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig",{ID:retObj["itemId"]});
            if (itemCfg && itemCfg["UseType"]){
                if (itemCfg["UseType"] == 7 || itemCfg["UseType"] == 9){
                    //如果使用了丹方、图纸，那么更新一下
                    yx.caveMgr.reqMakeRoom(yx.CaveBuildType.DANFANG);
                    yx.caveMgr.reqMakeRoom(yx.CaveBuildType.QISHI);
                }
            }
        }
    },

    onMessageExchangeItem(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            yx.ToastUtil.showListToast(errMsg);
            cc.warn("[BagMgr onMessageExchangeItem] error:" + errMsg);
            return;
        }
        let retObj = yx.proto.S2C_ExchangeItem.decode(data);
        if(retObj){
            yx.bagMgr.addExchangeAmount(retObj.id);
            yx.eventDispatch.dispatchMsg(yx.EventType.ITEM_EXCHANGE,retObj);
        }

    },

    onMessageSellItem(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageSellItem] error:" + errMsg);
            return;
        }
    },

    onMessageSellOneKey(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageSellItem] error:" + errMsg);
            return;
        }
    },

    onMessageEquipmentOpt(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageSellItem] error:" + errMsg);
            return;
        }

        //let resp = yx.proto.S2C_EquipmentOpt.decode(data);

        //resp.pos = yx.bagMgr.changeEquipWear(resp.id, resp.wear);

        //yx.eventDispatch.dispatchMsg(yx.EventType.EQUIPMENT_OPT);
    },

    onMessagePkgChg(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.warn("[BagMgr onMessageSellItem] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_PackageInfo.decode(data);

        yx.bagMgr.setPkgArgs(resp.pkgNum, resp.pkgLevel, resp.pkgUse);

        yx.eventDispatch.dispatchMsg(yx.EventType.PKG_LEVEL_CHANGE);
    },
};

/**
 * !#en BagManager
 * !#zh 背包管理类。
 * @property bagMgr
 * @type {BagManager}
 */
yx.bagMgr = new yx.BagManager();

module.exports = yx.bagMgr;