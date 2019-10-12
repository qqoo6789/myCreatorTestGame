const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn: cc.Button,
        confirmBtn: cc.Button,//按钮
        itemLayout: cc.Layout,//
    },

    _onInit(shenYouData) {
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
        this.confirmBtn.node.on('click', this._onConfirmBtnClick, this);

        if (!shenYouData) return;
        this.shenYouData = shenYouData;

        this._toggles = {};
        let childrens = this.itemLayout.node.children;
        //获取Toggles集合，全部设置为 未选中
        for (let c in childrens){
            let level = parseInt(childrens[c].name.split('_')[1]);
            this._toggles[level] = childrens[c].getComponentInChildren(cc.Toggle);
            this._toggles[level].isChecked = false;
        }

        //将对应的设置为 选中
        for (let i in shenYouData.autoSellItem){
            let level = shenYouData.autoSellItem[i];
            this._toggles[level].isChecked = true;
        }
    },
    _onCloseBtnClick() {
        yx.windowMgr.goBack();
    },
    _onConfirmBtnClick() {
        let pinZhis = [];
        for (let level in this._toggles){
            if (this._toggles[level].isChecked){
                pinZhis.push(parseInt(level));
            }
        }

        yx.shenYouMgr.reqSetAutoSell(pinZhis);
        yx.windowMgr.goBack();
    },
});
