let _ShuItemPrefabPath = "prefabs/widgets/ShuItem";

let ShuItem = cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel: cc.Label,//书名
        otherLabel: cc.Label,//书其他信息
        proficiencyLabel: cc.Label,//熟练信息
        itemBtn: cc.Button,//
    },

    statics: {
        _itemPrefab: null,

        CreateItem(info, parent, name, cb) {

            //ShuItem._itemPrefab = null;//强制使用动态加载

            if (ShuItem._itemPrefab) {
                return ShuItem._createItemWithPrefab(info, parent, name, ShuItem._itemPrefab, cb);
            } else {
                cc.loader.loadRes(_ShuItemPrefabPath, function (err, prefab) {
                    //cc.log("[item 动态加载");
                    if (!err) {
                        ShuItem._itemPrefab = prefab;
                        return ShuItem._createItemWithPrefab(info, parent, name, ShuItem._itemPrefab, cb);
                    } else {
                        cc.warn(_ShuItemPrefabPath + " is not exist!");
                    }
                });
            }

        },
        _createItemWithPrefab: function (info, parent, name, prefab, cb) {

            if (info != null) {
                //cc.log("[ShuItem CreateItem] info:" + info);
            }

            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null) {
                go.name = name;
            }

            let itemSrc = go.getComponent(ShuItem);

            if (itemSrc) {
                itemSrc.init(info, cb);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            } else {
                cc.warn("ShuItem instantiate error!");
            }
            return itemSrc;
        }

    },
    /**
     *
     * @param info 对应于 WuDaoBookConfig 的对象
     * @param cb
     */
    init(info, cb) {

        this._info = info;
        this._cb = cb;

        this.itemBtn.node.on("click", this._onItemBtnClick, this);

        //书名
        this.nameLabel.string = info["Name"];

        /* let curBook = yx.caveMgr.getCurReadingBook();
         if (curBook){
             //熟练
             let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig",{Level:curBook["level"]});
             if (wuDaoProficiencyCfg){
                 this.otherLabel.string = wuDaoProficiencyCfg["Name"];
             }
         }*/

        //熟练
        this.proficiencyLabel.string = "";
        let allBook = yx.caveMgr.getAllBook();
        //在书籍中，找到此书
        if (allBook && allBook.items[this._info.ID]) {
            //融汇贯通
            if (allBook.items[this._info.ID]["level"] >= 5){
                this.proficiencyLabel.string = "完全领会";
                this.proficiencyLabel.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextWhite);
                return;
            }

            let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig", {Level: allBook.items[this._info.ID]["level"]});
            if (wuDaoProficiencyCfg) {
                this.otherLabel.string = wuDaoProficiencyCfg["Name"];
                if (allBook.items[this._info.ID]["readNum"] >= wuDaoProficiencyCfg["CanWuNum"]) {
                    this.proficiencyLabel.string = "可领悟";
                    this.proficiencyLabel.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextGreen);
                }else{
                    //此书正是当前正在读的书
                    let readingBook = yx.caveMgr.getCurReadingBook();
                    if (readingBook && readingBook.id == this._info.ID){
                        this.proficiencyLabel.string = "参悟中";
                        this.proficiencyLabel.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextBlueLigth);
                        return;
                    }

                    this.proficiencyLabel.string = allBook.items[this._info.ID]["readNum"]+"/"+wuDaoProficiencyCfg["CanWuNum"];
                    this.proficiencyLabel.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextWhite);
                }
            }
        }
    },

    _onItemBtnClick() {
        cc.log("_onItemBtnClick");
        yx.windowMgr.showWindow("shuPanel", this._info);
    },


});

yx.ShuItem = module.exports = ShuItem;