const BaseWindow = require('BaseWindow');
const GoBackWidget = require('GoBackWidget');
const GongFaScrollItem = require("GongFaScrollItem");
const ZhaoShiScrollItem = require("ZhaoShiScrollItem");

const _pageIndexArray = [yx.proto.GongFaType.MenPai, yx.proto.GongFaType.MiJi, yx.proto.GongFaType.ZhenJue, yx.proto.GongFaType.XinJing,
    yx.proto.GongFaType.DunShu, yx.proto.GongFaType.JueXue, yx.proto.GongFaType.CanYe, yx.proto.GongFaType.ZhaoShi];

const MenPaiScrollHeight = 820;
const OtherScrollHeight = 920;
const ZhaoShiScrollHeight = 1000;

cc.Class({
    extends: BaseWindow,

    properties: {              

        backWidget:             GoBackWidget,
        gongfaItemPrefab:       cc.Prefab,
        zhaoshiItemPrefab:      cc.Prefab,

        //属性区
        lingQiLabel:            cc.Label,

        //类别按钮区
        switchTC:               cc.ToggleContainer,

        //滚动区
        emptyGroupNode:         cc.Node,
        emptyBuyBtn:            cc.Button,

        scrollView:             cc.ScrollView,
        scrollContent:          cc.Node,
        scrollBgSprite:         cc.Sprite,

        //技能点区
        skillPointGroup:        cc.Node,
        skillNumLabel:          cc.Label,
        skillAddBtn:            cc.Button,

        //底部信息区
        menpaiGroup:            cc.Node,
        TypeGroup:              cc.Node,
        menpaiTextLabel1:       cc.Label,
        menpaiTextLabel2:       cc.Label,
        menpaiTextLabel3:       cc.Label,
        menpaiTextLabel4:       cc.Label,
        typeTextLabel:          cc.Label,

        //当前分页序号
        _curPage:               Number,
    },

    _onInit(args){
        this.skillAddBtn.node.on('click', this.onSkillAddBtnClick, this);
        this.emptyBuyBtn.node.on('click', this.onEmptyBuyBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.GONG_FA_CHANGE, this.onEventGongFaChange, this);
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
        yx.eventDispatch.addListener(yx.EventType.ADD_MEN_PAI_SKILL_NUM, this.onEventSkillNumChange, this);

        this._initSwitchTC();

        //起始页是门派技能
        if (args != null)
        {
            this._curPage = args;
        }
        else
        {
            this._curPage = _pageIndexArray[0];
        }        
    },

    _onShow(args) {
        if (args != null)
        {
            this._curPage = args;
        }
        this._refresh();
    },

    _initSwitchTC(){
        this.switchTC.checkEvents.length = 0;
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "GongFaWindow";
        clickEventHandler.handler = "onSwitchTCClick";
        this.switchTC.checkEvents.push(clickEventHandler);
    },

    //功法按序， 先按Star再按WuxingType，最后ID
    _gongfaSortFunction(gongfaMsgA, gongfaMsgB){
        let gongfaInfoA = gongfaMsgA.cfg;
        let gongfaInfoB = gongfaMsgB.cfg;

        if (gongfaInfoA.Star != gongfaInfoB.Star)
        {
            return gongfaInfoB.Star - gongfaInfoA.Star;//等阶高的在前面
        }
        else if (gongfaInfoA.WuXingType != gongfaInfoB.WuXingType)
        {
            return gongfaInfoA.WuXingType - gongfaInfoB.WuXingType;//五道Type从小到大
        }
        else
        {
            return gongfaInfoA.ID - gongfaInfoA.ID;//最后ID从小到大
        }
    },

    _refreshMenPaiPage(){
        this.emptyGroupNode.active = false;

        let gongfaList = yx.gongfaMgr.getGongFaByType(this._curPage);

        gongfaList.sort(this._gongfaSortFunction);

        //scrollview
        this.scrollView.node.height = MenPaiScrollHeight;
        this.scrollView.node.getChildByName("view").height = MenPaiScrollHeight;
        this.scrollBgSprite.node.height = OtherScrollHeight;//这里没用错，背景要把技能点数内容覆盖，所以加大

        //let scrollNode = this.scrollContent;
        let self = this;
        self.scrollContent.removeAllChildren(true);

        gongfaList.forEach(gongfaMsg => {
           // let 
            let scrollItem = cc.instantiate(self.gongfaItemPrefab);

            let itemSrc = scrollItem.getComponent(GongFaScrollItem);

            if (itemSrc)
            {
                itemSrc.init(gongfaMsg);

                self.scrollContent.addChild(scrollItem);
            }
        });

        //skillnum
        this.skillPointGroup.active = true;
        this.skillNumLabel.string = gongfaList.length + "/" + yx.gongfaMgr.getMenPaiSkillNum();

        this._refreshAddAttr();
    },

    _refreshOtherPage(){
        let gongfaList = yx.gongfaMgr.getGongFaByType(this._curPage);

        if (gongfaList != null && gongfaList.length > 0)
        {
            this.emptyGroupNode.active = false;
        }
        else
        {
            this.emptyGroupNode.active = true;
        }

        gongfaList.sort(this._gongfaSortFunction);

        //scrollview
        this.scrollView.node.height = OtherScrollHeight;
        this.scrollView.node.getChildByName("view").height = OtherScrollHeight;
        this.scrollBgSprite.node.height = OtherScrollHeight;

        //let scrollNode = this.scrollContent;
        let self = this;
        self.scrollContent.removeAllChildren(true);

        gongfaList.forEach(gongfaMsg => {
            // let 
            let scrollItem = cc.instantiate(self.gongfaItemPrefab);

            let itemSrc = scrollItem.getComponent(GongFaScrollItem);

            if (itemSrc)
            {
                itemSrc.init(gongfaMsg);

                self.scrollContent.addChild(scrollItem);
            }
        });

        this.skillPointGroup.active = false;

        this._refreshAddAttr();
    },


    _refreshZhaoShiPage(){
        this.emptyGroupNode.active = false;

        let gongfaList = yx.gongfaMgr.getGongFaByType(this._curPage);

        gongfaList.sort(this._gongfaSortFunction);

        //scrollview
        this.scrollView.node.height = ZhaoShiScrollHeight;
        this.scrollView.node.getChildByName("view").height = ZhaoShiScrollHeight;
        this.scrollBgSprite.node.height = ZhaoShiScrollHeight;

        //let scrollNode = this.scrollContent;
        let self = this;
        self.scrollContent.removeAllChildren(true);

        gongfaList.forEach(gongfaMsg => {
           // let 
            let scrollItem = cc.instantiate(self.zhaoshiItemPrefab);

            let itemSrc = scrollItem.getComponent(ZhaoShiScrollItem);

            if (itemSrc)
            {
                itemSrc.init(gongfaMsg);

                self.scrollContent.addChild(scrollItem);
            }
        });

        this.skillPointGroup.active = false;
        this.menpaiGroup.active = false;
        this.TypeGroup.active = false;
    },

    _refresh(){
        if (this._curPage == yx.proto.GongFaType.MenPai)
        {
            this._refreshMenPaiPage();
        }
        else if (this._curPage == yx.proto.GongFaType.ZhaoShi)
        {
            this._refreshZhaoShiPage();
        }
        else
        {
            this._refreshOtherPage();
        }

        this.lingQiLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGQI);
    },

    
    _refreshAddAttr(){   
        if (this._curPage == yx.proto.GongFaType.MenPai)
        {
            //计算attr
            let addAttr = yx.gongfaMgr.calGongFaAttrByType(this._curPage);

            this.menpaiGroup.active = true;
            this.TypeGroup.active = false;

            let count = 0;
            let labelArray = [this.menpaiTextLabel1, this.menpaiTextLabel2, this.menpaiTextLabel3, this.menpaiTextLabel4];
            for (let type in addAttr)
            {
                labelArray[count++].string =  yx.textDict.SecAttrName[type] + "+" + yx.playerMgr.attr2secAttr(type, addAttr[type]);

                if (count >= 4)
                {
                    break;
                }
            }  
        }
        else if (this._curPage == yx.proto.GongFaType.ZhaoShi)
        {

        }
        else
        {
            this.menpaiGroup.active = false;
            this.TypeGroup.active = true;

            let addAttr = yx.gongfaMgr.calGongFaAttrByType(this._curPage);

            for (let type in addAttr)
            {
                this.typeTextLabel.string = yx.textDict.GongFaTypeName[this._curPage] + "总计：" 
                + yx.textDict.SecAttrName[type] + "+" + yx.playerMgr.attr2secAttr(type, addAttr[type]);
                break;
            }  
        }        
    },

    //刷新某一条功法信息
    _refreshGongFa(type, id)
    {
        let items = this.scrollContent.getComponentsInChildren(GongFaScrollItem);

        items.forEach(gongfaItem=>{
            if (gongfaItem.getGongFaId() == id)
            {
                gongfaItem.init(yx.gongfaMgr.getGongFa(type, id));
                return;
            }
        });
    },

    //改变招式后刷新
    _refreshChangeZhaoShi(){
        //先整个刷新
        this._refreshZhaoShiPage();
    },

    //删除一条功法后刷新
    _refreshDelete(id)
    {
        if (this._curPage != yx.proto.GongFaType.MenPai)
        {
            return;
        }

        let items = this.scrollContent.getComponentsInChildren(GongFaScrollItem);

        items.forEach(gongfaItem=>{
            if (gongfaItem.getGongFaId() == id)
            {
                gongfaItem.node.removeFromParent(true);
                return;
            }
        });
    },

    onSwitchTCClick(event, customEventData){
        cc.log("onSwitchTCClick");

        let newIndex = this.switchTC.toggleItems.indexOf(event);

        if (newIndex >= 0)
        {
            let newPage = _pageIndexArray[newIndex];

            if (newPage != undefined && newPage != this._curPage)
            {
                this._curPage = newPage;
                this._refresh();
            }
        }        
    },

    onSkillAddBtnClick(){   
        let nextSkillInfo = yx.gongfaMgr.getNextSkillInfo();

        if (nextSkillInfo)
        {
            //弹框消耗威望提示
            let content = "您确定要消耗{cost}威望增加门派技能上限？\n(当前威望：{cur})";
            content = content.format({cost:nextSkillInfo.Cost[0].count, cur:yx.playerMgr.getCurrency(yx.CyType.WEIWANG)});
        
            yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "onUpgradeConfirmBtnClick"));
        }
        else
        {
            yx.ToastUtil.showListToast("已经达到最大等级");
        }   
    },

    onUpgradeConfirmBtnClick(){
        let nextSkillInfo = yx.gongfaMgr.getNextSkillInfo();

        if (nextSkillInfo)
        {
            if (nextSkillInfo.Cost[0].count <= yx.playerMgr.getCurrency(yx.CyType.WEIWANG))
            {
                yx.gongfaMgr.reqAddMenPaiSkill();
            }
            else
            {
                yx.ToastUtil.showListToast("威望不足");
            }          
        }
        else
        {
            yx.ToastUtil.showListToast("已经达到最大等级");
        }   
    },

    //前往坊市
    onEmptyBuyBtnClick(){
        yx.windowMgr.showWindow("fangshi", yx.proto.ShopType.CangShuGe);
    },
  
    onEventGongFaChange(resp){
        if (!this.isShown())
        {
            return;
        }

        //非当前页不刷新
        if (this._curPage != resp.gongFaInfo.gongFaType)
        {
            return;
        }

        switch (resp.operateType)
        {
            case yx.proto.GongFaCmdType.AddSkill:
                //功法界面不应该有新增
                //yx.gongfaMgr.addGongFa(resp.gongFaInfo);
                break;
            case yx.proto.GongFaCmdType.UpGradeSkill:
                //yx.gongfaMgr.changeGongFa(resp.gongFaInfo);
                this._refreshGongFa(resp.gongFaInfo.gongFaType, resp.gongFaInfo.id);
                //下面增加属性也要更新
                this._refreshAddAttr();
                break;
            case yx.proto.GongFaCmdType.DeleteMenPaiSkill:
                //yx.gongfaMgr.deleteGongFa(resp.gongFaInfo);
                this._refreshDelete(resp.gongFaInfo.id);
                break;
            case yx.proto.GongFaCmdType.ChangeZhaoShi:
                //let oldZhaoShi = yx.gongfaMgr.getCurZhaoShi();
                //yx.gongfaMgr.setCurZhaoShi(resp.zhaoShi);
                this._refreshChangeZhaoShi();
                break;
            default:
                return;
        }
    },

    onEventCurrencyChange(diff){
        if (this.isShown())
        {
            this.lingQiLabel.string = yx.playerMgr.getCurrency(yx.CyType.LINGQI);
        }
    },

    onEventSkillNumChange(){
        if (this.isShown())
        {
            if (this._curPage == yx.proto.GongFaType.MenPai)
            {
                let gongfaList = yx.gongfaMgr.getGongFaByType(this._curPage);

                this.skillNumLabel.string = gongfaList.length + "/" + yx.gongfaMgr.getMenPaiSkillNum();
            }            
        }
    },
   
});