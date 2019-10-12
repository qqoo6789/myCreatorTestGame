const BaseWindow = require('BaseWindow');
const NumberWidget = require("NumberWidget");

const pinzhiText = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九",
                    "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九"];

cc.Class({
    extends: BaseWindow,

    properties: { 
        titleLabel:             cc.Label,
        levelLabel:             cc.Label,
        iconSp:                 cc.Sprite,
        contentRichText:        cc.RichText,
        descLabel:              cc.Label,

        closeBtn:               cc.Button,

        useBtn:                 cc.Button,
        sellBtn:                cc.Button,

        _itemid:                Number,
        //_num:                   Number,
        _itemInfo:              null,
        _itemMsg:               null,
        _equipInfo:             null,
        _uid:                   Number,
    },

    _onInit(args){
        if (args == null || args.id == null)
        {
            cc.error("[ItemDetail oninit error]");
            return;
        }

        this._uid = args.id;
        //this._attr  = args.attr;
        this._wear = args.wear;
        //this._num = args.num;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    

        this.useBtn.node.on('click', this.onUseBtnClick, this);
        this.sellBtn.node.on('click', this.onSellBtnClick, this);

        this._itemMsg = yx.bagMgr.getItemById(this._uid);
        this._itemInfo = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._itemMsg.itemId});

        //this._itemInfo = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: this._itemid});
        this._equipInfo = yx.cfgMgr.getRecordByKey("EquipConfig", {ID: this._itemMsg.itemId});

        if (this._itemInfo == null || this._equipInfo == null || this._itemMsg.attr == null)
        {
            cc.error("[ItemDetail get iteminfo faild] id:" + this._itemid);
            return;
        }
    },

    _onShow(){
        this._refresh();
    },

    _getAttrString(attrList, attrpower){
        let str = "";
        if (attrList == null)
        {
            return "";
        }

        for (let i = 0; i < attrList.length; i++)
        {
            let attrInfo = attrList[i];

            var attrLimit = attrpower.find(function(element) {
                return element.type == attrInfo.type;
              });

            if (attrLimit != null)
            {
                str += yx.textDict.Attr[attrInfo.type] + "：" + attrInfo.value + "     (上限" + attrLimit.value[1] + ")\n";
            }
        }

        return str;
    },

    _refresh(){
        yx.resUtil.LoadSpriteByType(this._itemInfo.Icon, yx.ResType.EQUIP, this.iconSp);

        this.titleLabel.string = this._itemInfo.Name;
        this.levelLabel.string = pinzhiText[this._itemInfo.PinZhi] + "阶";
        this.descLabel.string = this._itemInfo.DefDesc;

        this.contentRichText.string = this._getAttrString(this._itemMsg.attr, this._equipInfo.attrpower);       

        this.sellBtn.node.active = !this._wear;

        if (this._wear)
        {
            this.useBtn.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "卸  下";
            this.sellBtn.node.active = false;
        }
        else
        {
            this.useBtn.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "穿  戴";
            this.sellBtn.node.active = true;
        }
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onUseBtnClick(){
        cc.log("[EquipDetailPanel onUseBtnClick]");

        yx.bagMgr.reqEquipmentOpt(this._itemMsg.id, !this._wear);

        yx.windowMgr.goBack();
    },


    onSellBtnClick(){
        yx.bagMgr.reqSellItem(this._itemMsg.id, this._itemMsg.itemId, 1);

        yx.windowMgr.goBack();
    },
});