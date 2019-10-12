//require('./framework/FrameWork')

let _LianZhiItemPrefabPath = "prefabs/widgets/LianZhiItem";//
const SHOW_TYPE = {
    BAR:1,//条形金丹
    TUJIAN:2,//方形图鉴
}

let LianZhiItem = cc.Class({
    extends: cc.Component,

    properties: {
        contentLabel:cc.Label,
        barLayout:cc.Layout,
        tuJianLayout:cc.Layout,
    },

    statics: {
        SHOW_TYPE:SHOW_TYPE,

        _itemPrefab:    null,

        CreateItem(info, parent, name,cb,isHIde){

            LianZhiItem._itemPrefab = null;//强制使用动态加载
            if (LianZhiItem._itemPrefab){
                return LianZhiItem._createItemWithPrefab(info, parent, name,LianZhiItem._itemPrefab,cb,isHIde);
            }else{
                cc.loader.loadRes(_LianZhiItemPrefabPath, function (err, prefab) {
                    cc.log("[丹方item 动态加载");
                    if (!err)
                    {
                        LianZhiItem._itemPrefab = prefab;
                        return LianZhiItem._createItemWithPrefab(info, parent, name,LianZhiItem._itemPrefab,cb,isHIde);
                    }
                    else
                    {
                        cc.warn(_LianZhiItemPrefabPath + " is not exist!");
                    }
                });
            }

        },
        _createItemWithPrefab:function (info,parent, name,prefab,cb,isHIde) {
            if (info != null)
            {
                cc.log("[丹方item CreateItem] info:" + info);
            }
            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);
            slotNode.setAnchorPoint(0.5,1);
            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(LianZhiItem);

            if (itemSrc)
            {
                slotNode.addChild(go);
                itemSrc.init(info,cb,isHIde);
                slotNode.setContentSize(go.getContentSize());
                //slotNode.setContentSize(cc.size(582,144));
            }
            else
            {
                cc.warn("LianZhiItem instantiate error!");
            }
            return itemSrc;
        }

    },

    init(info,cb,isHIde){

        this.contentLabel.string = info.title;

        switch (info.showType) {
            case SHOW_TYPE.BAR:{
                for (let i = 0; i < info.items.length; i ++){

                    //勾上隐藏按钮以后，隐藏材料不足的
                    if (isHIde && info.items[i].num <= 0){
                        continue;
                    }
                    //勾上隐藏按钮以后，隐藏丹方已经吃满的
                    if (isHIde && info.items[i].isEatFull){
                        continue;
                    }


                    yx.LianZhiSelectItem.CreateItem(info.items[i],this.barLayout.node,"LianZhiSelectItem"+i,cb);
                    //cc.log("++++",this.barLayout.node.width,this.barLayout.node.height);
                    //添加了元素之后，为何barLayout.node的大小不会立刻变。猜测会在之后进行适配。重设大小。
                }
                //为当前节点设置大小，因为需要layout布局
                this.node.setContentSize(cc.size(this.node.getContentSize().width,this.node.getContentSize().height+Math.ceil(info.items.length/2)*50));

                break;
            }
            case SHOW_TYPE.TUJIAN:{
                for (let i = 0; i < info.items.length; i ++){
                    yx.TuJianItemWidget.CreateItem(info.items[i],this.tuJianLayout.node,"TuJianSelectItem"+i,cb);
                }
                //为当前节点设置大小，因为需要layout布局
                this.node.setContentSize(cc.size(this.node.getContentSize().width,this.node.getContentSize().height+Math.ceil(info.items.length/4)*140));

                break;
            }
        }
       },

    // update (dt) {},
});

yx.LianZhiItem = module.exports = LianZhiItem;