

const eventDispatch = require("EventDispatch");

//----------------------------------------------------------------------------------------------------------------------

/**
 *
 * @class SceneManager
 * @extends 
 */
yx.SceneManager = function () {

    // this._regMap = null;
    // this._uiRootNode = null;
    // this._typeNode = null;
};

yx.SceneManager.prototype = {
    constructor: yx.SceneManager,

    init: function () {   
        
        cc.log("SceneManager init");
        return true;
    },

    loadScene: function (sceneName, callback) {
        //require("SoundManager").StopBgMusic();
        var currScene = cc.director.getScene().name;
    
        if (sceneName == currScene) {
            cc.warn("already in sceneName:" + sceneName);
            if(callback){
                callback(false);
            }
            return;
        }
    
        cc.log("SceneManager exit sceneName:" + currScene);
        eventDispatch.dispatchMsg(yx.EventType.SCENE_EXIT, currScene);
    
        cc.director.loadScene(sceneName, function () {
            cc.log("SceneManager enter sceneName:" + sceneName);

            yx.windowMgr.init();

            //p.lastScene = currScene;
            eventDispatch.dispatchMsg(yx.EventType.SCENE_ENTER, sceneName);
            if(callback){
                callback(true);
            }
        });
    },   
};


/**
 * @module yx
 */

/**
 * !#en SceneManager
 * !#zh 窗口管理类。
 * @property sceneMgr
 * @type {SceneManager}
 */
yx.sceneMgr = new yx.SceneManager();

module.exports = yx.sceneMgr;