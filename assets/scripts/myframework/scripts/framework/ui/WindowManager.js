//----------------------------------------------------------------------------------------------------------------------

const BaseWindow = require('BaseWindow');
const windowInfo = require("WindowInfoDict");

//----------------------------------------------------------------------------------------------------------------------
//const WindowType = BaseWindow.Type;
const typeNodeNameArray = ["WindowRoot", "PanelRoot", "PopUp"];

//----------------------------------------------------------------------------------------------------------------------

/**
 *
 * @class WindowManager
 * @extends 
 */
yx.WindowManager = function () {
    /**
     * @type {Array<String>} _windowStack;
     */
    this._windowStack = null;
    this._regMap = null;
    this._uiRootNode = null;
    this._typeNode = null;
    /**
     * @type {Map<String, BaseWindow>} _windowMap
     */
    this._windowMap = null;
};

yx.WindowManager.prototype = {
    constructor: yx.WindowManager,
    init: function () {

        /**
         * @type {Array<String>} _windowStack
         */
        this._windowStack = new Array();
        //this._regMap = new Map();
        /**
         * @type {Map<string, BaseWindow>} _windowMap
         */
        this._windowMap = new Map();
        this._subRootNode = new Array();

        this._resetRootNode();
        
        //TODO:可以在此插入分配率适配代码

        cc.log("WindowManager init");
        return true;
    },

    _getRootNode(){
        if (this._uiRootNode == null)
        {
            this._resetRootNode();
        }

        return this._uiRootNode;
    },

    _getSubRootNode(windowType){
        if (windowType < 0 || windowType >= this._subRootNode.length)
        {
            return null;
        }

        return this._subRootNode[windowType];
    },

    _resetSubRootNode(){
        if (this._subRootNode == null)
        {
            this._subRootNode = new Array();
        }

        let uiRootNode = this._getRootNode();

        for (let i = 0; i < typeNodeNameArray.length; i++)
        {
            let nodeName = typeNodeNameArray[i];

            let node = uiRootNode.getChildByName(nodeName);

            if (node == null)
            {
                node = new cc.Node(nodeName);
                uiRootNode.addChild(node);
            }
            else
            {
                node.destroyAllChildren();
                //node.removeAllChildren(true);
            }

            this._subRootNode[i] = node;    
        }
    },

    _resetRootNode: function(){        
        this._uiRootNode = cc.Canvas.instance.node.getChildByName("UIRoot");        

        if (this._uiRootNode == null)
        {
            this._uiRootNode = new cc.Node("UIRoot");
            cc.Canvas.instance.node.addChild(this._uiRootNode);
        }

        this._resetSubRootNode();
    },

    /**
     * !#zh 显示窗口
     * @method showWindow
     * @param {string} name
     * @deprecated name必须是之前用regWindow注册过的名称
     */
    showWindow: function(name, args)
    {
        if (!this._hasWindowInfo(name))
        {
            cc.warn("there is not have window info in dict:" + name);
            return;
        }

        let windowSrc = this._windowMap.get(name);

        if (windowSrc)
        {
            //如果已经显示直接返回
            if (windowSrc.isShown())
            {
                return;
            }

            if (this._windowStack[this._windowStack.length - 1] != name)
            {                
                this._windowStack.push(name);
                cc.log("windowstack push:" + name + " len:" + this._windowStack.length);
            }
            
            windowSrc.show(args);

            this._hideAllOtherWindow();
        }
        else
        {
            var self = this;

            if (this._windowStack[this._windowStack.length - 1] == name)
            {
                return;
            }

            this._createWindow(name, args, function(newWindowSrc){
                cc.log("create window complete:" + name);
                if (newWindowSrc != null)
                {        
                    // //开新窗口时隐藏当前窗口
                    // if (newWindowSrc.windowType == BaseWindow.Type.WINDOW)
                    // {
                    //     self._hideCurWindow();
                    // }  
                    
                    self._windowMap.set(name, newWindowSrc);

                    newWindowSrc.show(args);

                    self._hideAllOtherWindow();
                }
            });

            self._windowStack.push(name);
            cc.log("windowstack push:" + name + " len:" + self._windowStack.length);
        }
    },

    // //隐藏正在显示的窗口
    // _hideCurWindow(){
    //     this.hideWindow(this._windowStack[this._windowStack.length - 1]);
    // },

    //隐藏除当前窗口外的所有窗口
    _hideAllOtherWindow(){
        if (this._windowStack.length <= 1)
        {
            //cc.warn("[WindowManager _hideAllOtherWindow]this is the last window");
            return;
        }

        let topWindow = null;

        for (let i = this._windowStack.length - 1; i >= 0; i--)
        {
            if (topWindow == null)
            {
                let windowSrc = this._windowMap.get(this._windowStack[i]);

                if (windowSrc && windowSrc.windowType == BaseWindow.Type.WINDOW)
                {
                    topWindow = windowSrc;                   
                }

                continue;
            }
           
            this.hideWindow(this._windowStack[i]);
        }
    },

    hideWindow(name){
        let windowSrc = this._windowMap.get(name);

        if (windowSrc && windowSrc.isShown())
        {
            windowSrc.hide();

            //TODO: if not in unrelease destory window 
            if (windowSrc.windowType != BaseWindow.Type.WINDOW)
            {
                //windowSrc.node.removeFromParent(true);
                windowSrc.node.destroy();
                this._windowMap.delete(name);
            }
        }
    },

    //获取当前的window组件 ，不包含 pannel
    getCurWindow(){
        for (let i = this._windowStack.length - 1; i >= 0; i --){
            let windowName = this._windowStack[i];
            let windowSrc = this._windowMap.get(windowName);
            if (windowSrc && windowSrc.windowType == BaseWindow.Type.WINDOW){
                cc.log("getCurWindow:"+windowName);
                return windowSrc.node;
            }
        }
    },

    //获取当前的window组件
    getCurWindowOrPanel(){
        for (let i = this._windowStack.length - 1; i >= 0; i --){
            let windowName = this._windowStack[i];
            let windowSrc = this._windowMap.get(windowName);
            if (windowSrc ){
                cc.log("getCurWindowOrPanel:"+windowName);
                return windowSrc.node;
            }
        }
    },


    /**
     * 返回上一个窗口
     */
    goBack(){
        if (this._windowStack.length <= 1)
        {
            cc.warn("[WindowManager goBack]this is the last window");
            return;
        }

        
        let curName = this._windowStack.pop();
        cc.log("windowstack pop:" + curName + " len:" + this._windowStack.length);

        let preName = this._windowStack[this._windowStack.length - 1];

        this.hideWindow(curName);
        this.showWindow(preName); 
    },

    /**
     * 关闭指定的窗口
     * @param {String} name 要关闭的窗口名称
     */
    closeWindow(window)
    {
        if (this._windowStack.length <= 1)
        {
            cc.warn("[WindowManager closeWindow]this is the last window");
            return;
        }

        let windowName = "";

        if (window instanceof BaseWindow)
        {
            windowName = window.name;
        }
        else if(window instanceof String)
        {
            windowName = window;
        }
        else
        {
            cc.error("WindowManager closeWindow errorType 只能传BaseWindow 或者 String");
            return;
        }

        //要关闭的窗口在最上层，直接调goback
        if (windowName == this._windowStack[this._windowStack.length - 1])
        {
            this.goBack();
        }
        else
        {
            let findIndex = this._windowStack.findIndex(elem => {
                return elem == windowName;
            });

            if (findIndex >= 0)
            {                
                this.hideWindow(windowName);
                this._windowStack.splice(findIndex, 1);
            }            
        }
    },

    _hasWindowInfo(name){
        return windowInfo[name] != null;
    },

    _createWindow(name, args, callback){
        var self = this;

        let info = windowInfo[name];

        if (!info || !info.name || info.prefab == undefined || info.type == undefined)
        {
            cc.error("windowinfo error:" + info);
            return;    
        }

        info.args = args;

        cc.loader.loadRes(info.prefab, function (err, prefab) {
            if (!err) 
            {
                let window = cc.instantiate(prefab);

                let windowSrc = window.getComponent(BaseWindow);

                if (window) 
                {
                    self._getSubRootNode(info.type).addChild(window);

                    if (windowSrc) 
                    {
                        windowSrc.init(info);
                        //创建成功                       

                        callback(windowSrc);
                    } 
                    else 
                    {
                        cc.warn("window:" + info.name + " is not have scripts on it");
                    }
                } 
                else 
                {
                    cc.warn(info.prefab + " instantiate error!");
                }
            } 
            else                       
            {
                cc.warn(info.prefab + " is not exist!");                     
            }
        });
    },

    //
    getPopUpNode(){
      return this._getSubRootNode(BaseWindow.Type.POPUP);
    },


};

/**
 * @module yx
 */

/**
 * !#en WindowManager
 * !#zh 窗口管理类。
 * @property windowMgr
 * @type {WindowManager}
 */
yx.windowMgr = new yx.WindowManager();

module.exports = yx.windowMgr;