/**
 * 背包内的道具控件
 */

let _prefabPath = "prefabs/widgets/ItemWidget";
let _itemIconPath = "icon/item/";
//let _itemPrefab = null;

let ItemWidget = cc.Class({
    extends: cc.Component,

    properties: { 
        bgSprite:       cc.Sprite,
        iconSprite:     cc.Sprite,
        numLabel:       cc.Label,

        _itemInfo:      null,
    },

    statics: {
        _itemPrefab:    null,

        CreateEmptySlot(parent, name){
            return ItemWidget.CreateItemSlot(null, parent, name);
        },

        CreateItemSlot(info, parent, name){
            if (info != null)
            {
                cc.log("[CreateItemSlot 1] info.ID:" + info.id + " Num:" + info.amount);
            }
          
            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);
            
            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                if (!err) 
                {
                    //ItemWidget._itemPrefab = prefab;

                    let go = cc.instantiate(prefab);
                    if (info != null)
                    {
                        cc.log("[CreateItemSlot loadRes2] info.ID:" + info.id + " Num:" + info.amount);
                    }

                    if (name != null)
                    {
                        go.name = name;
                    }
    
                    let itemSrc = go.getComponent(ItemWidget);
    
                    if (itemSrc) 
                    {              
                        itemSrc.init(info);  
                        
                        slotNode.addChild(go);
                        slotNode.setContentSize(go.getContentSize());
                    } 
                    else 
                    {
                        cc.warn("ItemWidget instantiate error!");
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
     * ItemWidget的初始化函数
     * @param {ItemInfo} info 道具信息
     * 特别的：若传入的数量amout 为-1，则隐藏amoutLabel
     */
    init(info){
        if (info && info.clickCallBack){
            this._cb = info.clickCallBack;
        }

        this.node.on('click', this.onBtnClick, this);
        this.node.setContentSize(this.bgSprite.node.getContentSize());

        this._itemInfo = info || null;
   
        if (this._itemInfo == null || this._itemInfo.itemId == null || this._itemInfo.amount == null)
        {  
            this._setSlotEmpty();
        }
        else
        {
            cc.log("[ItemWidget init] ID: " + this._itemInfo.id + " itemId:" + this._itemInfo.itemId + " Num: " + this._itemInfo.amount);
            let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:this._itemInfo.itemId});

            cc.log("Item Info:", itemCfg);            

            if (itemCfg == null)
            {
                this._setSlotEmpty();
            }
            else
            {
                this._itemInfo.Icon = itemCfg.Icon;
                this._itemInfo.Type = itemCfg.Type;
                this._itemInfo.Name = itemCfg.Name;

                this._setSlot(this._itemInfo.Icon, this._itemInfo.Type, info.amount);
            }
        }
    },

    _setSlotEmpty(){
        this.iconSprite.node.active = false;
        this.numLabel.node.active = false;
    },

    _setSlot(icon, type, amount){
        this.iconSprite.node.active = true;
        this.numLabel.node.active = true;

        if (icon != null){
            //如果是数字，要去ResConfig中查: 目前遇到"鱼"是要去查resConfig的。若还要其他的，需要另传参数做区分；
            if(!(parseFloat(icon).toString() == "NaN")){
                let resCfg = yx.cfgMgr.getRecordByKey("ResConfig",{ID:icon});
                if (resCfg){
                    yx.resUtil.LoadSpriteByType(resCfg["Head"],yx.ResType.FISH,this.iconSprite);
                }
            }
            else if (icon.length > 0)
            {
                if (type == yx.ItemType.EQUIP)
                {
                    yx.resUtil.LoadSpriteByType(icon, yx.ResType.EQUIP, this.iconSprite);
                }
                else
                {
                    yx.resUtil.LoadSpriteByType(icon, yx.ResType.ITEM, this.iconSprite);
                }
            }
        }

        this.numLabel.string = amount;

        //若传入的数量amout 为-1，则隐藏amoutLabel
        if (amount === -1){
            this.numLabel.node.active = false;
        }
    },

    getItemInfo(){
        return this._itemInfo;
    },

    changeAmount(amount){
        this._itemInfo.amount = amount;
        this.numLabel.string = this._itemInfo.amount;   
    },

    getAmount(){
        if (this._itemInfo)
        {
            return this._itemInfo.amount;
        }

        return 0;
    },

    //点击道具栏
    onBtnClick(){
        if (this._itemInfo == null)
        {
            return;
        }

        //由于还要其他的打开方式，而这里也不好做区分。这里使用若传入回调，则使用回调的方式。会灵活一点。
        if (this._cb){return this._cb(this._itemInfo)}

        cc.log("[ItemWidget onBtnClick] itemType:" + this._itemInfo.Type);

        switch (this._itemInfo.Type) {
            case yx.ItemType.EQUIP: {
                let args = {};
                args.id = this._itemInfo.id;
                args.wear = false;

                //args.attr = this._itemInfo.attr;
                //args.num = this._itemInfo.amount;

                yx.windowMgr.showWindow("equipDetail", args);
                break;
            }
            default: {
                let args = {};
                args.id = this._itemInfo.id;
                args.num = this._itemInfo.amount;

                yx.windowMgr.showWindow("itemDetail", args);
                break;
            }
        }

    },
});

yx.ItemWidget = module.exports = ItemWidget;