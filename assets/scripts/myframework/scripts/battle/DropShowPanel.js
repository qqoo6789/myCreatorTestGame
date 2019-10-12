/**
 * 掉落详情面板
 */
const BaseWindow = require('BaseWindow');


let DropShowPanel = cc.Class({
    extends: BaseWindow,

    properties: {
        confirmBtn:             cc.Button,
        itemLayout:             cc.Layout,

        _dropList:              null,
    },

    statics:{
        ShowDropPanel(dropList){
            if (dropList == null || dropList.length == 0)
            {
                return;
            }

            let args = dropList;        
            
            yx.windowMgr.showWindow("dropPanel", args);
        },
    },

    _onInit(args){
        if (args == null)
        {
            cc.error("[ItemDetail oninit error]");
            return;
        }

        this._dropList = args;

        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);

        // optional int64 id = 1;//主键
        // optional int32 itemId = 2;//道具id
        // optional int64 amount = 3;//数量
        // repeated EquipAttrMsg attr = 4;//装备属性[非装备没有属性]
        // optional bool wear = 5;//是否已穿戴，只针对装备
        this._dropList.forEach(elem => {
            let itemInfo = {};
            itemInfo.id = elem.id;
            itemInfo.itemId = elem.itemId;
            itemInfo.amount = elem.amount;
            itemInfo.clickCallBack = this.onItemClick;

            yx.ItemWidget.CreateItemSlot(itemInfo, this.itemLayout.node, "drop");
        });
    },

    _onShow(){
        //this._refresh();
    },

    _refresh(){

    },

    onItemClick(itemInfo){
        let args = {};
        //传入Item 的id
        args.ID = itemInfo.itemId;
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },

     //确定
    onConfirmBtnClick(){
       cc.log("[DropShowPanel onConfirmBtnClick]");

        yx.windowMgr.goBack();
    },

});

module.exports = yx.DropShowPanel = DropShowPanel;
