let _prefabPath = "prefabs/widgets/DanYaoNumItem";

let DanYaoNumItem = cc.Class({
    extends: cc.Component,

    properties: {
    },
    statics: {
        CreateItem(info, parent, name){
            //异步加载，保持顺序
            //先占坑
            let slotNode = new cc.Node(name);
            slotNode.setAnchorPoint(0.5,0.5);
            parent.addChild(slotNode);

            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                if (!err)
                {
                    let go = cc.instantiate(prefab);
                    if (name != null) {go.name = name;}
                    let itemSrc = go.getComponent(DanYaoNumItem);
                    if (itemSrc)
                    {
                        slotNode.addChild(go);
                        itemSrc.init(info);

                        //重新挂载node大小 为子的大小
                        slotNode.setContentSize(go.getContentSize());
                    }
                    else
                    {
                        cc.warn("DanYaoNumItem instantiate error!");
                    }
                    return itemSrc;
                }
                else
                {
                    cc.warn(_prefabPath + " is not exist!");
                }
            });

        },

    },
    init(info){

    }
});
yx.DanYaoNumItem = module.exports = DanYaoNumItem;