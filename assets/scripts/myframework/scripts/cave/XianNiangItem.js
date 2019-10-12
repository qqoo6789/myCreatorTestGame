const _lingShiItemIcon = "item_1";
const _yuItemIcon = "item_2";
const  _prefabPath = "prefabs/widgets/XianNiangItem";
let XianNiangItem = cc.Class({
    extends: cc.Component,

    properties: {
        xianNiangSp:cc.Sprite,
        stuffLabelBg:cc.Sprite,
        stuffLabel:cc.Label,
        costSp:cc.Sprite,
        costLabel:cc.Label,
        itemBtn:cc.Button,
        checkMark:cc.Node,
        buyBtn:cc.Button,
    },

    statics: {
        _itemPrefab:    null,

        CreateItem(info, parent, name,type,itemCb,buyCb){

            if (XianNiangItem._itemPrefab){
                return XianNiangItem._createItemWithPrefab(info, parent, name,XianNiangItem._itemPrefab,type,itemCb,buyCb);
            }else{
                cc.loader.loadRes(_prefabPath, function (err, prefab) {
                    cc.log("[仙酿item 动态加载");
                    if (!err)
                    {
                        XianNiangItem._itemPrefab = prefab;
                        return XianNiangItem._createItemWithPrefab(info, parent, name,XianNiangItem._itemPrefab,type,itemCb,buyCb);
                    }
                    else
                    {
                        cc.warn(_prefabPath + " is not exist!");
                    }
                });
            }
        },
        _createItemWithPrefab:function (info,parent, name,prefab,type,itemCb,buyCb) {
            if (info != null)
            {
                cc.log("[仙酿XianNiangItem CreateItem] info:" + info);
            }
            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(XianNiangItem);

            if (itemSrc)
            {
                itemSrc.init(info,type,itemCb,buyCb);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("XianNiangItem instantiate error!");
            }
            return itemSrc;
        }

    },

    /**
     *
     * @param info
     * @param  type = SHOW_TYPE_BUY,        info为 XianNiangStoreConfig.json的指定的对象
     *         type = SHOW_TYPE_TIAO_ZHI，  info为 XianNiangMake.json的指定的对象
     * @param itemCb
     */
    init(info,type,itemCb,buyCb){

        this._itemCb = itemCb;
        this._buyCb = buyCb;
        this._info = info;
        this._type = type;
        //购买 仙酿页面  XianNiangStoreConfig
        if (type == yx.XianNiangWindow.SHOW_TYPE_BUY){
            //消耗品显示
            this.costSp.node.active = true;

            //获取对应的item
            let _itemCfgInfo =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID: info["Reward"][0]["id"]});

            //显示材料icon
            this._setSprite(_itemCfgInfo["Icon"],_itemCfgInfo["Type"],this.xianNiangSp);

            //材料名称
            this.stuffLabel.string   = info["Name1"];

            //材料消费
            this.costLabel.string = info["Cost"][0]["count"];

            //消费材料的sprite
            if (info["Cost"][0]["id"] == 1){
                //灵石消耗
                yx.resUtil.LoadSpriteByType(_lingShiItemIcon, yx.ResType.ITEM, this.costSp);
            }else if (info["Cost"][0]["id"] == 2){
                //玉石消耗
                yx.resUtil.LoadSpriteByType(_yuItemIcon, yx.ResType.ITEM, this.costSp);
            }

            //微调位置
            //this.stuffLabelBg.node.y = -43;

        }
        //调制 仙酿页面 XianNiangMake
        else if (type == yx.XianNiangWindow.SHOW_TYPE_TIAO_ZHI){
            //消耗品显示
            this.costSp.node.active = false;

            //获取对应的item
            let _itemCfgInfo =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID: info["Reward"][0]["id"]});

            //显示材料icon
            this._setSprite(_itemCfgInfo["Icon"],_itemCfgInfo["Type"],this.xianNiangSp);

            //材料名称
            this.stuffLabel.string   = info["Name1"];

            //微调位置
            //this.stuffLabelBg.node.y = -60;
        }

        this.itemBtn.node.on('click', this._onItemBtnClick.bind(this), this);
        this.buyBtn.node.on('click', this._onBuyBtnClick.bind(this), this);
    },

    _onBuyBtnClick(){
        if (this._buyCb){
            this._buyCb(this,this._type,this._info);
        }
    },

    _onItemBtnClick(){
        if (this._itemCb){
            this._itemCb(this,this._type,this._info);
        }
    },

    //设置当前被选中
    showIsCheck(is){
        this.checkMark.active = is;
    },

    _setSprite(icon,type,sprite){
        if (icon != null && icon.length > 0)
        {
            if (type == yx.ItemType.EQUIP)
            {
                yx.resUtil.LoadSpriteByType(icon, yx.ResType.EQUIP, sprite);
            }
            else
            {
                yx.resUtil.LoadSpriteByType(icon, yx.ResType.ITEM, sprite);
            }
        }
    },

});

yx.XianNiangItem = module.exports = XianNiangItem;