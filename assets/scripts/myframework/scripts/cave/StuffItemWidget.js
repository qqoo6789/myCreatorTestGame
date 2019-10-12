
/**
 * 配置表  type + level 唯一定位一条数据
 * type 1 -> 仙晶   2 ->粮食   3 ->木材   4-> 陨铁
 * Level 1 ~ 50  代表级别
 *
 */
let _prefabPath = "prefabs/widgets/StuffItemWidget";



let StuffItemWidget = cc.Class({
    extends: cc.Component,

    properties: {
        itemTitleSprite:        cc.Sprite,//item的主题的图标
        itemTitleLabel:         cc.Label,//item的主题
        itemTitleNum:           cc.Label,//item的主题的数量
        chuLiangNum:            cc.Label,//储量
        chanLiangNum:           cc.Label,//产量
        cunsumeTipLabel:        cc.Label,//消耗底部提示
        xianPuNum:              cc.Label,//仙仆 "当前数量/总数量"
        upLevelNumLabel:        cc.Label,//升级所需数值 信息
        upLevelBtn:             cc.Button,//升级按钮
        subBtn:                 cc.Button,//减少仙仆
        addBtn:                 cc.Button,//添加仙仆
        starLayout:             cc.Layout,//推荐的星星等级布局
        starSpriteFrame :       cc.SpriteFrame,//星星
        type:                   cc.Integer,//type
    },

    //
    init(){
        this.type = parseInt(this.type);
        this._initListener();
        //this.refresh();
    },

    _initListener(){
        this.upLevelBtn.node.on('click', this.onUpLevelBtnClick, this);
        this.subBtn.node.on('click', this.onSubBtnClick, this);
        this.addBtn.node.on('click', this.onAddBtnClick, this);
    },

    //刷新设值
    refresh(){
        if (!yx.caveMgr.getCaveData()){
            cc.warn("StuffItemWidget init yx.caveMgr.getCaveData() 无数据!");
            return;
        }

        /*****************************************数据刷新*************************************************/
        //this.caveData = yx.caveMgr.getCaveData();
        //根据服务器返回的值curXianPu/curLevel/type，计算其他关联值
        this.curStuffData = yx.caveMgr.getStuffDataByType(this.type);
        //读配置表
        this.curItemConfigInfo = yx.cfgMgr.getRecordByKey("DongFuConfig", {Level:this.curStuffData["curLevel"],Type:this.type});
        //当前储量
        this.curStuffData["curChuLiang"] = yx.caveMgr.getStuffNumByType(this.type);
        //最大储量
        this.curStuffData["maxChuLiang"] = this.curItemConfigInfo["MaxVal"];
        //升级所需木材
        this.curStuffData["upgradeCost"] = this.curItemConfigInfo["UpgradeCost"][0]["count"];
        //最大仙仆
        this.curStuffData["maxXianPu"] = this.curItemConfigInfo["MaxXianPu"];

        //计算产量

        //计算消耗量，消耗量为辅助变量
        if (this.type == yx.StuffItemType.SHIWU){
            this.curStuffData["curCostShiWuLiang"] = 0;
        }else {
            this.curStuffData["curCostShiWuLiang"] = this.curStuffData["curXianPu"] * this.curItemConfigInfo["PerCost"][0]["count"];
            //非食物的情况下，当前产量 = 当前仙仆 * 每个仙仆的收获
            this.curStuffData["curChanLiang"] = this.curStuffData["curXianPu"] * this.curItemConfigInfo["PerReward"][0]["count"];
        }

        //任何材料的仆人加减都会影响食物产量
        let shiWuStuffData = yx.caveMgr.getStuffDataByType(yx.StuffItemType.SHIWU);
        //查询食物当前配置表
        let shiWuConfigInfo = yx.cfgMgr.getRecordByKey("DongFuConfig", {Level:shiWuStuffData["curLevel"],Type:yx.StuffItemType.SHIWU});
        //计算食物原生产量
        let originChanliang = shiWuStuffData["curXianPu"] * shiWuConfigInfo["PerReward"][0]["count"];
        //计算食物总消耗量
        let costChanliang = 0;
        for (let type = 1; type <= 4; type ++){
            let stuffData = yx.caveMgr.getStuffDataByType(type);
            costChanliang += stuffData["curCostShiWuLiang"]?stuffData["curCostShiWuLiang"]:0;
        }
        //食物产量 = 食物原生产量 - 食物总消耗量
        shiWuStuffData["curChanLiang"] = originChanliang - costChanliang;

        /*****************************************Ui刷新*************************************************/
        this.itemTitleNum.string    = this.curStuffData["curLevel"] + "级";
        this.chuLiangNum.string     = this.curStuffData["curChuLiang"] + "/" + this.curStuffData["maxChuLiang"];
        this.chanLiangNum.string    = this.curStuffData["curChanLiang"];
        this.upLevelNumLabel.string = this.curStuffData["upgradeCost"]+"木材";
        this.xianPuNum.string       = this.curStuffData["curXianPu"] + "/" + this.curStuffData["maxXianPu"];

        //推荐星星设置
        this.starLayout.node.removeAllChildren(true);
        let itemOrderConfigInfo = yx.cfgMgr.getRecordByKey("DongFuOrderConfig", {Type:this.type});
        for(let i = 0; i < itemOrderConfigInfo["Start"]; i ++){
            var node = new cc.Node("star"+i);
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = this.starSpriteFrame;
            this.starLayout.node.addChild(node);
        }
    },

    //升级
    onUpLevelBtnClick(){
        cc.log("onUpLevelBtnClick");
        let caveData = yx.caveMgr.getCaveData();

        if (!caveData){
            return;
        }

        this.isEnougnStuff = false;//是否有足够材料

        let costMucaiNum = this.curItemConfigInfo["UpgradeCost"][0]["count"];//木材消耗
        let muCaiStuffData = yx.caveMgr.getStuffDataByType(yx.StuffItemType.MUCAI);
        let curMucaiNum = muCaiStuffData["curChuLiang"];// 获取当前木材储量

        //获取下一级别的当前type的最大储量
        let nextLevelConfigInfo = yx.cfgMgr.getRecordByKey("DongFuConfig", {Level:this.curStuffData["curLevel"]+1,Type:this.type});

        if (nextLevelConfigInfo){
            let upgrateChuliang = nextLevelConfigInfo["MaxVal"];//升级 提升的储量上限

            let arg = {};
            arg.content = "";
            arg.content += "升级所需木材:"+curMucaiNum+"/"+costMucaiNum+"\n";
            arg.content += "升级提升储量上限:"+upgrateChuliang;

            if (curMucaiNum >= costMucaiNum){this.isEnougnStuff = true}

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "StuffItemWidget";
            clickEventHandler.handler = "onUpLevelConfirmBtnClick";
            arg.confirmCallback = clickEventHandler;
            yx.windowMgr.showWindow("textConfirm", arg);
        }

    },

    onUpLevelConfirmBtnClick(){
        let caveData = yx.caveMgr.getCaveData();

        if (!caveData){
            return;
        }
        cc.log("onUpLevelConfirmBtnClick");
        //不够材料
        if (!this.isEnougnStuff){
            yx.ToastUtil.showListToast("木材不足");
            return;
        }

        yx.caveMgr.reqUpgradeDongfu(this.type);
        //木材消耗扣除 ，扣除由服务器扣除，属于虚拟货币扣除
        //let costMucaiNum = this.curItemConfigInfo["UpgradeCost"][0]["count"];
        //yx.playerMgr.stuffData[yx.StuffItemType.MUCAI]["curChuLiang"] -= costMucaiNum;

        //等级添加
        //this.curStuffData["curLevel"] += 1;

        //刷新界面
        //yx.eventDispatch.dispatchMsg(yx.EventType.REFRESH_STUFF_WINDOW);
    },

    //减少仙仆
    onSubBtnClick(){
        let caveData = yx.caveMgr.getCaveData();

        if (!caveData){
            return;
        }
        cc.log("onSubBtnClick");
        if (this.curStuffData["curXianPu"] <= 0){
            //yx.ToastUtil.showListToast("已达到最小仙仆数量");
            return;
        }

        yx.caveMgr.reqChangeWorker(this.type,-1);

    },
    //添加仙仆
    onAddBtnClick(){
        let caveData = yx.caveMgr.getCaveData();

        if (!caveData){
            return;
        }
        cc.log("onAddBtnClick");

        if (this.curStuffData["curXianPu"] >= this.curItemConfigInfo["MaxXianPu"]){
            //yx.ToastUtil.showListToast("已达到最大仙仆数量");
            return;
        }

        if (yx.playerMgr.getCurrency(yx.CyType["PUCON"]) <= 0){
            yx.ToastUtil.showListToast("没有可用仙仆");
            return;
        }

        yx.caveMgr.reqChangeWorker(this.type,1);

    },
});

module.exports = StuffItemWidget;