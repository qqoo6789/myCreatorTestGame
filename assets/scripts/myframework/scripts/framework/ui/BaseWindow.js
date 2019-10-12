// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

//require("framework");

/**
 * !#en Enum for Layout type
 * !#zh 窗口类型
 * @enum BaseWindow.Type
 */
let Type = cc.Enum({
    /**
     * !#en full window
     * !#zh 全屏窗口
     *@property {Number} WINDOW
     */
    WINDOW: 0,
    /**
     * !#en no full window
     * !#zh 非全屏窗口
     *@property {Number} PANEL
     */
    PANEL: 1,
    /**
     * !#en popup window
     * !#zh 弹出窗口
     *@property {Number} POPUP
     */
    POPUP:2,
});

/**
 * !#zh
 * BaseWindow 组件相当于一个容器，能自动对它的所有子节点进行统一排版。<br>
 * @class BaseWindow
 * @extends Component
 */
var BaseWindow = cc.Class({
    extends: cc.Component,

    properties: {

    },

    statics: {
        Type: Type,
    },

    //不想显示在编辑器中的属性可以定义在构造函数中
    //如果想把成员变量定义成私有的，可以在名称前加_
    ctor () {
        cc.log(this.__classname__ + " ctor");
        this._shown = false;
        this.windowType = Type.WINDOW;
    },

    // LIFE-CYCLE CALLBACKS:生命周期函数
    /**
     * 节点首次激活时触发
     */
    onLoad () 
    {
        cc.log(this.__classname__ + " onLoad");

        //this._onInit();
    },

    /**
     * 第一次执行 update 之前触发。start 通常用于初始化一些中间状态的数据
     */
    start () {
        cc.log(this.__classname__ + " start");
    },

    onDestroy(){
        cc.log(this.__classname__ + " onDestroy");

        this._onDeInit();

        yx.eventDispatch.removeListenersByTarget(this);
    },


    //外部访问函数
    init(info){
        this.name = info.name;
        this.windowType = info.type;

        if (this.windowType == Type.WINDOW)
        {
            this.node.setContentSize(cc.Canvas.instance.designResolution);

            if (!this.node.getComponent(cc.BlockInputEvents))
            {
                this.node.addComponent(cc.BlockInputEvents);
            }
        }

        this._onInit(info.args);
    },

    show(args){
        this._shown = true;

        if (this.node != null)
        {
            this.node.setContentSize(cc.winSize);
      
            this.node.active = true;
        }

        this._onShow(args);
    },

    hide(){
        this._shown = false;

        if (this.node != null)
        {
            this.node.active = false;
        }

        this._onHide();
    },

    isShown(){
        return this._shown;
    },


    //内部访问函数 如果子类有重写下面的函数，父类中的函数不会被调用
    
    _onInit(){
        cc.log(this.__classname__ + " _onInit");
    },

    _onShow(){
        cc.log(this.__classname__ + " _onShow");
    },

    _onHide(){
        cc.log(this.__classname__ + " _onHide");
    },

    _onDeInit(){

    },

});


module.exports = BaseWindow;
