let _TuJianItemWidgetPrefabPath = "prefabs/widgets/TuJianItemWidget";//

let TuJianItemWidget = cc.Class({
    extends: cc.Component,

    properties: {
        iconSprite:     cc.Sprite,
        contentRichText:cc.RichText,
        hadGetSp:cc.Sprite,
        unGetSp:cc.Sprite,
    },

    statics: {
        _itemPrefab:    null,

        CreateItem(info, parent, name,cb){

            TuJianItemWidget._itemPrefab = null;//强制使用动态加载

            if (TuJianItemWidget._itemPrefab){
                return TuJianItemWidget._createItemWithPrefab(info, parent, name,TuJianItemWidget._itemPrefab,cb);
            }else{
                cc.loader.loadRes(_TuJianItemWidgetPrefabPath, function (err, prefab) {
                    cc.log("[图鉴item 动态加载");
                    if (!err)
                    {
                        TuJianItemWidget._itemPrefab = prefab;
                        return TuJianItemWidget._createItemWithPrefab(info, parent, name,TuJianItemWidget._itemPrefab,cb);
                    }
                    else
                    {
                        cc.warn(_TuJianItemWidgetPrefabPath + " is not exist!");
                    }
                });
            }

        },
        _createItemWithPrefab:function (info,parent, name,prefab,cb) {

            if (info != null)
            {
                cc.log("[图鉴TuJianItemWidget CreateItem] info:" + info);
            }

            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(TuJianItemWidget);

            if (itemSrc)
            {
                itemSrc.init(info,cb);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("TuJianItemWidget instantiate error!");
            }
            return itemSrc;
        }

    },

    init(info,cb){
        this._info = info;
        this._cb = cb;

        //点击监听
        this.node.on('click', this._onTuJianItemBtnClick, this);

        //是否已获得显示
        this.hadGetSp.node.active = info["own"];
        this.unGetSp.node.active = !info["own"];

        //加载图片
        let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig",{ID:info["itemId"]});
        //yx.resUtil.LoadSpriteByType(itemCfg.Icon, yx.ResType.ITEM, this.iconSprite);
        if (itemCfg.Icon != null && itemCfg.Icon.length > 0)
        {
            if (itemCfg.Type == yx.ItemType.EQUIP)
            {
                yx.resUtil.LoadSpriteByType(itemCfg.Icon, yx.ResType.EQUIP, this.iconSprite);
            }
            else
            {
                yx.resUtil.LoadSpriteByType(itemCfg.Icon, yx.ResType.ITEM, this.iconSprite);
            }
        }


        //设置内容
        //this.contentRichText.string = yx.colorUtil.AddColorString(itemCfg["Name"],yx.textDict.QualityColor[itemCfg["PinZhi"]]) ;
        this.contentRichText.string = yx.colorUtil.AddColorString(itemCfg["Name"],yx.textDict.QualityColor[ this._info["pinzhi"]]) ;
    },

    _onTuJianItemBtnClick(){
        cc.log("_onTuJianItemBtnClick");
        if (this._cb){
            this._cb(this._info);
        }
    }
});

yx.TuJianItemWidget = module.exports = TuJianItemWidget;