const BaseWindow = require('BaseWindow');
const ZHUANGTAI_PAGE = 1;
const DANYAO_PAGE = 2;
const _pageIndexArray = [ZHUANGTAI_PAGE,DANYAO_PAGE];

//显示属性类型的次序
const attrTypeList = [];

cc.Class({
    extends: BaseWindow,

    properties: {              
        switchTc:               cc.ToggleContainer,

        //状态分页
        zhuangTaiPageNode:cc.Node,
        danYaoPageNode:cc.Node,

        //角色信息区
        roleIconSp:             cc.Sprite,
        nameLabel:              cc.Label,
        level1Label:            cc.Label,
        level2Label:            cc.Label,
        xiulianLabel:           cc.Label,
        feishengLabel:          cc.Label,

        //属性区
        attrGroup:              cc.Node,

        //伤害加成
        damageGroup:            cc.Node,

        //人格
        rengeGroup:             cc.Node,

        zhaoshiBtn:             cc.Button,

        //丹药分页 丹药页面的Node全部使用 dy 开头作为区分
        dyItemScrollView:cc.ScrollView,
        dyItemLayout:cc.Layout,
        dyXisuiBtn:cc.Button,

        //道书分页
    },

    _initSwitchTC(){
        this.switchTc.checkEvents.length = 0;
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "RoleInfoWindow";
        clickEventHandler.handler = "onSwitchTCClick";
        this.switchTc.checkEvents.push(clickEventHandler);
    },
    onSwitchTCClick(event, customEventData){
        cc.log("onSwitchTCClick");

        let newIndex = this.switchTc.toggleItems.indexOf(event);

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
    _onInit(){
        this.zhuangTaiPageNode.active = false;
        this.danYaoPageNode.active = false;
        this._curPage = _pageIndexArray[0];
        this.zhaoshiBtn.node.on('click', this.onZhaoShiBtnClick, this);
        this._initSwitchTC();
        //yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
    },

    _onShow () {
        this._refresh();
    },


    _refresh(){
        if (this._curPage === ZHUANGTAI_PAGE){
            this.zhuangTaiPageNode.active = true;
            this.danYaoPageNode.active = false;
            this._refreshInfo();
        }else if (this._curPage === DANYAO_PAGE){
            this.zhuangTaiPageNode.active = false;
            this.danYaoPageNode.active = true;
            this._refreshDanYao();
        }
    },

    _refreshInfo(){
        this.nameLabel.string = yx.playerMgr.getName();
        this.level1Label.string = yx.playerMgr.dujieInfo.Name;
        this.level2Label.string = yx.playerMgr.cuitiInfo.Name;
        this.xiulianLabel.string = yx.timeUtil.getXiuLianYear() + "年";
        this.feishengLabel.string = "尚未飞升";

        //ContentGroup        
        this._refreshInfoAttr();
        this._refreshInfoDamage();
        this._refreshInfoRenge();
    },

    //属性
    _refreshInfoAttr(){
        let rowNodeList = this.attrGroup.children;
        let showlist = [
            yx.proto.PropertyType.ZhenQi, 
            yx.proto.PropertyType.GenGu, 
            yx.proto.PropertyType.TiPo,
            yx.proto.PropertyType.ShenFa,
            yx.proto.PropertyType.LingLi, 
            yx.proto.PropertyType.WuXing, 
            yx.proto.PropertyType.JiYuan
        ];

        for (let i = 0; i < showlist.length && i < rowNodeList.length; i++)
        {  
            let rowNode = rowNodeList[i];
            let attrType = showlist[i];

            let title1Label = rowNode.getChildByName("Title1Label").getComponent(cc.Label);
            let value1Label = rowNode.getChildByName("Value1Label").getComponent(cc.Label);
            let title2Label = rowNode.getChildByName("Title2Label").getComponent(cc.Label);
            let value2Label = rowNode.getChildByName("Value2Label").getComponent(cc.Label);

            title1Label.string = yx.textDict.Attr[attrType] + "：";
            value1Label.string = yx.playerMgr.getProperty(attrType);            

            title2Label.string = yx.textDict.SecAttrName[attrType] + "：";
            value2Label.string = yx.playerMgr.getSecAttr(attrType);

            title1Label._updateRenderData(true);
            title2Label._updateRenderData(true);
            value1Label.node.x = title1Label.node.x + title1Label.node.width;
            value2Label.node.x = title2Label.node.x + title2Label.node.width;
        }
    },

    //伤害加成
    _refreshInfoDamage(){
        let rowNodeList = this.damageGroup.children;
        let showlist = [
            yx.proto.PropertyType.JinXi, 
            yx.proto.PropertyType.MuXi, 
            yx.proto.PropertyType.ShuiXi,
            yx.proto.PropertyType.HuoXi,
            yx.proto.PropertyType.TuXi, 
            yx.proto.PropertyType.RenZu, 
            yx.proto.PropertyType.YaoZu,
            yx.proto.PropertyType.MoZu,
            yx.proto.PropertyType.ShouZu,
            yx.proto.PropertyType.LongZu,
            0,
            yx.proto.PropertyType.XianRen,
        ];

        //一行显示两个属性 node只要有属性的一半就好了
        for (let i = 0; i < showlist.length / 2 && i < rowNodeList.length; i++)
        {
            let rowNode = rowNodeList[i];

            let title1Label = rowNode.getChildByName("Title1Label").getComponent(cc.Label);
            let value1Label = rowNode.getChildByName("Value1Label").getComponent(cc.Label);
            let title2Label = rowNode.getChildByName("Title2Label").getComponent(cc.Label);
            let value2Label = rowNode.getChildByName("Value2Label").getComponent(cc.Label);

            let attr1Type = showlist[i * 2];

            if (attr1Type != 0)
            {
                title1Label.string = yx.textDict.Attr[attr1Type] + "：";
                value1Label.string = yx.playerMgr.getProperty(attr1Type);
            }
            else
            {
                title1Label.string = "";
                value1Label.string = "";
            }

            let attr2Type = showlist[i * 2 + 1];

            if (attr2Type != 0)
            {
                title2Label.string = yx.textDict.Attr[attr2Type] + "：";
                value2Label.string = yx.playerMgr.getProperty(attr2Type);
            }
            else
            {
                title2Label.string = "";
                value2Label.string = "";
            }            

            title1Label._updateRenderData(true);
            title2Label._updateRenderData(true);
            value1Label.node.x = title1Label.node.x + title1Label.node.width;
            value2Label.node.x = title2Label.node.x + title2Label.node.width;
        }
    },

    //人格
    _refreshInfoRenge(){
        let rowNodeList = this.rengeGroup.children;

        let showlist = [
            {
                type: 1,
                value: yx.proto.PropertyType.ZhengQi
            }, {
                type: 1,
                value: yx.proto.PropertyType.XieQi
            }, {
                type: 2,
                value: yx.CyType.HAOYU
            }, {
                type: 2,
                value: yx.CyType.XIEYU
            }, {
                type: 2,
                value: yx.CyType.WEIWANG
            }, {
                type: 0,
                value: 0
            },
        ];    

        for (let i = 0; i < showlist.length / 2 && i < rowNodeList.length; i++)
        {
            let rowNode = rowNodeList[i]; 

            let title1Label = rowNode.getChildByName("Title1Label").getComponent(cc.Label);
            let value1Label = rowNode.getChildByName("Value1Label").getComponent(cc.Label);
            let title2Label = rowNode.getChildByName("Title2Label").getComponent(cc.Label);
            let value2Label = rowNode.getChildByName("Value2Label").getComponent(cc.Label);

            for (let j = 0; j < 2; j++)
            {
                let attrType = showlist[i * 2 + j].type;
                let attrValue = showlist[i * 2 + j].value;

                let titleLabel = j == 0 ? title1Label : title2Label;
                let valueLabel = j == 0 ? value1Label : value2Label;

                //属性
                if (attrType == 1)
                {
                    titleLabel.string = yx.textDict.Attr[attrValue] + "：";
                    valueLabel.string = yx.playerMgr.getProperty(attrValue);
                }
                else if (attrType == 2)//货币
                {
                    let itemCfg = yx.cfgMgr.getRecordByKey("ItemConfig", {ID:attrValue});

                    if (itemCfg)
                    {
                        titleLabel.string = itemCfg.Name + "：";
                    }
                    else
                    {
                        titleLabel.string = "";
                    }
                    
                    valueLabel.string = yx.playerMgr.getCurrency(attrValue);
                }
                else
                {
                    titleLabel.string = "";
                    valueLabel.string = "";
                }
            }

            title1Label._updateRenderData(true);
            title2Label._updateRenderData(true);
            value1Label.node.x = title1Label.node.x + title1Label.node.width;
            value2Label.node.x = title2Label.node.x + title2Label.node.width;
        }
    },



    onZhaoShiBtnClick(){
        yx.windowMgr.showWindow("gongfa", yx.proto.GongFaType.ZhaoShi);
    },
    

    /**********************************丹药页*************************************************************/
    _refreshDanYao(){

        for(let i = 0; i < 10; i ++){
            let info = {
                title:"一阶丹药",
                items:new Array(i)
            }
            yx.DanYaoTitleItem.CreateItem(info,this.dyItemLayout.node,"DanYaoTitleItem"+i,null);
        }

        //dyItemLayout
    }
});