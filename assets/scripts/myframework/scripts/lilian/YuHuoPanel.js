const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn: cc.Button,
        itemLayout: cc.Layout,
    },
    _onInit(args) {
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
    },
    itemClick(itemCfg){
        let args = {};
        //传入Item 的id
        args.ID = itemCfg["itemId"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },
    _onShow(){

        let itemList = this._splitItemDataBySlot(yx.bagMgr.getItemList());

        for (let i = 0; i < 65; i++){//13*5

            if (i < itemList.length)
            {
                let info = itemList[i];
                info.clickCallBack = this.itemClick;

                yx.ItemWidget.CreateItemSlot(info, this.itemLayout.node, "slot_" + (i));
            }
            else//后面的都是空格子
            {
                yx.ItemWidget.CreateEmptySlot(this.itemLayout.node, "slot_" + (i));
            }
           // yx.ItemWidget.CreateItemSlot({itemId:10095,amount:99}, this.itemLayout.node, "slot_" + (i));
        }

    },
    _onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    _splitItemDataBySlot(itemList){
        let newList = new Array();

        //1.遍历道具数组，如果超过堆叠数量就要进行拆分
        for (let i = 0; i < itemList.length; i++)
        {
            let itemMsg = itemList[i];
            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:itemMsg.itemId});

            //只要显示鱼
            if (itemCfg != null && itemMsg.amount > 0 && itemCfg.Type == 5)
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

});
