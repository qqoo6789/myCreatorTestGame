import { HeiShiCmdType } from "../proto/protores";

cc.Class({
    extends: cc.Component,

    properties: {
        libaoBtn:        cc.Button,
        background:      cc.Sprite,
        select:          cc.Sprite,
    },

    init(data){

        this._data = data;
        this.libaoBtn.node.on('click', this.onSelectItemClick, this);

        let acfg = yx.cfgMgr.getOneRecord("ActivityConfig",{ID:data.id});
        if(acfg.activityType == yx.ActivityType.LEVEL)
        {
            yx.resUtil.LoadSprite("textures/activity/iocn-136", this.background);
        }
        else if(acfg.activityType == yx.ActivityType.TIME)
        {
            yx.resUtil.LoadSprite("textures/activity/iocn-139", this.background);
        }
        else if(acfg.activityType == yx.ActivityType.ACCOUNT)
        {
            yx.resUtil.LoadSprite("textures/activity/iocn-142", this.background);
        }
        
    },

    onSelectItemClick(){
       cc.log("select id == "+this._data.id);
       let args = {};
       args.id = this._data.id;
       yx.eventDispatch.dispatchMsg(yx.EventType.ACTIVITY_SELECTTAB,args);
    },

    selectShow(flag){
        this.select.node.active = flag;
    },

    getData(){
        return this._data;
    },
   
});
