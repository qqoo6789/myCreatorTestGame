const BaseWindow = require('BaseWindow');
const MenPaiShouYeScrollItem = require("MenPaiShouYeScrollItem");

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        scrollContent:            cc.Node,
        menPaiShouYeScrollItemPrefab:   cc.Prefab,
        maskSp:                   cc.Button,
    },

    _onInit(args) {
        yx.eventDispatch.addListener(yx.EventType.MENPAI_SKILL_REFRESH, this.onReFreshSkill, this);

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);

        this._itemList = {};
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

    onMaskSpClick(){
        yx.windowMgr.goBack();
    },

    _refresh(){
        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        let gongfaList = menpaiConfig.GongFa;
    
        this._itemList = new Array();
        let self = this;
        self.scrollContent.removeAllChildren(true);
        gongfaList.forEach(data => {
            let scrollItem = cc.instantiate(self.menPaiShouYeScrollItemPrefab);
            let itemSrc = scrollItem.getComponent(MenPaiShouYeScrollItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.scrollContent.addChild(scrollItem);
                self._itemList.push(itemSrc);
            }
        });
    },

    onReFreshSkill()
    {
        for (let item of this._itemList)
        {
            item.onReFreshSkill();
        }
    },

});
