/**
 * 说明窗口
 * 目前用于 钓鱼说明、圣兽封印说明，道侣日志
 *
 */
const SHUOMING_TYPE = {
    CHUIDIAO: 1,//垂钓
    SHENGSHOU: 2,//圣兽
    DAOLVRIZHI: 3,//道侣日志
};

const BaseWindow = require('BaseWindow');
const ChuiDiaoDes = "　　1.每位道友每天可以参与两次垂钓，如果拥有天庭官职则可以获得额外次数。\n" + "　　2.每次垂钓时长1分钟，道友在抛竿后在恰当的时机收竿即可。\n" + "　　3.可以通过给鱼贩渔获换取各种资源。\n";

let ShuoMingPanel = cc.Class({
    extends: BaseWindow,

    statics: {
        SHUOMING_TYPE: SHUOMING_TYPE,
    },

    properties: {
        closeBtn: cc.Button,
        textRitext: cc.RichText,
        textScrollview: cc.ScrollView,
        bgFrameNode: cc.Node,//背景
        titleNameLabel: cc.Label,//标题名称
        jiangLiNode: cc.Node,//奖励信息
        jiangLiItemLayout: cc.Layout,//奖励列表
    },

    _onInit(args) {

        if (!args) return;

        this.jiangLiNode.active = false;
        this.closeBtn.node.on('click', this._onCloseBtnClick, this);

        if (args.shuoMingType == SHUOMING_TYPE.CHUIDIAO) {
            this.setChuiDiaoMessage(args);
        } else if (args.shuoMingType == SHUOMING_TYPE.SHENGSHOU) {
            this.setFengYinMessage(args);
        } else if (args.shuoMingType == SHUOMING_TYPE.DAOLVRIZHI) {
            this.setDaoLvRiZhiMessage(args);
        }
    },
    //道侣日志
    setDaoLvRiZhiMessage() {
        this.bgFrameNode.height = 890;
        this.titleNameLabel.string = "日志";
        this.textRitext.node.color = yx.colorUtil.toCCColor(yx.colorUtil.TextWhite);
        yx.DiarysUtil.setRichTextWithShowList(this.textRitext, "daoLvLog");
        /*this.node.runAction(cc.sequence(cc.delayTime(0.2),cc.callFunc(function () {

        }.bind(this))));*/
        this.textScrollview.scrollToBottom();
    },
    //垂钓说明
    setChuiDiaoMessage(args) {
        this.bgFrameNode.height = 560;
        this.titleNameLabel.string = "说明";
        this.textRitext.string = ChuiDiaoDes;
    },
    //封印说明
    setFengYinMessage(args) {
        if (!args.ID) return;
        this.jiangLiNode.active = true;
        this.bgFrameNode.height = 713;

        let fengYinCfg = yx.cfgMgr.getOneRecord("FengYinBossConfig", {ID: args.ID});
        if (fengYinCfg) {
            this.titleNameLabel.string = fengYinCfg["Title"] + "规则";
            this.textRitext.string = fengYinCfg["Txt1"];
            let awardList = fengYinCfg["AwardList"];
            for (let i = 0; i < awardList.length; i++) {
                let awardInfo = awardList[i];
                let info = {};
                info.clickCallBack = this.jiangLiItemClick;
                info.amount = -1;
                info.itemId = awardInfo["id"];
                yx.ItemWidget.CreateItemSlot(info, this.jiangLiItemLayout.node, "jiangliSlot_" + (i));
            }
        }

    },
    //圣兽说明奖励item点击
    jiangLiItemClick(itemCfg) {
        let args = {};
        //传入Item 的id
        args.ID = itemCfg["itemId"];
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },
    _onCloseBtnClick() {
        yx.windowMgr.goBack();
    },

});

yx.ShuoMingPanel = module.exports = ShuoMingPanel;