const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn:           cc.Button,
        buildBtn:           cc.Button,
        muCaiValueRichText:    cc.RichText,
        yunTieValueRichText:   cc.RichText,
        textLabel:          cc.Label,
        titleLabel:         cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    /**
     *
     * @param args 传入参数：args = {type:yx.CaveBuildType.SHUGE}  ,CaveBuildType 代表 书阁、丹房、器室、仙酿、道侣
     * @private
     */
    _onInit(args) {
        this.isEnougnStuff = false;

        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
        this.buildBtn.node.on('click', this._onBuildBtnClick.bind(this,args), this);

        //取值
        let curMuCaiNum  = yx.caveMgr.getStuffNumByType(yx.StuffItemType.MUCAI);
        let curYunTieNum = yx.caveMgr.getStuffNumByType(yx.StuffItemType.YUNTIE);
        this.configRecord = yx.cfgMgr.getRecordByKey("DongFuBuildConfig",{Type:args.type});

        //木材设值
        let muCaiStr = curMuCaiNum + "/" + this.configRecord["Cost"][0]["count"];
        this.muCaiValueRichText.string = this._setColor(curMuCaiNum,this.configRecord["Cost"][0]["count"],muCaiStr);

        //陨铁设值
        let yunTieStr = curYunTieNum + "/" + this.configRecord["Cost"][1]["count"];
        this.yunTieValueRichText.string = this._setColor(curYunTieNum,this.configRecord["Cost"][1]["count"],yunTieStr);
        this.titleLabel.string = "建造"+this.configRecord["Name"];
        this.textLabel.string = this.configRecord["DefDesc"];

        if (curMuCaiNum >= this.configRecord["Cost"][0]["count"] && curYunTieNum >= this.configRecord["Cost"][1]["count"]){
            this.isEnougnStuff = true;
        }

        //this.buildName = this.configRecord["Name"];
    },

    _setColor(a,b,Str){
          if (a >= b){
              return yx.colorUtil.AddColorString(Str,yx.colorUtil.TextGreen);
          }
        return yx.colorUtil.AddColorString(Str,yx.colorUtil.TextRed);

    },
    _onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

    _onBuildBtnClick(args){

        if (this.isEnougnStuff){

            yx.caveMgr.reqDongFuBuild(args.type);
            //木材扣除
            //let muCaiCost = this.configRecord["Cost"][0]["count"];
            //yx.playerMgr.stuffData[yx.StuffItemType.MUCAI]["curChuLiang"] -= muCaiCost;

            //陨铁扣除
            //let yuntieCost = this.configRecord["Cost"][1]["count"];
            //yx.playerMgr.stuffData[yx.StuffItemType.YUNTIE]["curChuLiang"] -= yuntieCost;

            //设置已建造
            //yx.caveMgr.getCaveData()[""]
            //yx.caveMgr.getCaveData()["isBuild"][args.type] = true;
            //
            //yx.ToastUtil.showListToast(this.buildName+"已建造完成");
            //
            yx.windowMgr.goBack();

            //yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);
            return;
        }

        yx.ToastUtil.showListToast("材料不足");

    },
    // update (dt) {},
});
