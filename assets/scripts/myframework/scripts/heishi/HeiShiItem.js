
cc.Class({
    extends: cc.Component,

    properties: {
        index:     0,
    },

    start(){
        this.node.on('click', this.clickBtn, this);
    },

    init(id){
        this._config = yx.cfgMgr.getRecordByKey("HeiShiItemConfig", {"ID":id});

        this._lastPlaySec = 0;
    }, 

    clickBtn(){
        if(this._config)
        {
            cc.log("HeishiItem click id=="+this._config.ID);
            yx.heiShiMgr.openBox(this._config.ID);
        }
    },

    showOrHide(flag){
        this.node.active = flag;
    },

    playAnim(noewSec){
        if(this._lastPlaySec != noewSec)
        {
            this._lastPlaySec = noewSec;

            cc.log("play anim index == "+this.index+"   EffectType =="+this._config.EffectType);
            // cc.log("play anim ID == "+this._config.ID);
            // cc.log("play anim EffectType =="+this._config.EffectType);
        }
       
    },
    

     
});
