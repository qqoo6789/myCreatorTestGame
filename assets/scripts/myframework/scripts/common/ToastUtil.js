const assert = require("assert");
let _ListToastWidgetPrefabPath = "prefabs/widgets/ListToastWidget";//
let _SimpleToastWidgetPrefabPath = "prefabs/widgets/SimpleToastWidget";//

/**
 * 列表式的移动的提示文字管理
 * 实现：[多次的点击事件，先把产生的节点存到一个队列中，然后定时的从里面取出来放到新的队列中执行的动画，由于可能会参数大量的点击，会产生很多node，所以采取pool]
 * 产生的文字提示node将会挂载在 CurWindowComponent()的node上
 */



let _ListToastUtil = function () {
    //私有属性
    this._preActionList = [];    //待处理行为节点队列 [点击即进此队列]
    this._curActionList = [];    //当前行为节点队列   [从待处理行为队列中 定时的取出来 执行动画]
    this._isOnSchedule = false;     //记录当前调度器是否正在执行
    this._txtTipNodePool = new cc.NodePool();   //当前节点池
};

_ListToastUtil.prototype = {


    /**
     * 由于不同界面需要不同的队列，所以这里使用Map来维护,当存在多个界面同时在进行的时候，可以同时进行；
     * @type {Map<any, any>}
     *
     */
    listToastMap : new Map(),
    _moveTextTipPrefab: null, //预制品 共有属性

    preLoad(){
        cc.loader.loadRes(_ListToastWidgetPrefabPath, function (err, prefab) {
            if (!err) {
                this._moveTextTipPrefab = prefab;
            } else {
                cc.warn(_ListToastWidgetPrefabPath + " is not exist!");
            }
        }.bind(this));
    },

    _reset() {

        //若存在挂载的情况，需要先清理
        if (this._curActionList){
            for (let i = 0; i < this._curActionList.length; i ++){
                this._curActionList[i].removeFromParent(true);
            }
        }

        this._preActionList = [];
        this._curActionList = [];
        this._isOnSchedule = false;
    },

    /**
     * 此方法支持多队列，目前把parentNode参数写死为根节点上的popUpNode。变成简单的单队列
     * @param content
     */
    showToast: function (content) {
        //assert(this._init,"务必先初始化调用_ListToastUtil的init方法");

        let parentNode = yx.windowMgr.getPopUpNode();

        if (parentNode) {
            let listUtil = this.listToastMap.get(parentNode);
            if (listUtil) {
                listUtil._doSchedule(parentNode);
            } else {
                listUtil = new _ListToastUtil();
                listUtil._reset();
                this.listToastMap.set(parentNode, listUtil);
            }

            var textTipNode = listUtil._getTextTipNodeFromPool();
            textTipNode.getComponent("ListToastWidget").setContent(content);
            textTipNode.guaZaiNode = parentNode;
            listUtil._preActionList.push(textTipNode);
            cc.log(parentNode.name + "在showListToast:" + content);
            listUtil._doSchedule();
        } else {
            cc.warn("showListToast 传入的parentNode 不可为null");
        }
    },

    //移除当前的动画
    removeCurActionNode: function (node) {
        let listToast = this.listToastMap.get(node.parent);

        for (var i = 0; i < listToast._curActionList.length; i++) {
            //console.log("移除成功");
            if (node == listToast._curActionList[i]) {

                //注意splice返回的是数组
                var targetNode = listToast._curActionList.splice(i, 1)[0];

                //放入缓存池，内部会自动的removeFromParent从父节点移除targetNode.removeFromParent(false);
                listToast._txtTipNodePool.put(targetNode);
                break;
            }
        }

    },

    //是否当前节点处于队列第一位，也就是现在在最高层的node
    isCurActionListFirst: function (node) {

        let listToast = this.listToastMap.get(node.parent);//

        return listToast._curActionList[0] == node;
    },


    //将预处理行为队列的头 取出来放到 当前正在处理的队列中
    _putPreactionToCuraction: function () {
        if (this._preActionList.length > 0) {
            var node = this._preActionList.shift();
            this._curActionList.push(node);
            return node;
        }
        return null;
    },

    //从节点池中获取节点
    _getTextTipNodeFromPool: function () {
        var textTipNode = null;
        if (this._txtTipNodePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            textTipNode = this._txtTipNodePool.get();
            console.log("从缓存池拿");
        } else {
            // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            textTipNode = cc.instantiate(this._moveTextTipPrefab);
            console.log("从新创建");
        }

        textTipNode.getComponent("ListToastWidget").init();
        return textTipNode;
    },

    _doSchedule: function () {
        //console.log("doSchedule:"+this._isOnSchedule);
        if (this._isOnSchedule) {
            return;
        }

        this._isOnSchedule = true;

        // 以秒为单位的时间间隔
        var interval = 0;

        // 重复次数
        var repeat = cc.macro.REPEAT_FOREVER;

        // 开始延时
        var delay = 0;

        this._callback = function () {

            //是否可以把行为从pre中 取出放入cur执行队列
            var isCanPut = false;

            //当前正在做动画的数量为0的时候-->也就是第一次点击的时候，视为可以放入 当前执行队列
            if (this._curActionList.length == 0) {
                isCanPut = true;
            }
            //当前正在做动画的数量不为0的时候-->当最后一个入队的停下来之后，可以考虑
            else if (this._curActionList.length > 0) {
                let listToastWidget = this._curActionList[this._curActionList.length - 1].getComponent("ListToastWidget");
                if (listToastWidget && !listToastWidget.isDoMoveUp) {
                    isCanPut = true;
                }

                //特殊情况处理：
                //1 可能存在挂载的parent被移除了，导致update不会再执行，那么_curActionList 里面的值就不会被移除,使得此ToastUtil不可用。
                if (this._isParentBeRemove(listToastWidget.node.parent)) {
                    this._reset();
                    console.log("unschedule");
                    cc.Canvas.instance.unschedule(this._callback);
                    return;
                }

                //2 可能存在挂载的parent不可用被隐藏了（active=false），导致update不会再执行，那么_curActionList 里面的值就不会被移除,使得此ToastUtil不可用。
                if (listToastWidget.node.parent && !listToastWidget.node.parent.active) {
                    this._reset();
                    console.log("unschedule");
                    cc.Canvas.instance.unschedule(this._callback);
                    return;
                }

            }

            //这里做一个前提：当pre队列里面没有内容的时候，也无法做此动作了
            if (this._preActionList.length <= 0) {
                isCanPut = false;
            }


            if (isCanPut) {
                var node = this._putPreactionToCuraction();
                node.parent = node.guaZaiNode; // 加入节点树

                //每进一个动画，其他正在执行的动画都得往上继续移动
                for (var i = 0, len = this._curActionList.length; i < len; i++) {
                    this._curActionList[i].getComponent("ListToastWidget").continueMoveUp();
                }
            }
            cc.log("on schedule");
            //当所有动画都做完以后，将调度器去掉
            if (this._curActionList.length <= 0) {
                console.log("unschedule");
                cc.Canvas.instance.unschedule(this._callback);
                this._isOnSchedule = false;
            }

        }.bind(this);

        //开启调度
        cc.Canvas.instance.schedule(this._callback, interval, repeat, delay);

    },

    //目前考虑此值不会太深，所以性能不存在问题
    _isParentBeRemove(parent) {
        if (!parent) {
            return true;
        }

        if (parent.name == 'Canvas') {
            return false;
        }

        return this._isParentBeRemove(parent.parent);
    }
};

/**
 * 简单的移动的提示文字管理
 * 实现：[只存在服务器通知的情况，一般只有很少的量，这里只需简单的采取runAction]
 * 产生的文字提示node将会挂载在  CurWindowComponent的node上
 */
let _SimpleToastUtil = {
    _SimpleToastPrefab: null, //预制品
    init: function () {

        cc.loader.loadRes(_SimpleToastWidgetPrefabPath, function (err, prefab) {
            if (!err) {
                this._SimpleToastPrefab = prefab;
            } else {
                cc.warn(_SimpleToastWidgetPrefabPath + " is not exist!");
            }
        }.bind(this));
    },

    /**
     *
     * @param parentComponent
     * @param type TOAST_TYPE_SIMPLE- 简单的一条文字类型   TOAST_TYPE_CAVE -洞府四个材料item类型
     */
    showToast: function (type, data, parentNode) {

        let simpleToastNode = cc.instantiate(this._SimpleToastPrefab);
        let simpleToastComponent = simpleToastNode.getComponent("SimpleToastWidget");
        simpleToastComponent.init();

        if (parentNode) {
            parentNode.addChild(simpleToastNode);
            simpleToastComponent.show(type, data);
        }
    }
};

//显示Toast的类型
let ToastEventType = cc.Enum({
    TOAST_TYPE_SIMPLE: 1, // type 1 -> 简单文本
    TOAST_TYPE_CAVE: 2, // type 2 -> 洞府材料文本
});


//统一外部的调用接口
yx.ToastUtil = module.exports = {

    ToastEventType: ToastEventType,

    //暴露到外部统一初始化
    init: function () {
        _ListToastUtil.prototype.preLoad();
        _SimpleToastUtil.init();
    },

    //暴露给复杂的widget内部调用
    isCurActionListFirst: _ListToastUtil.prototype.isCurActionListFirst.bind(_ListToastUtil.prototype),
    removeCurActionNode: _ListToastUtil.prototype.removeCurActionNode.bind(_ListToastUtil.prototype),

    //暴露给其他界面直接使用
    /**
     * 示例：  非常需要注意传入的parentNode ，这代表此toast会弹在此Node上。 parentNode 一般使用当前window或者panel，这样才能居中。不要使用widget，因为widget不是屏幕居中的。
     * yx.ToastUtil.showListToast("修为不足！"); //队列式的toast
     * yx.ToastUtil.showCaveToast({lingshiNum:-1,shiwuNum:-9,mucaiNum:0,yuntieNum:1},this.node); //洞府特有toast
     * yx.ToastUtil.showSimpleToast("修为提升：305",this.node);//普通的toast
     */

    showListToast: _ListToastUtil.prototype.showToast.bind(_ListToastUtil.prototype),
    showSimpleToast: _SimpleToastUtil.showToast.bind(_SimpleToastUtil, ToastEventType.TOAST_TYPE_SIMPLE),//部分绑定参数
    showCaveToast: _SimpleToastUtil.showToast.bind(_SimpleToastUtil, ToastEventType.TOAST_TYPE_CAVE),//部分绑定参数
};
