/**
 * 离线收益面板
 */
const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn:               cc.Button,
        maskBtn:                cc.Button,

        xiulianAddLabel:        cc.Label,
        lingqiAddLabel:         cc.Label,

        weiwangAddLabel:        cc.Label,
        zhengqiAddLabel:        cc.Label,
        xieqiAddLabel:          cc.Label,
        gongxianAddLabel:       cc.Label,

        lingshiAddLabel:        cc.Label,
        shiwuAddLabel:          cc.Label,
        yuntieAddLabel:         cc.Label,
        mucaiAddLabel:          cc.Label,       
    },

    _onInit(){
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    
        this.maskBtn.node.on('click', this.onCloseBtnClick, this);    
    },

    _onShow(){
        this._refresh();

        yx.playerMgr.clearLiXian();
    },

    _refresh(){
        let lixianInfo = yx.playerMgr.getLiXian();

        this.xiulianAddLabel.string = lixianInfo[yx.CyType.XIUWEI] || 0;
        this.lingqiAddLabel.string = lixianInfo[yx.CyType.LINGQI] || 0;

        this.weiwangAddLabel.string = lixianInfo[yx.CyType.WEIWANG] || 0;
        this.zhengqiAddLabel.string = lixianInfo[yx.CyType.ZHENGQI] || 0;
        this.xieqiAddLabel.string = lixianInfo[yx.CyType.XIEQI] || 0;
        this.gongxianAddLabel.string = lixianInfo[yx.CyType.GONGXIAN] || 0;

        this.lingshiAddLabel.string = lixianInfo[yx.CyType.LINGSHI] || 0;
        this.shiwuAddLabel.string = lixianInfo[yx.CyType.SHIWU] || 0;
        this.yuntieAddLabel.string = lixianInfo[yx.CyType.YUNTIE] || 0;
        this.mucaiAddLabel.string = lixianInfo[yx.CyType.MUCAI] || 0;
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
     },
});