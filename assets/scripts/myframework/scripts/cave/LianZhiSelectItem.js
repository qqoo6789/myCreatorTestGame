
let _prefabPath = "prefabs/widgets/LianZhiSelectItem";//


let LianZhiSelectItem = cc.Class({
    extends: cc.Component,

    properties: {
        contentRichText:cc.RichText,
        danItemBtn:cc.Button,
    },

    statics: {
        _itemPrefab:    null,

        CreateItem(info, parent, name,cb){

            if (LianZhiSelectItem._itemPrefab){
                return LianZhiSelectItem._createItemWithPrefab(info, parent, name,LianZhiSelectItem._itemPrefab,cb);
            }else{
                cc.loader.loadRes(_prefabPath, function (err, prefab) {
                    cc.log("[丹方item 动态加载");
                    if (!err)
                    {
                        LianZhiSelectItem._itemPrefab = prefab;
                        return LianZhiSelectItem._createItemWithPrefab(info, parent, name,LianZhiSelectItem._itemPrefab,cb);
                    }
                    else
                    {
                        cc.warn(_prefabPath + " is not exist!");
                    }
                });
            }

        },
        _createItemWithPrefab:function (info,parent, name,prefab,cb) {
            if (info != null)
            {
                cc.log("[丹方LianZhiSelectItem CreateItem] info:" + info);
            }
            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null)
            {
                go.name = name;
            }

            let itemSrc = go.getComponent(LianZhiSelectItem);

            if (itemSrc)
            {
                itemSrc.init(info,cb);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            }
            else
            {
                cc.warn("LianZhiSelectItem instantiate error!");
            }
            return itemSrc;
        }

    },

    init(info,cb){
        this._info = info;
        this._cb = cb;


        this.contentRichText.string = this._getContentStr(info["showNum"],info.name,info.num);
        this.danItemBtn.node.on('click', this._onDanItemBtnClick, this);
    },
    _getContentStr(isShowNum,name,num){
        if (isShowNum){
            let left = yx.colorUtil.AddColorString(name+"(",yx.colorUtil.TextBlueLigth);
            let center = yx.colorUtil.AddColorString(num+"",yx.colorUtil.TextGreen);
            let right = yx.colorUtil.AddColorString(")",yx.colorUtil.TextBlueLigth);
            return left+center+right;
        }

        return yx.colorUtil.AddColorString(name,yx.colorUtil.TextBlueLigth);

    },

    _onDanItemBtnClick(){
        cc.log("_onDanItemBtnClick");
        if (this._cb){
            this._cb(this._info);
        }
    }
});

yx.LianZhiSelectItem = module.exports = LianZhiSelectItem;