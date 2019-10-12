const BaseWindow = require('BaseWindow');
//syste表Id
/*const SHENYOU_CHUQIAO_SYSTEMID = 11;
const SHENYOU_SHIYI_SYSTEMID = 12;
const SHENYOU_TAIXU_SYSTEMID = 14;*/

const SHENYOU_BOOKTYPE_CHUQIAO = "shenHunChuQiao";//神魂出窍
const SHENYOU_BOOKTYPE_SHIYI = "shenHunShiYi";//神魂拾遗
const SHENYOU_BOOKTYPE_TAIXU = "shenYouTaiXu";//神游太虚术
const SHENYOU_BOOKTYPE_WUDAO = "shenHunWudao";//神魂悟道

const SHENGYOU_LIST = {
    "shenHunChuQiao": {
        "name": "《神魂出窍术》",
        "content": "炼神还虚，神魂出窍，游历四海八荒，是为神游境。学会此术，即可使用神魂斩妖除魔，探索搜集。",
        "effect": "效果：学会该术，方可神游。每神游历练一次需4分钟。",
        "quickId": 10000064,
    },
    "shenHunShiYi": {
        "name": "《神魂拾遗》",
        "content": "可控制神魂将历练掉落的灵宝迅速出售。免去背包满额取舍之苦，确保修炼心无旁骛。",
        "effect": "效果：神游历练时自动出售装备",
        "quickId": 10000065,
    },
    "shenYouTaiXu": {
        "name": "《神游太虚术》",
        "content": "凝魂炼魄，强神锻意，即为《神游太虚术》。学会该术，即可强大神魂，更可提高探索搜集的效率。",
        "effect": "效果：每神游历练一次仅需1分钟。",
        "quickId": 10000066,
    },
    "shenHunWudao": {
        "name": "《神魂悟道》",
        "content": "使用后可分出一缕神魂自动参悟道术（无止境）。",
        "effect": "效果：每次参悟结束后，都将自动开始参悟预定的道书",
        "quickId": 10000067,
    }
};


let ItemQuickBuyPanel = cc.Class({
    extends: BaseWindow,
    statics: {
        SHENYOU_BOOKTYPE_CHUQIAO: SHENYOU_BOOKTYPE_CHUQIAO,
        SHENYOU_BOOKTYPE_SHIYI: SHENYOU_BOOKTYPE_SHIYI,
        SHENYOU_BOOKTYPE_TAIXU: SHENYOU_BOOKTYPE_TAIXU,
        SHENYOU_BOOKTYPE_WUDAO: SHENYOU_BOOKTYPE_WUDAO,
        SHENGYOU_LIST: SHENGYOU_LIST,
    },
    properties: {
        titleLabel: cc.Label,
        iconSp: cc.Sprite,
        contentLabel: cc.Label,
        effectLabel: cc.RichText,
        closeBtn: cc.Button,
        buyBtn: cc.Button,
        costSp: cc.Sprite,
        costNum: cc.Label,
    },

    _onInit(args) {

        this.args = args;

        this.closeBtn.node.on('click', this.onCloseBtnClick, this);
        this.buyBtn.node.on('click', this.onBuyBtnClick, this);

    },

    _onShow() {
        this._refresh();
    },

    _refresh() {
        this.curBookType = this.args.bookType;
        this.curContent = SHENGYOU_LIST[this.curBookType];

        if (!this.curContent) return;

        this._goodsCfg = yx.cfgMgr.getOneRecord("ShopListConfig", {QuickId: this.curContent.quickId});

        if (this._goodsCfg) {

            let cost = this._goodsCfg.Cost[0];
            let costId = cost.id;
            if (cost.type === 0) {
                costId += 80000;
            }

            this._costItemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: costId});
            if (this._costItemCfg) {
                this.titleLabel.string = this.curContent.name;
                this.contentLabel.string = this.curContent.content;
                this.effectLabel.string = this.curContent.effect;
                this.costNum.string = cost.count;
                yx.resUtil.LoadSpriteByType(this._costItemCfg["Icon"], yx.ResType.ITEM, this.costSp);
            }

            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: this._goodsCfg.ID});
            if (itemCfg) {
                yx.resUtil.LoadSpriteByType(itemCfg["Icon"], yx.ResType.ITEM, this.iconSp);
            }

        }
    },

    onCloseBtnClick() {
        yx.windowMgr.goBack();
    },

    onBuyBtnClick() {
        if (yx.playerMgr.getCurrency(this._costItemCfg.ID) >= this._goodsCfg.Cost[0].count)
        {
            yx.fangshiMgr.reqPurchaseGoods(this._goodsCfg.Type, this._goodsCfg.Layer, this._goodsCfg.ID, 1);
            yx.windowMgr.goBack();
        }
        else
        {
            yx.ToastUtil.showListToast(this._costItemCfg.Name + "不足");
        }
    },
});
yx.ItemQuickBuyPanel = module.exports = ItemQuickBuyPanel;