/**
 * 炼炉item
 */

let _prefabPath = "prefabs/widgets/LianLuItem";
let LianLuItem = cc.Class({
    extends: cc.Component,

    properties: {
        rootNode:cc.Node,
        lianLuSp:cc.Sprite,
    },
    statics: {
        _itemPrefab:    null,

        _createItemWithPrefab:function (info,parent, name,prefab) {

            let go = cc.instantiate(prefab);
            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(LianLuItem);

            if (itemSrc)
            {
                itemSrc.init(info);

                slotNode.addChild(go,2);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("ItemWidget instantiate error!");
            }

        },

        CreateItemSlot(info, parent, name){
            if (LianLuItem._itemPrefab){
                LianLuItem._createItemWithPrefab(info, parent, name,LianLuItem._itemPrefab);
                return;
            }

            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                if (!err)
                {
                    LianLuItem._itemPrefab = prefab;
                    LianLuItem._createItemWithPrefab(info, parent, name,LianLuItem._itemPrefab);
                }
                else
                {
                    cc.warn(_prefabPath + " is not exist!");
                }
            });
        },
    },
    init(info){
        if (!info.Icon){
            //this.lianLuSp.removeComponent(cc.Sprite);
            return;
        }
        yx.resUtil.LoadSpriteByType(info.Icon,yx.ResType.DANLU,this.lianLuSp);
    },
});
yx.LianLuItem = module.exports = LianLuItem;