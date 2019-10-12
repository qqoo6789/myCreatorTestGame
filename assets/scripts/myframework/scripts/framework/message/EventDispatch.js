/**
 * A simple event dispatcher that support to remove specific listener as opposed to cc.eventManager
 *  简单的事件系统，维护事件的注册，移除，响应 
 * //TODO:靠定时器响应，有缺陷，待改进
 */



//----------------------------------------------------------------------------------------------------------------------

/**
 * 事件监听器
 * @param {any} target 
 * @param {function} callback 
 * @param {boolean} [once=false]
 */
let EventListener = function(msgName, target, callback, once){
    this.msgName = msgName;
    this.target = target;
    this.callback = callback;
    this.once = once;
};


/**
 *
 * @class EventDispatch
 * @extends 
 */
let EventDispatch = function () {
    /**
     * 消息监听队列
     * @type {Map<String, Array<EventListener>>} _msg2listDict
     */
    this._msg2listDict = null;
    /**
     * 准备移除队列
     * @type {Array<EventListener>}
     */
    this._removeList = null;
    /**
     * 发送队列
     * @type {Array<{msgName, data}>}
     */
    this._dispatchList = null;

    this.init();
};

EventDispatch.prototype = {
    constructor: yx.EventDispatch,
    //EventType:EventType,
   
    init() {  
        this._msg2listDict = new Map();
        //this._addList = new Array();   
        this._removeList = new Array();   
        this._dispatchList = new Array();

        cc.log("EventDispatch init");
        return true;
    },

    /**
     * 添加多次监听者，需要手动移除
     * @param {String} msgName 消息名
     * @param {function} callback
     * @param {any} target
     */
    addListener(msgName, callback, target){
        let listener = new EventListener(msgName, target, callback, false);

        this._add(msgName, listener);
    },

    /**
     * 添加单次监听者，事件触发后即移除
     * @param {String}msgName
     * @param {function}listener
     * @param {any}target
     */
    addOnceListener: function(msgName, callback, target){
        let listener = new EventListener(msgName, target, callback, true);

        this._add(msgName, listener);
    },

    _getListenerByTarget(target){
        let list = new Array();

        if (!target)
        {
            return null;
        }

        for (let _listenerList of this._msg2listDict.values())
        {
            for (var i in _listenerList) 
            {
                if (_listenerList[i].target == target)
                {
                    list.push(_listenerList[i]);
                }
            }
        }

        return list;
    },

    /**
     * 添加监听
     * @param {String} msgName 
     * @param {EventListener} listener 
     */
    _add(msgName, listener){
        if (!msgName || !listener || !listener.target || !listener.callback) {
            cc.error("[EventDispatch] regMsgCallBack msgName or callback is null");
            return;
        }

        // //如果正在分发消息，就先添加到队伍中等待
        // if (this._dispatchList.length > 0)
        // {
        //     this._addList.push(listener);
        //     return;
        // }
     
        //添加时直接添加到注册字典里
        var _listenerList = this._msg2listDict.get(msgName);
        if (!_listenerList)
        {
            _listenerList = new Array();

            this._msg2listDict.set(msgName, _listenerList);
        }

        for (var i in _listenerList) 
        {
            if (_listenerList[i].callback == listener.callback)
            {
                //已经添加过了
                cc.warn("[EventDispatch add] callback is added:" + listener.callback.toString());
                return;
            }
        }

        _listenerList.push(listener);
        cc.log("[EventDispatch add] add succ, msgName=" + msgName + ", listener:" + listener.callback.name);
        //return callback;
    },

    removeMsgListener(msgName, callback, target){
        let listener = new EventListener(target, callback, false);

        this._remove(msgName, listener);
    },

    removeListenersByTarget(target){
        if (!target) {
            cc.error("[EventDispatch removeListenersByTarget] target is null");
            return;
        }

        let list = this._getListenerByTarget(target);

        if (!list)
        {
            return;
        }

        for (let i = 0; i < list.length; i++)
        {
            this._remove(list[i].msgName, list[i]);
        }

        cc.log("[EventDispatch removeListenersByTarget] " + target.name + " remove listener count:" + list.length);
    },

    // removeMsgAllListeners(msgName){

    // },

    // removeTargetMsgListen(msgName, target){

    // },

    // removeTargetAllMsgListen(target){

    // },

    /**
     * 移除监听
     * @param {String} msgName 
     * @param {EventListener} listener 
     */
    _remove(msgName, listener){
        if (!msgName || !listener || !listener.target || !listener.callback) {
            cc.error("[EventDispatch] removeMsgCallBack msgName or callback is null");
            return;
        }

        if (this._isDispatching(msgName))
        {
            this._removeList.push(listener);
            return;
        }
    
        var _listenerList = this._msg2listDict.get(msgName);
        if (!_listenerList || _listenerList.length < 1) {
            return;
        }
        var lastIndex = _listenerList.length - 1;
        for (var i = lastIndex; i >= 0; i--) {
            if (_listenerList[i].callback == listener.callback) {
                _listenerList.splice(i, 1);
                cc.log("[EventDispatch remove] removeMsgCallBack, msgName=" + msgName + ", listener:" + listener.callback.name);
                return;
            }
        }
    },

    /**
     * 分发消息
     * @param {String} msgName 消息名
     * @param {any} data 数据
     */
    dispatchMsg(msgName, data){
        if (!msgName)//msgData数据可以为空
        return;

        //
        let list = this._msg2listDict.get(msgName);
        if (!list) {
            return;
        }

        //1.先检查 如果list中的某一条在remove队列中，就不要派发给他

        //2.发送 先添加到一个发送队列中 push操作 如果队列长度大于1就return，
        
        let newMsg = {msgName: msgName, data:data};

        this._dispatchList.push(newMsg);

        if (this._dispatchList.length > 1)
        {
            //表示同时只处理一条消息，多了容易乱
            return;
        }

        this._handleDispatch();

        this._handleRemove();
    },

    _handleRemove(){
        for (var i = this._removeList.length - 1; i >= 0; i--)
        {
            this._remove(this._removeList[i].msgName, this._removeList[i]);
        }
    },

    // _handleAdd(){

    // },

    /**
     * 处理发送消息
     */
    _handleDispatch(){
        while (this._dispatchList.length > 0) 
        {
            let msg = this._dispatchList.pop();

            let list = this._msg2listDict.get(msg.msgName);
            if (!list) {
                return;
            }

            //cc.log(pData.type + ",_listenerList=" + _listenerList.length);
            let dispatchData = msg.data || null;

            for (var i in list) 
            {
                if (list[i].target && list[i].callback)
                {
                    list[i].callback.call(list[i].target, dispatchData);

                    if (list[i].once)
                    {
                        this._removeList.push(list[i]);
                    }
                }
            }    
        }          
    },

    /**
     * 是否正在发送中
     * @param {String} listener 
     */
    _isDispatching(msgName){
        for (let i in this._dispatchList)
        {
            if (this._dispatchList[i].msgName == msgName)
            {
                return true;
            }
        }

        return false;
    }

};

/**
 * @module yx
 */

/**
 * !#en EventDispatch
 * !#zh 事件管理类。
 * @property evtDispatch
 * @type {EventDispatch}
 */

module.exports = yx.eventDispatch = new EventDispatch();