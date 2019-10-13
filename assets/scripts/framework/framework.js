
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        cc.director.loadScene('RoomWindow')
    },

    // update (dt) {},
});



window.yx = {};
module.exports = window.yx;