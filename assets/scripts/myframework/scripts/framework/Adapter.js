// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//const eventDispatch = require("EventDispatch");

/**
 * 设计分辨率比例 高比宽 16:9 720X1280
 */
const DesignRatio = 1.77778;

cc.Class({
    extends: cc.Component,

    properties: {
        _lastSize:  null,
    },

    // LIFE-CYCLE CALLBACKS:

    /**
     * 各大模块的初始化调用可以放在这里
     */
    onLoad () 
    {
        cc.log("[Adapter onload]");

        cc.game.addPersistRootNode(this.node);

        var winSize = this._getWinSize();
        cc.log("onload winsize = ", winSize);

        if (!cc.sys.isNative) {
            let self = this;

            window.onresize = function () {
                //console.log("window onresize");
                self._resizeWindow();
            };
        }

        
    },

    start(){
        cc.log("[Adapter start]");
    },

    onEnable(){
        cc.log("[Adapter onEnable]");
        this._lastSize = null;
        this._resizeWindow();
    },

    onDisable(){
        cc.log("[Adapter onDisable]");
    },

   
    _getWinSize: function () {
        var winSize = null;

        //winSize = cc.director.getWinSizeInPixels();
        winSize = cc.winSize;
        /*
        if(cc.Director.sharedDirector){
            winSize = cc.Director.sharedDirector.getWinSizeInPixels();
        }else{
            winSize = cc.view.getFrameSize();
        }*/
        //cc.log('getWinSize, winSize=' + winSize);
        return winSize;
    },

    /**
     * 根据实际分辨率比例去计算采用适配宽度还是适配高度
     */
    _resizeWindow: function () {
        var _curCanvas = cc.Canvas.instance;
        var winSize = this._getWinSize();

        // _curCanvas.fitWidth = false;
        // _curCanvas.fitHeight = true;
        // return;        

        if (winSize != this._lastSize)
        {
            this._lastSize = winSize;
        }
        else
        {
            return;
        }

        cc.log("before set winsize = ", winSize);

        //获取当前实际分辨率，大于等于用适配宽度，小于用适配高度
        if (_curCanvas != null) {
            if (winSize.height < DesignRatio * winSize.width)//小于 
            {
                cc.log("fit height");
                //_curCanvas.designResolution = new cc.size(_curCanvas.designResolution.width, lastSize.height);
                _curCanvas.fitWidth = false;
                _curCanvas.fitHeight = !_curCanvas.fitWidth;
            }
            else {
                cc.log("fit width");
                //_curCanvas.designResolution = new cc.size(lastSize.width, _curCanvas.designResolution.width.height);
                _curCanvas.fitWidth = true;
                _curCanvas.fitHeight = !_curCanvas.fitWidth;
            }

            winSize = this._getWinSize();

            cc.log("after set winsize = ", winSize);

            //lastSize = winSize;

            //cc.log("curr canvas fitwidth = " + _curCanvas.fitWidth + " fitheight = " + _curCanvas.fitHeight);

            //app模式先不调widget重新对齐，如果有必要再调
            if (!cc.sys.isNative) {
                var container = document.getElementById("Cocos2dGameContainer");
                if (container != null) {
                    container.style.padding = 0;
                }
                this._refreshWidgetEnable();
                this._setCocos2dGameContainer();
                //if (cc.sys.os == cc.sys.OS_ANDROID) {
                // setTimeout(() => {
                //     this._setCocos2dGameContainer();
                // }, 30);
                //}
            }

        }
    },

    /**
     * 修改宽高度适配后需要让所有widgets重新对齐一次
     * 注意canvas节点外面如果有widget要加代码手动处理
     * 所以一般情况下canvas外面不要加显示节点
     */
    _refreshWidgetEnable: function () {
        //cc.log("refreshWidgetEnable");

        var node = cc.Canvas.instance.node;
        var widgets = node.getComponentsInChildren(cc.Widget);

        //cc.log('enableAllWidgets, widgets count =' + widgets.length);
        for (var i = 0; i < widgets.length; i++) {
            widgets[i].enabled = true;
            //widgets[i].updateAlignment();
        }

        //
        //var eventDispatch = require("EventDispatch");
        //eventDispatch.dispatchMsg(eventDispatch.EventType.Win.resize, true);
    },

    _setCocos2dGameContainer: function () {
        var GameCanvas = document.getElementById("GameCanvas");

        if (cc.sys.os == cc.sys.OS_IOS) {
            return;
        }
        GameCanvas.style.position = 'absolute';
        GameCanvas.style.top = "1px";
        GameCanvas.style.left = "0px";
        //cc.log("adjust GameCanvas style.top");
    },

});
