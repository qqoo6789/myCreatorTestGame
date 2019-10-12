const BaseWindow = require('BaseWindow');

const _PinJieShuoXie = ["一阶", "二阶", "三阶", "四阶", "五阶", "六阶", "七阶", "八阶", "九阶", 
"仙一", "仙二", "仙三", "仙四", "仙五", "仙六", "仙七", "仙八", "仙九"];

cc.Class({
    extends: BaseWindow,

    properties: { 
        maskBtn:            cc.Button,
        closeBtn:           cc.Button,
        sellBtn:            cc.Button,

        toggleParent:       cc.Node,
        sellNumLabel:       cc.Label,
    },

    _onInit(){     
        this.maskBtn.node.on('click', this.onCloseBtnClick, this);    
        this.closeBtn.node.on('click', this.onCloseBtnClick, this); 
        this.sellBtn.node.on('click', this.onSellBtnClick, this);

        //this.checkBtnTC.checkEvents.length = 0;           
        //this.checkBtnTC.checkEvents.push(yx.CodeHelper.NewClickEvent(this, "onCheckBtnsClick"));
  
        this._initCheckBtns();
    },

    _onShow(){
        this._refresh();
    },

    _initCheckBtns(){
        this._toggleList = new Array();

        for (let index = 0; index < this.toggleParent.children.length; index++)
        {
            let toggle = this.toggleParent.children[index].getComponent(cc.Toggle);    
            
            if (!toggle)
            {
                continue;
            }

            let textLabel = toggle.getComponentInChildren(cc.Label);

            if (textLabel)
            {
                textLabel.string = _PinJieShuoXie[index];
            }

            toggle.uncheck();

            toggle.node.on('click', this.onCheckBtnsClick, this);

            this._toggleList.push(toggle);
        }
    },


    _refresh(){
       
    },

    onCheckBtnsClick(){
        this._selected = new Array();

        for (let index = 0; index < this._toggleList.length; index++)
        {
            let toggle = this._toggleList[index];  
       
            if (toggle.isChecked)
            {
                this._selected.push(index + 1);
            }
        }

        let selectedCount = yx.bagMgr.getItemNumByPinZhi(this._selected, yx.ItemType.EQUIP);

        this.sellNumLabel.string = selectedCount;
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    onSellBtnClick(){
        cc.log("[OneKeySellPanel onUseBtnClick]");
        //yx.bagMgr.reqSellItem(this._itemMsg.id, this._itemMsg.itemId, this.numberWidget.curNum);

        yx.bagMgr.reqSellOneKey(this._selected);
        yx.windowMgr.goBack();
    },
});