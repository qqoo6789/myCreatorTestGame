cc.Class({
    extends: cc.Component,

    properties: {
        btn: cc.Button,
        levelLabel: cc.Label,
        nameLabel: cc.Label,

        _mapId: 0,
    },

    getMapId() {
        return this._mapId;        
    },

    start() {
        this.node.active = false;
        let name = this.node.name;
        let num = name.split("_")[1];
        this.levelLabel.string = num;
        this.liLianCfg = yx.cfgMgr.getRecordByKey("LiLianMapConfig", {ID: parseInt(num)});
        this.nameLabel.string = this.liLianCfg["Name"];

        this._mapId = this.liLianCfg["ID"];

        this.btn.node.on("click", this._btnClick, this);
    },

    _btnClick() {
        if (this._mapId > 0 && this._mapId == yx.battleMgr.getLiLianCurMapId())
        {
            yx.battleMgr.reqEnterMap(this._mapId);
        }
        else
        {
            yx.windowMgr.showWindow("lilianPanel",{ID:this._mapId});
        }       
    }

});
