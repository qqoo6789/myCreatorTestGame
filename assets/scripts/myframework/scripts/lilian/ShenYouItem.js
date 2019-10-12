let _prefabPath = "prefabs/widgets/ShenYouItem";

let ShenYouItem = cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel:cc.Label,
        selectBgNode:cc.Node,
        shenYouItemBtn:cc.Button,
    },
    statics:{
        _itemPrefab:    null,
        CreateItemSlot(info, parent, name,itemClickCb){

            if (ShenYouItem._itemPrefab){
                return ShenYouItem.CreateItemSlotByPrefab(info, parent, name,itemClickCb,ShenYouItem._itemPrefab);
            }else {
                cc.loader.loadRes(_prefabPath, function (err, prefab) {
                    if (!err)
                    {
                        ShenYouItem.CreateItemSlotByPrefab(info, parent, name,itemClickCb,prefab);
                    }
                    else
                    {
                        cc.warn(_prefabPath + " is not exist!");
                    }
                });
            }

        },
        CreateItemSlotByPrefab(info, parent, name,itemClickCb,prefab){
            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            let go = cc.instantiate(prefab);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(ShenYouItem);

            if (itemSrc)
            {
                itemSrc.init(info,itemClickCb);

                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("ShenYouItem instantiate error!");
            }
            return itemSrc;
        }
    },
    //LiLianMapConfig
    init(mapCfgItem,itemClickCb){

        this.itemClickCb = itemClickCb;
        this.mapCfgItem = mapCfgItem;
        this.shenYouItemBtn.node.on('click',this.shenYouItemBtnClick,this);
        this.nameLabel.string = mapCfgItem["Name"];
        this.selectBgNode.active = false;

        this._setGray(!(mapCfgItem["ID"] > 0 && mapCfgItem["ID"] <= yx.battleMgr.getLiLianTopMapId()));

    },
    _setGray(is){

        let colorState = is ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL;
        let sps = this.getComponentsInChildren(cc.Sprite);
        for (let i in sps){
            sps[i].setState(colorState);
        }
    },
    shenYouItemBtnClick(){

        if (this.itemClickCb){
            let isReturn = this.itemClickCb(this.mapCfgItem);
            if (isReturn) return;
        }

        //实现单选
        let parent = this.node.parent.parent;
        let components = parent.getComponentsInChildren(ShenYouItem);
        for (let c in components){
            components[c].setSelect(this === components[c]);
        }
    },

    setSelect(is){
        this.selectBgNode.active = is;
    },

    refresh(){
        //
    },

    getMapCfgItem(){
        return this.mapCfgItem;
    },

    getName(){
        return this.mapCfgItem["Name"];
    }

});

yx.ShenYouItem = module.exports = ShenYouItem;