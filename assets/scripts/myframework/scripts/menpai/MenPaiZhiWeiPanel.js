const BaseWindow = require('BaseWindow');
const MenPaiZhiWeiScrollItem = require("MenPaiZhiWeiScrollItem");

cc.Class({
    extends: BaseWindow,

    properties: {

        closeBtn:                 cc.Button,
        scrollContent:            cc.Node,
        menPaiZhiWeiScrollItemPrefab:   cc.Prefab,
        maskSp:                   cc.Button,
        curZhiweiLabel:           cc.Label,
    },

    _onInit(args) {
        yx.eventDispatch.addListener(yx.EventType.MENPAI_ZHIWEI_REFRESH, this.onRefreshZhiWei, this);
        
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.maskSp.node.on('click', this.onMaskSpClick, this);
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
        let zhiweiList = [{ID:yx.MenPaiZhiWeiType.NEIMENDIZI},{ID:yx.MenPaiZhiWeiType.QINCHUANDIZI},{ID:yx.MenPaiZhiWeiType.GONGFENG},{ID:yx.MenPaiZhiWeiType.HUFU}];
        let self = this;
        self.scrollContent.removeAllChildren(true);
        zhiweiList.forEach(data => {
            let scrollItem = cc.instantiate(self.menPaiZhiWeiScrollItemPrefab);
            let itemSrc = scrollItem.getComponent(MenPaiZhiWeiScrollItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.scrollContent.addChild(scrollItem);
            }
        });

        this.onRefreshZhiWei();
    },

    onRefreshZhiWei(){
        let curZhiWu = yx.menPaiMgr.currZhiWei();
        let menPaiPostConfig =  yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":curZhiWu});
        this.curZhiweiLabel.string = menPaiPostConfig.ZhiWuName;
    },

});
