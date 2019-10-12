let _prefabPath = "prefabs/widgets/DuiHuanWidget";
const ItemRichTextWidget = require('ItemRichTextWidget');

let DuiHuanWidget = cc.Class({
    extends: cc.Component,

    properties: {
        rewordItemWidget:ItemRichTextWidget,//收获
        costItemWidget1:ItemRichTextWidget,//消耗1
        costItemWidget2:ItemRichTextWidget,//消耗2
        duiHuanBtn:cc.Button,
        bgNode:cc.Node,//背景图片
        ownSpNode:cc.Node,//拥有标志
    },
    statics: {
        _itemPrefab:    null,

        CreateItemSlot(info, parent, name,customWidth){

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                if (!err)
                {
                    let go = cc.instantiate(prefab);

                    if (name != null)
                    {
                        go.name = name;
                    }

                    let itemSrc = go.getComponent(DuiHuanWidget);

                    if (itemSrc)
                    {
                        itemSrc.init(info,customWidth);

                        slotNode.addChild(go);
                        slotNode.setContentSize(go.getContentSize());
                    }
                    else
                    {
                        cc.warn("DuiHuanWidget instantiate error!");
                    }
                }
                else
                {
                    cc.warn(_prefabPath + " is not exist!");
                }
            });

            return slotNode;
        },
    },
    /**
     *
     * @param exchangeCfgItem对应于ExchangConfig里对应的item
     */
    init(exchangeCfgItem,customWidth){
        this._setCustomWidth(customWidth);
        //把兑换需要的组件放数组
        this.costItemWidgetArr = [];
        this.costItemWidgetArr.push(this.costItemWidget1);
        this.costItemWidgetArr.push(this.costItemWidget2);

        this.duiHuanBtn.node.on("click",this.duiHuanBtnClick,this);

        this.refresh(exchangeCfgItem);
    },

    refresh(exchangeCfgItem){
        this._exchangeCfgItem = exchangeCfgItem;

        if (!exchangeCfgItem) return;

        //收获物品/兑换物品
        let rewordItems = exchangeCfgItem["GetReward"];
        for (let i = 0; i < rewordItems.length; i ++){
            let rewordItem = rewordItems[i];
            let rewordContent = yx.colorUtil.AddColorString(rewordItem.count,yx.colorUtil.TextWhite);
            let id = rewordItem.id;
            this.rewordItemWidget.init({ID:id,content:rewordContent},this.itemClick);

            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: id});

            //道书  背包有或者已使用过
            if (itemCfg && itemCfg.UseType == 15) {
                //拥有标志
                this.ownSpNode.active = (yx.bagMgr.GetItemOwnCount(rewordItem.type,rewordItem.id) > 0) || (yx.playerMgr.getItemUseCount(rewordItem.id) > 0);

            }
        }


        //兑换消耗物品、可能有多个。目前发现最多两个。暂且这里设计为 最多两个。
        let costItems = exchangeCfgItem["Cost"];
        for (let i = 0; i < costItems.length; i ++){
            let costItem = costItems[i];
            let costItemWidget = this.costItemWidgetArr[i];
            if (costItemWidget){
                let id = costItem.id;
                let costContent = "";
                let ownNum = 0;
                let needNum = 0;
                if (costItem["type"] == 0){//货币
                    ownNum = yx.playerMgr.getCurrency(id);
                    needNum = costItem.count;
                    costContent = yx.colorUtil.AddColorString(ownNum+"/"+needNum,ownNum >= needNum?yx.colorUtil.TextWhite:yx.colorUtil.TextRed)
                }else {//背包实物

                    ownNum = yx.bagMgr.getItemNum(id);
                    needNum = costItem.count;
                    costContent = yx.colorUtil.AddColorString(ownNum+"/"+needNum,ownNum >= needNum?yx.colorUtil.TextWhite:yx.colorUtil.TextRed)
                }
                costItemWidget.node.active = true;
                costItemWidget.init({ID:id,content:costContent},this.itemClick);
            }
        }
    },
    /**
     * 兑换物品的点击回调
     * @param itemCfg
     */
    itemClick(itemCfg){
        let args = {};
        //传入Item 的id
        args.ID = itemCfg["ID"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },

    /**
     * 兑换按钮的点击事件
     */
    duiHuanBtnClick(){
        if (this._exchangeCfgItem){
            yx.bagMgr.reqExchangeItem(this._exchangeCfgItem["ID"]);
        }
    },

    //由于有些地方的布局不一样，需要不一样宽度的此widget，这里提供设置自定义长度
    _setCustomWidth(width){
        if (width){
            this.node.width = width;
            this.bgNode.width = width;
        }
    }



});

yx.DuiHuanWidget = module.exports = DuiHuanWidget;