const BaseWindow = require('BaseWindow');

let TextConfirm = cc.Class({
    extends: BaseWindow,

    properties: {              
        cancelBtn:          cc.Button,
        confirmBtn:         cc.Button,
        closeBtn:           cc.Button,

        //mucaiLabel:     cc.Label,
        //yuntieLabel:    cc.Label,
        contentRichText:    cc.RichText,

        _confirmCallback:   Function,
        _cancelCallback:    Function,
        _closeCallback:     Function,
    },

    statics: {
        ShowConfirm(content, confirmCb, cancelCb, colseCb){
            let args = {};
            args.content = content;
            args.confirmCallback = confirmCb;
            args.cancelCallback = cancelCb;
            args.closeCallback = colseCb;

            yx.windowMgr.showWindow("textConfirm", args);
        },
    },

    _onInit(args){
        this.cancelBtn.node.on('click', this.onCancelBtnClick, this);
        this.confirmBtn.node.on('click', this.onConfirmBtnClick, this);
        this.closeBtn.node.on('click', this.onCloseBtnClick, this);      
        
        this.contentRichText.string = args.content;
        
        this._confirmCallback = args.confirmCallback;
        this._cancelCallback = args.cancelCallback;
        this._closeCallback = args.closeCallback;        
    },
   

    onCancelBtnClick(){
        yx.windowMgr.goBack();

        if (this._cancelCallback)
        {
            this._cancelCallback();
        }
    },

    onConfirmBtnClick(){
        //goback必须放前面。当_confirmCallback 是打开一个window的时候，在winstack里push了新的window；然后这里执行goback就会把新的window移除了；
        yx.windowMgr.goBack();

        if (this._confirmCallback)
        {
            this._confirmCallback.emit([]);
        }


    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();

        if (this._closeCallback)
        {
            this._closeCallback();
        }
    },
   
});

yx.TextConfirm = module.exports = TextConfirm;