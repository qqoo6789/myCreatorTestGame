const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        titleLabel:cc.Label,// 关卡名称
        closeBtn: cc.Button,
        goBtn: cc.Button,//前往 按钮
        recommendTipLabel:cc.Label,//“推荐开光镜”
        contentTextLabel:cc.Label,//主内容
    },
    /**
     *
     * @param args ID: LiLianMapConfig 的ID
     * @private
     */
    _onInit(args){

        if (!args) return;
        if (!args.ID) return;

        this.goBtn.node.on("click",this._goBtnClick,this);
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.ENTER_MAP, this.onEventEnterMap, this);
        

        this._mapId = args.ID;

        let mapCfg = yx.cfgMgr.getRecordByKey("LiLianMapConfig", {ID:args.ID});
        if (mapCfg){
            this.titleLabel.string = mapCfg["Name"];
            this.contentTextLabel.string = mapCfg["DefDesc"];

            this.recommendTipLabel.string = "(推荐" + mapCfg.TuiJian + ")";
        }

        // //如果xx，则显示 推荐开光镜
        // if (true){
        //     this.recommendTipLabel.node.active = true;
        // }
    },

    //前往
    _goBtnClick(){
        yx.battleMgr.reqEnterMap(this._mapId);
    },

    _onCloseBtnClick() {
        yx.windowMgr.goBack();
    },

    onEventEnterMap(resp){
        if (!this.isShown())
        {
            return;
        }
        
        //902 进入地图副本
        // message S2C_EnterMap {
        //     optional int32 posX = 1;//当前坐标
        //     optional int32 posY = 2;//当前坐标
        //     repeated MapInfo mapInfo = 3;//当前副本走过的格子
        // }

        yx.windowMgr.closeWindow(this);

        // let args = {};
        // args.posX = resp.posX;
        // args.posY = resp.posY;
        // args.mapInfo = resp.mapInfo;
        // args.mapId = resp.mapId;
        // args.backX = resp.backX;
        // args.backY = resp.backY;

        // yx.windowMgr.showWindow("battleMap", args);
    },
});
