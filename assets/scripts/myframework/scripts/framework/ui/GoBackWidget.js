// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

let GoBackWidget = cc.Class({
    extends: cc.Component,

    properties: {
        titleSprite:     cc.Sprite,
    },

    setTitle(name){
        //this.titleLabel.string = name;
    },

    onBtnClick(){
        //返回按钮
        yx.windowMgr.goBack();

    },

});

module.extends = GoBackWidget;