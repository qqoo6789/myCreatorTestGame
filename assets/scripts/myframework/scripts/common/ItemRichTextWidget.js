/**
 * 与ItemWidget 一样，只是文本使用的是RichText，可以产生不同颜色的文字
 * @type {string}
 * @private
 */

let _prefabPath = "prefabs/widgets/ItemRichTextWidget";

let ItemRichTextWidget = cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite:       cc.Sprite,
        iconSprite:     cc.Sprite,
        contentRichText:       cc.RichText,
    },

    statics: {
        _itemPrefab:    null,



        CreateItemSlot(info, parent, name,cb){
            if (info != null)
            {
                cc.log("[CreateItemSlot 1] info.ID:" + info.ID + " content:" + info.content);
            }

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

                    let itemSrc = go.getComponent(ItemRichTextWidget);

                    if (itemSrc)
                    {
                        itemSrc.init(info,cb);

                        slotNode.addChild(go);
                        slotNode.setContentSize(go.getContentSize());
                    }
                    else
                    {
                        cc.warn("ItemRichTextWidget instantiate error!");
                    }
                }
                else
                {
                    cc.warn(_prefabPath + " is not exist!");
                }
            });
        },
    },
    /**
     * ItemRichTextWidget的初始化函数
     * @param info 道具信息
     * info 参入传入 示例： {ID:7,content:"<color=#FF0000>7</c>/<color=#FFFFFF>400</color>"} ,ID表示 ItemConfig 表的ID,content 代表显示的信息
     */
    init(info,cb){

        //事件只绑定一次
        if (!this._init){
            this.node.on('click', this.onBtnClick, this);
            this.contentRichText.node.active = false;
        }
        this._cb = cb;

        this.node.setContentSize(this.bgSprite.node.getContentSize());

        this._init = true;

        this.refresh(info);

    },

    //可供外部刷新使用
    refresh(info){
        this._itemInfo = info;

        if (this._itemInfo)
        {
            this.itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:this._itemInfo.ID});

            if (this.itemCfg)
            {
                this._itemInfo.Icon = this.itemCfg.Icon;
                this._itemInfo.Type = this.itemCfg.Type;
                //yx.resUtil.LoadSpriteByType(this._itemInfo.Icon, yx.ResType.ITEM, this.iconSprite);


                if (this._itemInfo.Icon != null){
                    //如果是数字，要去ResConfig中查: 目前遇到鱼是要去查resConfig的。若还要其他的，需要另传参数做区分；
                    if(!(parseFloat(this._itemInfo.Icon).toString() == "NaN")){
                        let resCfg = yx.cfgMgr.getRecordByKey("ResConfig",{ID:this._itemInfo.Icon});
                        if (resCfg){
                            yx.resUtil.LoadSpriteByType(resCfg["Head"],yx.ResType.FISH,this.iconSprite);
                        }
                    }else {
                        //一般的直接读item_xx
                        if (this._itemInfo.Icon.length > 0)
                        {
                            if (this._itemInfo.Type == yx.ItemType.EQUIP)
                            {
                                yx.resUtil.LoadSpriteByType(this._itemInfo.Icon, yx.ResType.EQUIP, this.iconSprite);
                            }
                            else
                            {
                                yx.resUtil.LoadSpriteByType(this._itemInfo.Icon, yx.ResType.ITEM, this.iconSprite);
                            }
                        }
                    }
                }
            }
            this.contentRichText.node.active = true;
            this.contentRichText.string = info["content"];
        }
    },

    //点击
    onBtnClick(){

        if (this._itemInfo == null)
        {
            return;
        }

        if (this._cb){
            this._cb(this.itemCfg);
            return;
        }

        
        let args = {};
        //传入Item 的id
        args.ID = this.itemCfg["ID"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
        

    },
    setBtnClickCb(cb){
        this._cb = cb;
    }
});

yx.ItemRichTextWidget = module.exports = ItemRichTextWidget;
