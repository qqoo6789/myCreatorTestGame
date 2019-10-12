const BaseWindow = require('BaseWindow');
const MenPaiSelectScrollItem = require("MenPaiSelectScrollItem");

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        randomJoinBtn:            cc.Button,
        scrollContent:            cc.Node,
        menPaiSelectItemPrefab:   cc.Prefab,

    },

    _onInit(args) {
        cc.log("star=="+args.star)

        this._star = args.star;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.randomJoinBtn.node.on('click', this.onRandomJoinBtnClick, this);
    },
   

    _onShow(){
        this._refresh();
    },

    _onHide(){
    },

    _onDeInit(){

    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onRandomJoinBtnClick(){
        cc.log("随机加入");
        yx.menPaiMgr.Join(this._star);
        yx.windowMgr.goBack();
    },

    _refresh(){
        let menPaiSelectList = yx.menPaiMgr.getMenPaiListByStar(this._star);
     
        let self = this;
        self.scrollContent.removeAllChildren(true);
        menPaiSelectList.forEach(data => {
            let scrollItem = cc.instantiate(self.menPaiSelectItemPrefab);
            let itemSrc = scrollItem.getComponent(MenPaiSelectScrollItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.scrollContent.addChild(scrollItem);
            }
        });
    },

});
