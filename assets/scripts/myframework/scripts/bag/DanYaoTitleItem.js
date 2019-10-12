let _prefabPath = "prefabs/widgets/DanYaoTitleItem";

let DanYaoTitleItem = cc.Class({
    extends: cc.Component,

    properties: {
        btn:cc.Button,
        nameLabel:cc.Label,
        itemLayout:cc.Layout,
    },
    statics: {
        CreateItem(info, parent, name,cb){
            //异步加载，保持顺序
            //先占坑
            let slotNode = new cc.Node(name);
            slotNode.setAnchorPoint(0.5,1);
            parent.addChild(slotNode);

            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                if (!err)
                {
                    let go = cc.instantiate(prefab);
                    if (name != null) {go.name = name;}
                    let itemSrc = go.getComponent(DanYaoTitleItem);
                    if (itemSrc)
                    {
                        slotNode.addChild(go);
                        itemSrc.init(info,cb);

                        //重新挂载node大小 为子的大小
                        //slotNode.setContentSize(go.getContentSize());
                    }
                    else
                    {
                        cc.warn("DanYaoTitleItem instantiate error!");
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

    init(info,cb){
        this._info = info;

        this.btn.node.on('click',this.itemBtnClick,this);

        this.nameLabel.string = info.title;

        for (let i = 0; i < info.items.length; i ++){
            yx.DanYaoNumItem.CreateItem(info.items[i],this.itemLayout.node,"DanYaoNumItem"+i);
        }

        //默认扩展框隐藏
        this.itemLayout.node.active = false;
        this._setContentSize();
    },

    //重新根据内容设置大小
    _setContentSize(){
        this.node.setContentSize(this._calcuContentSize());
        this.node.parent.setContentSize(this.node.getContentSize());
    },
    _calcuContentSize(){
        //这里的大小需要手动计算，而不能直接为itemLayout的大小。因为itemLayout也是异步的，这时候大小还没布局完成。  (自身高度+往下扩展高度) 加上上下距离20
        let width = this.node.getContentSize().width;
        let originHeight = this.btn.node.getContentSize().height;//原始高度
        let exHeight = 0;

        //扩展框可见的时候，才计算扩展大小
        if (this.itemLayout.node.active){
            exHeight = Math.ceil(this._info.items.length/2)*40;
        }
        //只有在扩展框有大小的情况下，才需要另加20的 上下调整距离
        exHeight = exHeight > 0? (exHeight+20):0;

        return cc.size(width,originHeight + exHeight);
    },

    itemBtnClick(){
        //将其他的‘扩展’ 收起来
        let titleItemLayoutNode = this.node.parent.parent;
        let danYaoTitleItemSrcs = titleItemLayoutNode.getComponentsInChildren(DanYaoTitleItem);
        for (let i in danYaoTitleItemSrcs){
            if (danYaoTitleItemSrcs[i] !== this){
                danYaoTitleItemSrcs[i].itemLayout.node.active = false;
                danYaoTitleItemSrcs[i]._setContentSize();
            }
        }

        //将自己的‘扩展’ 展开或收起
        this.itemLayout.node.active = !this.itemLayout.node.active;

        this._setContentSize();
    }
});

yx.DanYaoTitleItem = module.exports = DanYaoTitleItem;