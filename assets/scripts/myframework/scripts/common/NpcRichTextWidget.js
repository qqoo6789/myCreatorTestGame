/**
 * 与ItemRichTextWidget 一样，大小不一样，用于NPC头像
 * @type {string}
 * @private
 */

let _prefabPath = "prefabs/widgets/NpcRichTextWidget";

let NpcRichTextWidget = cc.Class({
    extends: cc.Component,

    properties: {
        bgSprite:       cc.Sprite,
        iconSprite:     cc.Sprite,
        selectedSprite: cc.Sprite,
        contentRichText:       cc.RichText,
    },

    statics: {
        _itemPrefab:    null,

        CreateItemSlot(info, parent, name,cb,init_cb){
            if (info != null)
            {
                cc.log("[CreateItemSlot 1] info.ID:" + info.ID );
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

                    let itemSrc = go.getComponent(NpcRichTextWidget);

                    if (itemSrc)
                    {
                        itemSrc.init(info,cb,name,init_cb);

                        slotNode.addChild(go);
                        slotNode.setContentSize(go.getContentSize());

                        if(init_cb)
                        {
                            init_cb(itemSrc.itemCfg,name);
                        }
                    }
                    else
                    {
                        cc.warn("NpcRichTextWidget instantiate error!");
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
     * NpcRichTextWidget的初始化函数
     * @param info 道具信息
     * info 参入传入 示例： {ID:7}
     */
    init(info,cb,name){

        this._cb = cb;
        this.node.on('click', this.onBtnClick, this);
        this.node.setContentSize(this.bgSprite.node.getContentSize());

        this._itemInfo = info;
        this._name = name;

        if (this._itemInfo)
        {
            this.itemCfg = yx.cfgMgr.getRecordByKey("NpcListConfig", {ID:this._itemInfo.ID});

            if (this.itemCfg)
            {   
                this._itemInfo.npcConfig = this.itemCfg;
            
                if (this.itemCfg.Icon != null )//&& this._itemInfo.Icon.length > 0)
                {
                    cc.log("icon22==="+this.itemCfg.Icon);
                    yx.resUtil.LoadSpriteFromResConfig(this.itemCfg.Icon, yx.ResType.NPC, this.iconSprite);
                }

            }
            // this.contentRichText.string = info["content"];

            this.contentRichText.string = "<color=#ffd066>"+this.itemCfg.Name+"<color>\n<color=#ffffff>"+this.itemCfg.ZhiWuName+"<color>"

            this.selectedSprite.node.active = false;
        }
    },

    //点击
    onBtnClick(){

        if (this._itemInfo == null)
        {
            return;
        }

        if (this._cb){
            this._cb(this.itemCfg,this._name);
        }

    },
});

yx.NpcRichTextWidget = module.exports = NpcRichTextWidget;
