const BaseWindow = require('BaseWindow');
const GoBackWidget = require('GoBackWidget');
const EquipWidget = require("EquipWidget");

//let _slotTotal = 40;

cc.Class({
    extends: BaseWindow,

    properties: { 
        //角色信息区       
        roleSprite:         cc.Sprite,

        equipWuQiBtn:       EquipWidget,
        equipMaoZiBtn:      EquipWidget,
        equipYiFuBtn:       EquipWidget,
        equipXieZiBtn:      EquipWidget,
        equipJieZiBtn:      EquipWidget,
        equipYuPeiBtn:      EquipWidget,
        equipZuoZiBtn:      EquipWidget,
        equipFaQiBtn:       EquipWidget,

        shizhuangBtn:       cc.Button,
        infoBtn:            cc.Button,
        exchangeBtn:        cc.Button,

        backWidget:         GoBackWidget,

        sellBtn:            cc.Button,
        tidyupBtn:          cc.Button,

        bagTitleLabel:      cc.Label,
        itemCurNumLabel:    cc.Label,
        itemTotalLabel:     cc.Label,
        addBtn:             cc.Button,

        itemGroupNode:      cc.Node,
        itemLayout:         cc.Layout,
    },

    _onInit(){

        this.shizhuangBtn.node.on('click', this.onShiZhuangBtnClick, this);
        this.infoBtn.node.on('click', this.onInfoBtnClick, this);
        this.exchangeBtn.node.on('click', this.onExchangeBtnClick, this);
        this.addBtn.node.on('click', this.onAddBtnClick, this);
        this.sellBtn.node.on('click', this.onSellBtnClick, this);
       
        yx.eventDispatch.addListener(yx.EventType.PLAYER_ITEM_CHG, this.onEventItemChange, this);       
        yx.eventDispatch.addListener(yx.EventType.PKG_LEVEL_CHANGE, this.onEventPkgLevelChange, this);
        
        this._pkgCfg = yx.cfgMgr.getOneRecord("PkgLevelConfig", {Level: yx.bagMgr.getBagLevel()});

        if (!this._pkgCfg)
        {
            cc.error("[BagWindow init] pkgCfg error");
        }

        //1武器 2衣服 3鞋子 4戒指 5手镯 6玉佩 7法宝 8头盔
        //装备控件列表，按subtype排序
        this._equipList = [null, this.equipWuQiBtn, this.equipYiFuBtn, this.equipXieZiBtn, this.equipJieZiBtn, 
            this.equipZuoZiBtn, this.equipYuPeiBtn, this.equipFaQiBtn, this.equipMaoZiBtn];
    },

    _onShow(){
        // if (yx.bagMgr.getItemList() == null)
        // {
        //     yx.bagMgr.reqAllItem();
        // }
        // else
        // {
        //     yx.eventDispatch.dispatchMsg(yx.EventType.PLAYER_ITEM_CHG);
        // }
        //this.initItemGroup();
        this.onEventItemChange();
    },

    _onHide(){

    },

    _onDeInit(){

    },

    //把背包栏清空
    clearItemGroup(){
        this.itemLayout.node.removeAllChildren(true);
    },

    // //把Item的网络数据和表格属性合并
    // _combinItemMsgAndCfg(itemMsg, itemCfg)
    // {
    //     // ItemMsg
    //     // * @property {number|Long|null} [id] ItemMsg id
    //     // * @property {number|Long|null} [itemId] ItemMsg itemId
    //     // * @property {number|null} [amount] ItemMsg amount
    //     // * @property {Array.<IEquipAttrMsg>|null} [attr] ItemMsg attr
    //     let itemInfo = JSON.parse(JSON.stringify(itemCfg));

    //     if (itemInfo.hasOwnProperty("ID"))
    //     {
    //         delete itemInfo["ID"];
    //     }

    //     itemInfo.id = itemMsg.id;
    //     itemInfo.itemId = itemMsg.itemId;
    //     itemInfo.amount = itemMsg.amount;
    //     itemInfo.attr = new Array(itemMsg.attr);     

    //     return itemInfo;
    // },

    //有些类型的item是不需要显示在背包中的
    _checkNotInBag(itemMsg, itemCfg){
        if (itemMsg == null || itemMsg.wear == true)
        {
            return true;
        }

        if (itemCfg == null || itemCfg.Type == 5)
        {
            return true;
        }
        return false;
    },

    _splitItemDataBySlot(itemList){
        let newList = new Array();

        //1.遍历道具数组，如果超过堆叠数量就要进行拆分
        for (let i = 0; i < itemList.length; i++)
        {
            let itemMsg = itemList[i];
            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:itemMsg.itemId});

            if (itemCfg != null && itemMsg.amount > 0 && !this._checkNotInBag(itemMsg, itemCfg))
            {
                let itemInfo = itemMsg;// this._combinItemMsgAndCfg(itemMsg, itemCfg);
                //把几个常用属性放进来，减少后面的查表
                itemInfo.TopNum = itemCfg.TopNum;
                itemInfo.MaxPile = itemCfg.MaxPile;
                // itemInfo.Icon = itemCfg.Icon;

                while (itemInfo.MaxPile > 0 && itemInfo.amount > itemInfo.MaxPile)
                {
                    let splitItem = yx.proto.ItemMsg.create(itemInfo);// JSON.parse(JSON.stringify(itemInfo));

                    splitItem.amount = itemInfo.MaxPile;
                    newList.push(splitItem);

                    itemInfo.amount -= itemInfo.MaxPile;
                }

                newList.push(itemInfo);
            }
        }
        
        //2.对数组进行排序 用TopNum排序
        newList.sort(function(a, b){    
            //第一优先级TopNum，小的排前面
            if (a.TopNum == b.TopNum)
            {
                //如果TopNum配得一样就看id，小的排前面
                if (a.itemId == b.itemId)
                {
                    //同一种道具，拆分后数量大的放前面
                    return b.amount - a.amount; 
                }
                return a.itemId - b.itemId;
            }        
            
            return a.TopNum - b.TopNum;
        });
 
        return newList;
    },

    //初始化背包道具
    _initItemGroup(){
        let slotsNum = yx.bagMgr.getSlotsNum();  

        let itemList = this._splitItemDataBySlot(yx.bagMgr.getItemList());
        this.itemCurNumLabel.string = itemList.length.toString();

        this.clearItemGroup();
     
        for (let i = 0; i < slotsNum; i++)
        {
            //let itemSlotSrc = null;           
            //cc.log("[CreateItemSlot bag] i:" + i);

            if (i < itemList.length)
            {
                let info = itemList[i];

                if (info != null)
                {
                    cc.log("[CreateItemSlot bag] info.ID:" + info.id + " Num:" + info.amount);
                }

                yx.ItemWidget.CreateItemSlot(info, this.itemLayout.node, "slot_" + (i));
            }
            else//后面的都是空格子
            {
                yx.ItemWidget.CreateEmptySlot(this.itemLayout.node, "slot_" + (i));
            }

            //this.itemLayout.node.addChild(itemSlotSrc.node);
        }
    },

    //初始化装备图标
    _initEquipGroup(){
        for (let i = 1; i < this._equipList.length; i++)
        {
            let equipWidget = this._equipList[i];

            if (equipWidget)
            {
                equipWidget.init(i);
            }
        }
    },

    _refreshBagInfo(){
        this._pkgCfg = yx.cfgMgr.getOneRecord("PkgLevelConfig", {Level: yx.bagMgr.getBagLevel()});

        if (!this._pkgCfg)
        {
            cc.error("[BagWindow init] pkgCfg error");
        }
        
        this.bagTitleLabel.string = this._pkgCfg.Name;

        let slotsNum = yx.bagMgr.getSlotsNum();
        this.itemTotalLabel.string = "/" + slotsNum;  
    
        //如果格子有增加
        let index = this.itemLayout.node.childrenCount;

        while (index < slotsNum)
        {
            yx.ItemWidget.CreateEmptySlot(this.itemLayout.node, "slot_" + (index));

            index++;
        }
    },

    _refreshEquipByPos(pos){
        if (pos > 0)
        {
            let equipWidget = this._equipList[pos];

            if (equipWidget)
            {
                equipWidget.init(pos);
            }
        }
    },

    _refresh(){
        this._initItemGroup();

        this._initEquipGroup();

        this._refreshBagInfo();
    },

    // _removeItems(changeList)
    // {
    //     if (!changeList)
    //     {
    //         return;
    //     }

    //     let itemNodeList = this.itemLayout.node.children;

    //     let slotsNum = yx.bagMgr.getSlotsNum();

    //     //按槽的位置遍历
    //     for (let i = slotsNum - 1; i >= 0; i--)
    //     {
    //         let slotNode = itemNodeList[i];

    //         let itemWidget = slotNode.getComponentInChildren(yx.ItemWidget);

    //         //找不到格子，这种情况不应该存在
    //         if (itemWidget == null)
    //         {
    //             cc.warn("[BagWindow refreshChange] itemwidget is null index:" + i);
    //             continue;
    //         }

    //         //空格子 跳过
    //         if (itemWidget.getItemInfo() == null)
    //         {
    //             continue;
    //         }

    //         let diffCount = changeList.get(itemWidget.getItemInfo().id);

    //         if (diffCount > 0)
    //         {
    //             //不够减 直接扣光
    //             if (itemWidget.getItemInfo().amount <= diffCount)
    //             {
    //                 changeList.set(itemWidget.getItemInfo().id, diffCount - itemWidget.getItemInfo().amount);

    //                 //设为空格子，移到最后面去
    //                 itemWidget.init();
    //                 slotNode.setSiblingIndex(slotsNum - 1);
    //             }
    //             else
    //             {
    //                 itemWidget.changeAmount(newItemMsg.amount - diffCount);
    //             }
    //         }
    //     }
    // },

    // _compareItem(itemIdA, itemIdB)
    // {
    //     if (itemIdA != itemIdB)
    //     {
    //         let cfgA = yx.cfgMgr.getOneRecord("ItemConfig", {ID:itemIdA});
    //         let cfgB = yx.cfgMgr.getOneRecord("ItemConfig", {ID:itemIdB});

    //         if (cfgA && cfgB)
    //         {
    //             return cfgA.TopNum - cfgB.TopNum;
    //         }
    //         else//如果有问题，那就把小ID排前面
    //         {
    //             return itemIdA - itemIdB;
    //         }
    //     }
    //     else
    //     {
    //         return 0;
    //     }
    // },

    // _refreshChg(changeList){
    //     //合并add sub
    //     //过滤掉checkInBag
    //     //sort
    //     if (!changeList || changeList.length == 0)
    //     {
    //         return;
    //     }

    //     let itemNodeList = this.itemLayout.node.children;
    //     let slotIndex = 0;

    //     for (let i = 0; i < changeList.length; i++)
    //     {
    //         let chgItemMsg = changeList[i];
    //         let destSlotNode = itemNodeList[slotIndex];

    //         if (!destSlotNode)
    //         {
    //             continue;
    //         }

    //         let itemWidget = destSlotNode.getComponentInChildren(yx.ItemWidget);
    //         let destItemInfo;

    //         if (!itemWidget || !(destItemInfo = itemWidget.getItemInfo()))
    //         {
    //             continue;
    //         }
        
    //         let ret = this._compareItem(chgItemMsg.itemId, destItemInfo.itemId);
            
    //         if (ret < 0)
    //         {
    //             //insert   
    //         }
    //         else if (ret == 0)
    //         {

    //         }
    //         else
    //         {

    //         }
    //     }      
    // },

    _printSlotsStatus(preStr){
        let itemNodeList = this.itemLayout.node.children;
        let slotsNum = yx.bagMgr.getSlotsNum();

        let log = preStr;

        for (let i = 0; i < slotsNum; i++)
        {
            let slotNode = itemNodeList[i];

            if (slotNode == null)
            {
                log += i + ":no node "; 
                continue;
            }

            let itemWidget = slotNode.getComponentInChildren(yx.ItemWidget);

            //找不到格子，这种情况不应该存在
            if (itemWidget == null)
            {
                log += i + ":no item "; 
            }
            else if (itemWidget.getItemInfo() == null)
            {
                log += i + ":no info ";
            }
            else
            {
                log += i + ":" + itemWidget.getItemInfo().id + ":" + itemWidget.getItemInfo().itemId + " ";
            }
        }

        cc.log(log);
    },

    _refreshSlots(){
        let itemList = this._splitItemDataBySlot(yx.bagMgr.getItemList());
        let itemNodeList = this.itemLayout.node.children;
        this.itemCurNumLabel.string = itemList.length.toString();

        let slotsNum = yx.bagMgr.getSlotsNum();

        //按槽的位置遍历
        for (let i = 0; i < slotsNum; i++)
        {
            let newItemMsg = itemList[i];
            let slotNode = itemNodeList[i];

            // test code
            //this._printSlotsStatus("==============================before change===========================\n");
            
            //找不到格子，这种情况不应该存在
            if (slotNode == null)
            {
                cc.warn("[BagWindow refreshChange] slotNode is null index:" + i);
                continue;
            }

            let itemWidget = slotNode.getComponentInChildren(yx.ItemWidget);

            //找不到格子，这种情况不应该存在
            if (itemWidget == null)
            {
                cc.warn("[BagWindow refreshChange] itemwidget is null index:" + i);
                continue;
            }
          
            itemWidget.init(newItemMsg);                 
        }
    },

    //只刷新变化的
    // _refreshChange(changeNotify){
    //     let itemList = this._splitItemDataBySlot(yx.bagMgr.getItemList());
    //     let itemNodeList = this.itemLayout.node.children;
    //     this.itemCurNumLabel.string = itemList.length.toString();

    //     let slotsNum = yx.bagMgr.getSlotsNum();

    //     //按槽的位置遍历
    //     for (let i = 0; i < slotsNum; i++)
    //     {
    //         let newItemMsg = itemList[i];
    //         let slotNode = itemNodeList[i];

    //         // test code
    //         this._printGridStatus("==============================before change===========================\n");
            
    //         //找不到格子，这种情况不应该存在
    //         if (slotNode == null)
    //         {
    //             cc.warn("[BagWindow refreshChange] slotNode is null index:" + i);
    //             continue;
    //         }

    //         let itemWidget = slotNode.getComponentInChildren(yx.ItemWidget);

    //         //找不到格子，这种情况不应该存在
    //         if (itemWidget == null)
    //         {
    //             cc.warn("[BagWindow refreshChange] itemwidget is null index:" + i);
    //             continue;
    //         }

    //         //空数据 清空格子
    //         if (!newItemMsg)
    //         {
    //             cc.log("清掉格子 位置:" + (i + 1));
    //             if (itemWidget.getItemInfo() != null)
    //             {
    //                 itemWidget.init();                    
    //             }   
    //             slotNode.setSiblingIndex(i);             
    //             continue;
    //         }

    //         //空格子 把数据给他
    //         if (itemWidget.getItemInfo() == null)
    //         {                
    //             itemWidget.init(newItemMsg);     
    //             slotNode.setSiblingIndex(i);
    //             cc.log("空格子 把数据给他 位置:" + (i + 1));
    //             continue;   
    //         }

    //         //ID不一样，插入
    //         if (newItemMsg.id != itemWidget.getItemInfo().id)
    //         {
    //             slotNode = yx.ItemWidget.CreateItemSlot(newItemMsg, this.itemLayout.node, "slot_" + (i));
    //             slotNode.setSiblingIndex(i);
    //             //itemNodeList.splice(i, 0, slotNode);

    //             cc.log("创建新格子 id: " + newItemMsg.id + "插入到 位置:" + (i + 1));
                
    //             //插入新的，把最后一个删除
    //             let lastNode = itemNodeList.pop();
    //             lastNode.removeFromParent(true);
    //         }
    //         else if (newItemMsg.amount == 0)
    //         {
    //             //数量如果为0 清空格子
    //             itemWidget.init();       
    //             cc.log("数量如果为0 清空格子 位置:" + (i + 1));
    //         }
    //         else if (newItemMsg.amount != itemWidget.getItemInfo().amount)//ID一样，数量不一样，修改
    //         {
    //             itemWidget.changeAmount(newItemMsg.amount);
    //             cc.log("ID一样，数量不一样，修改数量 位置:" + (i + 1));
    //         }

    //         slotNode.setSiblingIndex(i);
    //     }
    // },

    //按钮响应事件
    //时装点击
    onShiZhuangBtnClick(){
        cc.log("onShiZhuangBtnClick");

    },

    onInfoBtnClick(){
        yx.windowMgr.showWindow("roleInfo");
    },

    onExchangeBtnClick(){

    },

    onAddBtnClick(){
        yx.windowMgr.showWindow("pkgUpgrade");
    },

    onSellBtnClick(){
        yx.windowMgr.showWindow("oneKeySell");        
    },

    onEventItemChange(changeNotify){
        if (this.isShown())
        {
            if (this.itemLayout.node.childrenCount > 0)
            {
                this._refreshSlots();
                //this._refreshChange(changeNotify);

                if (changeNotify && changeNotify.wear && changeNotify.wear.length > 0)
                {
                    this._initEquipGroup();
                }
            }
            else
            {
                this._refresh();
            }            
        }
    },   

    // onEventEquipmentOpt(){
    //     if (!this.isShown())
    //     {
    //         return;
    //     }

    //     this._initEquipGroup();
    //     //this._refreshEquipByPos(resp.pos);
    //     //this._refreshChange();
    // },

    onEventPkgLevelChange(){
        if (!this.isShown())
        {
            return;
        }

        this._refreshBagInfo();
    },
});