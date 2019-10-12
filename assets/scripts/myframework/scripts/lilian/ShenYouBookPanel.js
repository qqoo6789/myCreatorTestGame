/**
 * UI改版，此Panel废弃，更换成itemQuickBuyPanel
 */
/*

const BaseWindow = require('BaseWindow');
const SHENYOU_CHUQIAO_SYSTEMID = 11;
const SHENYOU_SHIYI_SYSTEMID = 12;
const SHENYOU_TAIXU_SYSTEMID = 14;



const SHENGYOU_LIST = {
    "shenHunChuQiao":{
        "name":"《神魂出窍术》",
        "content":"炼神还虚，神魂出窍，游历四海八荒，是为神游境。学会此术，即可使用神魂斩妖除魔，探索搜集。",
        "effect":"效果：学会该术，方可神游。每神游历练一次需4分钟。",
        //"comsume":"灵石X30000",
        "systemId":SHENYOU_CHUQIAO_SYSTEMID,
        "shopId":SHENYOU_CHUQIAO_SHOPID,
    },
    "shenHunShiYi":{
        "name":"神魂拾遗",
        "content":"可控制神魂将历练掉落的灵宝迅速出售。免去背包满额取舍之苦，确保修炼心无旁骛。",
        "effect":"效果：神游历练时自动出售装备",
        //"comsume":"灵石X10000",
        "systemId":SHENYOU_SHIYI_SYSTEMID,
        "shopId":SHENYOU_SHIYI_SHOPID,
    },
    "shenYouTaiXu":{
        "name":"《神游太虚术》",
        "content":"凝魂炼魄，强神锻意，即为《神游太虚术》。学会该术，即可强大神魂，更可提高探索搜集的效率。",
        "effect":"效果：每神游历练一次仅需1分钟。",
        //"comsume":"仙玉X98",
        "systemId":SHENYOU_TAIXU_SYSTEMID,
        "shopId":SHENYOU_TAIXU_SHOPID,
    }
};

const SHENYOU_BOOKTYPE = {
    SHENHUN_SHIYI:0,//神魂拾遗
    SHENHUN_CHUQIAO:1,//神魂出窍
    SHENHUN_TAIXU:2,//神游太虚术
};

let ShenYouBookPanel = cc.Class({
    extends: BaseWindow,
    statics:{
        SHENYOU_BOOKTYPE:SHENYOU_BOOKTYPE,
        SHENYOU_CHUQIAO_SYSTEMID:SHENYOU_CHUQIAO_SYSTEMID,
        SHENYOU_SHIYI_SYSTEMID:SHENYOU_SHIYI_SYSTEMID,
        SHENYOU_TAIXU_SYSTEMID:SHENYOU_TAIXU_SYSTEMID,
    },
    properties: {

        confirmBtn: cc.Button,//按钮

        titleLabel:cc.Label,//
        contentLabel:cc.Label,//
        effectRitext:cc.RichText,//
        consumeRiText:cc.RichText,//地

    },
    _onInit(args){

        this.curBookType = args.bookType;
        this.curContent = null;

        if (this.curBookType === SHENYOU_BOOKTYPE.SHENHUN_CHUQIAO){
            this.curContent = SHENGYOU_LIST.shenHunChuQiao;
        }else if (this.curBookType === SHENYOU_BOOKTYPE.SHENHUN_SHIYI){
            this.curContent = SHENGYOU_LIST.shenHunShiYi;
        }else if (this.curBookType === SHENYOU_BOOKTYPE.SHENHUN_TAIXU){
            this.curContent = SHENGYOU_LIST.shenYouTaiXu;
        }

        this.confirmBtn.node.on("click",this._onBuyBtnClick,this);

        if (!this.curContent) return;

        let systemCfg = yx.cfgMgr.getOneRecord("SystemConfig",{id:this.curContent.systemId});
        if (systemCfg){

            let consumeValue = systemCfg.str_value[0];
            let consumeName = "";
            let consumeId = consumeValue.id;

            if (consumeValue.type === 0){
                consumeId += 80000;
            }

            let itemCfg = yx.cfgMgr.getOneRecord("ItemConfig",{ID:consumeId});
            if (itemCfg){
                consumeName = itemCfg["Name"];
                this.curContent.comsume = consumeName +"X"+consumeValue["count"];

                if (this.curContent){
                    this.titleLabel.string = this.curContent.name;
                    this.contentLabel.string = this.curContent.content;
                    this.effectRitext.string = this.curContent.effect;
                    this.consumeRiText.string = this.curContent.comsume;
                }
            }
        }
    },

    onCloseBtnClick(){
        yx.windowMgr.goBack();
    },

   /!* _onBuyBtnClick(){

        if (this.curContent){
            yx.shenYouMgr.reqBuyShenYouItem(this.curContent.systemId);
        }

        yx.windowMgr.goBack();
    },*!/

    _onShow(args){

    },

    _onHide(){

    },
});

yx.ShenYouBookPanel = module.exports = ShenYouBookPanel;
*/
