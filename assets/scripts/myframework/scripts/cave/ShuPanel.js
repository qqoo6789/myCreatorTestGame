const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {
        closeBtn: cc.Button,
        canWuBtn: cc.Button,//参悟 按钮
        wuDaoRewordRiText: cc.RichText,//参悟收获
        proficiencyLabel: cc.Label,//熟练 “融会贯通”
        titleLabel: cc.Label,//书名
        textLabel: cc.Label,//描述
        stateMessageRiText: cc.RichText,//参悟状态
        lingWuBtn: cc.Button,//领悟按钮
        yuDingBtn: cc.Button,//预定按钮
    },

    /**
     *
     * @param info info 对应于 WuDaoBookConfig 的对象
     * @private
     */
    _onInit(info) {
        if (!info) {cc.warn("ShuPanel _onInit"+info);return}

        this._info = info;
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);
        this.canWuBtn.node.on('click', this._onCanWuBtnClick, this);
        this.lingWuBtn.node.on('click', this._onLingWuBtnClick, this);
        this.yuDingBtn.node.on('click', this._onYuDingBtnClick, this);

        //let wuDaoBookCfg = yx.cfgMgr.getRecordByKey("WuDaoBookConfig",{ID:args.id});
        if (this._info){
            //书名
            this.titleLabel.string = this._info["Name"];
            //描述
            if (this._info["DefDesc"]){
                this.textLabel.string = this._info["DefDesc"];
            }
            //参悟收获
            if (this._info["Reward"]){
                let str = yx.colorUtil.AddColorString("参悟后获得：",yx.colorUtil.TextYellowLight);
                let wuDaoNum = this._info["Reward"][0]["count"];
                let xiuWeiNum  = this._info["Reward"][1]["count"];
                let numStr = yx.colorUtil.AddColorString(xiuWeiNum+"修为，"+wuDaoNum+"悟道经验",yx.colorUtil.TextGreen);
                this.wuDaoRewordRiText.string = str + numStr;
            }

            //默认打开
            this.canWuBtn.active = true;
            this.stateMessageRiText.string = "";

            let allBook = yx.caveMgr.getAllBook();
            if (allBook && allBook.items[this._info.ID]){
                //融汇贯通
                if (allBook.items[this._info.ID]["level"] >= 5){
                    this.proficiencyLabel.string = "融汇贯通";
                    this.proficiencyLabel.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextWhite);
                    this.stateMessageRiText.string = "完全领悟";
                    this.canWuBtn.node.active = false;
                    this.lingWuBtn.node.active = false;
                    this.yuDingBtn.node.active = false;
                    return;
                }

                //熟练度 "一窍不通(1/1)"
                let wuDaoProficiencyCfg = yx.cfgMgr.getRecordByKey("WuDaoProficiencyConfig",{Level:allBook.items[this._info.ID]["level"]});
                if (wuDaoProficiencyCfg){
                    let numStr ="(" +allBook.items[this._info.ID]["readNum"]+"/"+wuDaoProficiencyCfg["CanWuNum"]+")";
                    this.proficiencyLabel.string = wuDaoProficiencyCfg["Name"]+numStr;

                    //可领悟 按钮显示
                    if (allBook.items[this._info.ID]["readNum"] >= wuDaoProficiencyCfg["CanWuNum"]){
                        this.lingWuBtn.node.active = true;
                        this.canWuBtn.node.active = false;
                        this.yuDingBtn.node.active = false;
                        return;
                    }
                }

                //此书正是当前正在读的书
                let readingBook = yx.caveMgr.getCurReadingBook();
                if (readingBook && readingBook.id == this._info.ID){
                    //参悟状态 stateMessageRiText
                    this.stateMessageRiText.string = "参悟中";
                    this.canWuBtn.node.active = false;
                    this.lingWuBtn.node.active = false;
                    this.yuDingBtn.node.active = false;
                    return;
                }

                //若有其他正在读的书，那么此书就不能操作了  ;但是如果拥有神魂悟道，那么可以 有预定功能
                if (readingBook && readingBook.id != this._info.ID){
                    this.stateMessageRiText.string = "";
                    this.canWuBtn.node.active = false;
                    this.lingWuBtn.node.active = false;
                    this.yuDingBtn.node.active = false;
                    //若有神魂悟道，则有预定功能
                    if (this._checkShenHunWuDaoItemUse()){
                        this.yuDingBtn.node.active = true;
                    }
                }

                //如果当前预定的书正是此书
                let bookingId = yx.caveMgr.getBookingId();
                if (bookingId && bookingId == this._info.ID){
                    this.stateMessageRiText.string = "预定中";
                    this.canWuBtn.node.active = false;
                    this.lingWuBtn.node.active = false;
                    this.yuDingBtn.node.active = false;
                }
            }
        }

    },

    _onCloseBtnClick() {
        yx.windowMgr.goBack();
    },

    _onCanWuBtnClick() {
        yx.caveMgr.reqReadBook(this._info["ID"]);
        yx.windowMgr.goBack();
    },
    _onLingWuBtnClick(){
        cc.log("_onLingWuBtnClick");
        yx.caveMgr.reqReadBookLevelUp(this._info.ID);
        yx.windowMgr.goBack();
    },
    _onYuDingBtnClick(){
        cc.log("_onYuDingBtnClick");
        yx.caveMgr.reqBooking(this._info["ID"]);
        yx.windowMgr.goBack();
    }
});
