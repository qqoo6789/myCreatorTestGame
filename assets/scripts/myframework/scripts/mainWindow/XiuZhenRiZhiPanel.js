/**
 * 修真日志面板
 */
const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn:               cc.Button,
        maskBtn:                cc.Button,

        richText:               cc.RichText,
        pageNumLabel:           cc.Label,
        
        prevBtn:                cc.Button,
        nextBtn:                cc.Button,
    },

    _onInit(){
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);    
        this.maskBtn.node.on('click', this.onCloseBtnClick, this);    

        this.prevBtn.node.on('click', this.onPrevBtnClick, this);  
        this.nextBtn.node.on('click', this.onNextBtnClick, this);  

        this._curPage = 1;
        this._pageTotal = 1;
    },

    _onShow(){
        this._refresh();
    },

    _refresh(){
        //let lixianInfo = yx.playerMgr.getLiXian();

        this.prevBtn.interactable = this._curPage > 1;
        this.nextBtn.interactable = this._curPage < this._pageTotal;

        this.pageNumLabel.string = this._curPage + "/" + this._pageTotal;

        
    },

    _setPage(num)
    {
        if (num < 1 || num > _pageTotal || num == this._curPage)
        {
            return;
        }

        this._curPage = num;

        this._refresh();
    },

    onCloseBtnClick(){
         yx.windowMgr.goBack();
    },

    onPrevBtnClick(){
        if (this._curPage > 1)
        {
            this._curPage 
        }
    },

    onNextBtnClick(){

    },
});