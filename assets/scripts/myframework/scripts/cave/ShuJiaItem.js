
let _ShuJiaItemPrefabPath = "prefabs/widgets/ShuJiaItem";

let ShuJiaItem = cc.Class({
    extends: cc.Component,

    properties: {
        shuItemLayout:cc.Layout//书籍布局
    },

    statics: {
        _itemPrefab:    null,

        CreateItem(info, parent, name,cb){

            //ShuJiaItem._itemPrefab = null;//强制使用动态加载

            if (ShuJiaItem._itemPrefab){
                return ShuJiaItem._createItemWithPrefab(info, parent, name,ShuJiaItem._itemPrefab,cb);
            }else{
                cc.loader.loadRes(_ShuJiaItemPrefabPath, function (err, prefab) {
                    //cc.log("[item 动态加载");
                    if (!err)
                    {
                        ShuJiaItem._itemPrefab = prefab;
                        return ShuJiaItem._createItemWithPrefab(info, parent, name,ShuJiaItem._itemPrefab,cb);
                    }
                    else
                    {
                        cc.warn(_ShuJiaItemPrefabPath + " is not exist!");
                    }
                });
            }

        },
        _createItemWithPrefab:function (info,parent, name,prefab,cb) {

            if (info != null)
            {
               // cc.log("[ShuJiaItem CreateItem] info:" + info);
            }

            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(ShuJiaItem);

            if (itemSrc)
            {
                itemSrc.init(info,cb);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("ShuJiaItem instantiate error!");
            }
            return itemSrc;
        }

    },
    init(info,cb){

        this._info = info;
        this._cb = cb;

        for (let i = 0; i < this._info.length; i ++){
            let infoItem = this._info[i];
            yx.ShuItem.CreateItem(infoItem,this.shuItemLayout.node,"ShuItem"+i,null);
        }
    },


});

yx.ShuJiaItem = module.exports = ShuJiaItem;