const BaseWindow = require('BaseWindow');


let ChuiDiaoWindow = cc.Class({
    extends: BaseWindow,
    properties: {

        chuiXingBgNode: cc.Node,
        huanHaiBgNode: cc.Node,
        leftTimeLabel: cc.Label,
        leftTimeNode: cc.Node,

        unBeginNode: cc.Node,//钓鱼 未开始钓鱼页
        hadBeginNode: cc.Node,//钓鱼 已开始钓鱼页
        hadEndNode: cc.Node,//钓鱼 结束钓鱼页

        quitBtn: cc.Button,//离开按钮

        timeProgressBar: cc.ProgressBar,//进度条
        timeProgressBarLabel: cc.Label,//进度条内容
        paoGanBtn: cc.Button,//抛竿
        daLiBtn: cc.Button,//大力
        yuHuiBtn: cc.Button,//迂回
        kuaiSuBtn: cc.Button,//快速

        logRichText: cc.RichText,//日志RichText
        logScrollView: cc.ScrollView,

        //spine: sp.Skeleton,

        yuGanAnimation: cc.Animation,//鱼竿动画
        yuPiaoAnimation: cc.Animation,//鱼票动画
        boWenAnimation: cc.Animation,//波纹动画

    },

    _onInit() {
        this.curFieldType = yx.proto.GoFishingFieldType.AboveGround;
        this.unBeginNode.active = false;
        this.hadBeginNode.active = false;
        this.hadEndNode.active = false;

        this.paoGanBtn.node.on("click", this.paoGanBtnClick, this);
        this.daLiBtn.node.on("click", this.daLiBtnClick, this);
        this.yuHuiBtn.node.on("click", this.yuHuiBtnClick, this);
        this.kuaiSuBtn.node.on("click", this.kuaiSuBtnClick, this);
        this.quitBtn.node.on("click", this.quitBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_OPT_INFO, this._refresh, this);
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_CHANG_GAMESTATE, this._changGameState, this);
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_LAGAN_RESULT, this._laGanResult, this);
        yx.eventDispatch.addListener(yx.EventType.CHUIDIAO_LAGAN_RECOMMEND, this._laGanRecommend, this);

        let self = this;
        //一遍动画循环完成
        /*this.spine.setCompleteListener((trackEntry) => {
            self.showBtns();
            self.showRewordAndRiZhi();
        });*/

        //默认播放待机
        this.yuGanAnimation.play();


        this.yuGanAnimation.on('stop',
            function () {
                self.showBtns();
                self.showRewordAndRiZhi();
            },
            this);

        //鱼漂快速抖动动画，结束之后，恢复idle
       /* var yupiao_move = this.yuPiaoAnimation.getAnimationState('diaoyu_yupiao_move');
        yupiao_move.on('lastframe',
            function () {
                self.yuPiaoAnimation.play("diaoyu_yupiao_move");
                self.boWenAnimation.play("diaoyu_bowen");
            }, this);*/

    },

    showRewordAndRiZhi() {
        if (!this.chuiDiaoResult) return;
        //要延迟一下，做完动画，然后显示获取的结果与结果日志
        if (this.chuiDiaoResult["reward"] && this.chuiDiaoResult["reward"].length > 0) {

            //显示成功拉到鱼的动作日志
            if (this.chuiDiaoResult["piaoType"]) {
                switch (this.chuiDiaoResult["piaoType"]) {
                    case yx.proto.PiaoType.DaLi:
                        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                            name: yx.playerMgr.getName(),
                            index: 4
                        });
                        this.logScrollView.scrollToBottom();
                        break;
                    case yx.proto.PiaoType.YuHui:
                        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                            name: yx.playerMgr.getName(),
                            index: 5
                        });
                        this.logScrollView.scrollToBottom();
                        break;
                    case yx.proto.PiaoType.KuaiSu:
                        yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                            name: yx.playerMgr.getName(),
                            index: 6
                        });
                        this.logScrollView.scrollToBottom();
                        break;
                }
            }

            for (let i = 0; i < this.chuiDiaoResult["reward"].length; i++) {
                let reward = this.chuiDiaoResult["reward"][i];
                let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID: reward.itemID});
                if (itemCfg) {
                    yx.ToastUtil.showListToast("获取" + itemCfg["Name"] + "x" + reward.count);
                    yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                        name: itemCfg["Name"],
                        index: 10
                    });
                }
            }
        } else {
            //显示失败拉到鱼的动作日志
            let random = parseInt(Math.random() * 2) + 7;//7 8 随机

            yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                name: yx.playerMgr.getName(),
                index: random
            });
            this.logScrollView.scrollToBottom();
        }
        this.chuiDiaoResult = null;
    },

    hideBtns() {
        this.paoGanBtn.node.active = false;
        this.daLiBtn.node.active = false;
        this.yuHuiBtn.node.active = false;
        this.kuaiSuBtn.node.active = false;
    },
    showBtns() {
        this.paoGanBtn.node.active = true;
        this.daLiBtn.node.active = true;
        this.yuHuiBtn.node.active = true;
        this.kuaiSuBtn.node.active = true;

    },
    paoGanBtnClick() {
        let cmdType = yx.proto.GoFishingCmdType["PaoGan_Cmd"];//抛
        let fieldType = yx.proto.GoFishingFieldType["AboveGround"];//地上(场地1)

        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType);
    },
    daLiBtnClick() {
        let cmdType = yx.proto.GoFishingCmdType["LaGan_Cmd"];//拉
        let piaoType = yx.proto.PiaoType["DaLi"];//大力
        let fieldType = yx.proto.GoFishingFieldType["AboveGround"];//地上(场地1)
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType, piaoType);
    },
    yuHuiBtnClick() {
        let cmdType = yx.proto.GoFishingCmdType["LaGan_Cmd"];//拉
        let piaoType = yx.proto.PiaoType["YuHui"];//迂回
        let fieldType = yx.proto.GoFishingFieldType["AboveGround"];//地上(场地1)
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType, piaoType);
    },
    kuaiSuBtnClick() {
        let cmdType = yx.proto.GoFishingCmdType["LaGan_Cmd"];//拉
        let piaoType = yx.proto.PiaoType["KuaiSu"];//快速
        let fieldType = yx.proto.GoFishingFieldType["AboveGround"];//地上(场地1)
        yx.chuiDiaoMgr.reqGoFishing(cmdType, fieldType, piaoType);
    },
    quitBtnClick() {
        yx.windowMgr.goBack();
    },

    _onShow(resp) {
        this.hadEndNode.active = false;
        yx.DiarysUtil.setRichTextWithShowList(this.logRichText, "chuiDiao");
        this._refresh(resp);
    },
    stopBtnEffect(){
        let effectAnima1 = this.daLiBtn.node.getComponentInChildren(cc.Animation);
        let effectAnima2 = this.yuHuiBtn.node.getComponentInChildren(cc.Animation);
        let effectAnima3 = this.kuaiSuBtn.node.getComponentInChildren(cc.Animation);
        effectAnima1.stop();
        effectAnima2.stop();
        effectAnima3.stop();
        effectAnima1.node.active = false;
        effectAnima2.node.active = false;
        effectAnima3.node.active = false;

    },
    showBtnEffect(piaoType){
        let effectAnima = null;
        if (yx.proto.PiaoType.DaLi === piaoType){
            effectAnima = this.daLiBtn.node.getComponentInChildren(cc.Animation);
        }else if (yx.proto.PiaoType.YuHui === piaoType){
            effectAnima = this.yuHuiBtn.node.getComponentInChildren(cc.Animation);
        }else if (yx.proto.PiaoType.KuaiSu === piaoType){
            effectAnima = this.kuaiSuBtn.node.getComponentInChildren(cc.Animation);
        }

        if (effectAnima){
            effectAnima.node.active = true;
            effectAnima.play();
        }

    },
    //拉杆推荐
    _laGanRecommend(resp) {

        if (resp && resp["piaoType"]) {
            switch (resp["piaoType"]) {
                case yx.proto.PiaoType.DaLi:
                    //this.spine.setAnimation(0, 'yupiao_01', false);
                    yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {index: 1});
                    this.logScrollView.scrollToBottom();
                    break;
                case yx.proto.PiaoType.YuHui:
                    //this.spine.setAnimation(0, 'yupiao_02', false);
                    yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {index: 2});
                    this.logScrollView.scrollToBottom();
                    break;
                case yx.proto.PiaoType.KuaiSu:
                    //this.spine.setAnimation(0, 'yupiao_03', false);
                    yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {index: 3});
                    this.logScrollView.scrollToBottom();
                    break;
            }

            this.showBtnEffect(resp["piaoType"]);

            this.yuPiaoAnimation.play("diaoyu_yupiao_move");

            this.boWenAnimation.play("diaoyu_bowen2");

        }
    },

    //拉杆结果
    _laGanResult(resp) {
        this.chuiDiaoResult = {};
        yx.CodeHelper.deepClone(resp, this.chuiDiaoResult);//这里需要clone一个备份，用于动画后显示。否则此数据会被修改。

        //根据不同的拉杆方式，做不同的拉杆动画
        if (resp["piaoType"]) {
            switch (resp["piaoType"]) {
                case yx.proto.PiaoType.DaLi:
                    //this.hideBtns();
                    this.yuGanAnimation.play("diaoyu_kuaisula2");
                    //this.spine.setAnimation(0, 'shougan_01', false);
                    break;
                case yx.proto.PiaoType.YuHui:
                    //this.hideBtns();
                    this.yuGanAnimation.play("diaoyu_dalila");
                    //this.spine.setAnimation(0, 'shougan_02', false);
                    break;
                case yx.proto.PiaoType.KuaiSu:

                    this.yuGanAnimation.play("diaoyu_kuaisula");
                    //this.spine.setAnimation(0, 'shougan_03', false);
                    break;
            }
            this.hideBtns();
            this.stopBtnEffect();
        }

        //时间到了，自动拉杆
        if (resp["piaoType"] === 0) {
            this.hideBtns();
            this.yuGanAnimation.play("diaoyu_kuaisula");
            //this.spine.setAnimation(0, 'shougan_03', false);

            //获取剩余次数
            if (resp["curFieldType"]) yx.chuiDiaoMgr.reqGoFishing(yx.proto.GoFishingCmdType["GetConsume_Cmd"], resp["curFieldType"]);
        }


    },
    _changGameState(resp) {

        //显示不同场景对应背景
        if (resp["curFieldType"] == yx.proto.GoFishingFieldType.AboveGround) {
            this.chuiXingBgNode.active = true;
        } else {
            this.huanHaiBgNode.active = true;
        }

        //根据resp 恢复场景
        switch (resp["gameState"]) {
            case yx.proto.GameState.Inited: {
                this.unBeginNode.active = true;
                this.hadBeginNode.active = false;
                this.leftTimeNode.active = false;
                this.yuGanAnimation.play("diaoyu_idle");
                //this.spine.setAnimation(0, 'none', false);

                break;
            }
            case yx.proto.GameState.Stop: {
                this.yuGanAnimation.play("diaoyu_idle");
                //this.spine.setAnimation(0, 'none', false);
                this.unBeginNode.active = false;
                this.hadBeginNode.active = false;
                this.leftTimeNode.active = false;
                this.hadEndNode.active = true;
                break;
            }
            case yx.proto.GameState.PaoGan: {

                //重连的时候
                if (resp["cmdType"] == yx.proto.GoFishingCmdType.Reconnect_Cmd) {
                    this.yuGanAnimation.play("diaoyu_idle");
                    //this.spine.setAnimation(0, 'none', false);
                }

                this.unBeginNode.active = true;
                this.hadBeginNode.active = false;
                this.leftTimeNode.active = true;
                break;
            }
            case yx.proto.GameState.LaGan: {
                this.unBeginNode.active = false;
                this.hadBeginNode.active = true;
                this.leftTimeNode.active = true;
                this.yuGanAnimation.play("diaoyu_paogan");
                //this.spine.setAnimation(0, 'paogan', false);

                //重连的时候，不加日志
                if (resp["cmdType"] != yx.proto.GoFishingCmdType.Reconnect_Cmd) {

                    //抛丸杆之后，服务器进入拉状态。所以在此 显示抛竿日志
                    yx.DiarysUtil.addShowTextToRichText(this.logRichText, "chuiDiao", {
                        name: yx.playerMgr.getName(),
                        index: 0
                    });
                    this.logScrollView.scrollToBottom();
                }
                break;
            }
        }
    },
    //整个界面的刷新，用于重连恢复
    _refresh(resp) {

        this.resp = resp;
        this.curFieldType = this.resp["fieldType"];

        this._changGameState(resp);

        //this._laGanResult(resp);

    },

    update(dt) {

        //游戏时间倒计时
        if (this.resp && this.resp["gameState"] != yx.proto.GameState.Stop) {
            this.resp["leftTime"] -= dt;
            if (this.resp["leftTime"] <= 0) {
                this.resp["leftTime"] = 0;
                //无需改变状态、无需刷新界面，服务器会推送
            }
            this.leftTimeLabel.string = yx.timeUtil.seconds2hourMinSecond(parseInt(this.resp["leftTime"]));
        }

        //钓鱼进度
        if (this.resp && this.resp["gameState"] == yx.proto.GameState.LaGan) {
            this.resp.curTime -= dt;
            this.timeProgressBar.progress = this.resp.curTime / this.resp.maxTime;
            if (this.resp.curTime <= 0) {
                this.resp.curTime = 0;
                //无需改变状态、无需刷新界面，服务器会推送
            }

            this.timeProgressBarLabel.string = this.resp.curTime.toFixed(1) + "s";
        }


    },

});

yx.ChuiDiaoWindow = module.exports = ChuiDiaoWindow;