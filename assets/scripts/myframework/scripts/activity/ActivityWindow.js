const BaseWindow = require('BaseWindow');
const ActivityTabItem = require('ActivityTabItem');
const ActivityScrollItem = require('ActivityScrollItem');
const ActivityScrollItem2 = require('ActivityScrollItem2');

cc.Class({
    extends: BaseWindow,
    properties: {
        pageBg:                 cc.Sprite,
        tabContent:             cc.Node,
        scrollContent:          cc.Node,
        activityTabItemPrefab:  cc.Prefab,
        activityItemPrefab:     cc.Prefab,
        activityItem2Prefab:     cc.Prefab,

        tabScrollView:           cc.ScrollView,
        leftBtn:                 cc.Button,
        rightBtn:                 cc.Button,
    },

    _onInit(){
        yx.eventDispatch.addListener(yx.EventType.ACTIVITY_REFRESH, this.onRefresh, this);
        yx.eventDispatch.addListener(yx.EventType.ACTIVITY_SELECTTAB, this.onSelect, this);
        yx.eventDispatch.addListener(yx.EventType.ACTIVITY_TASK_REFRESH, this.onTaskRefresh, this);

        this.leftBtn.node.on('click', this.onLeftBtnClick, this);
        this.rightBtn.node.on('click', this.onRightBtnClick, this);
    },

    _onShow(){

        let list = yx.ActivityMgr.getList();
        if (list)
        {
            this._refresh();
        }
        else
        {
            yx.ActivityMgr.Info();
        }
    },

    _onHide(){
        this.unscheduleAllCallbacks();
    },

    _onDeInit(){

    },

    _refresh(){
        let list = yx.ActivityMgr.getList();
        this._tabs = {};
        let self = this;
        self.tabContent.removeAllChildren(true);
        list.forEach(data => {
            let tabItem = cc.instantiate(self.activityTabItemPrefab);
            let itemSrc = tabItem.getComponent(ActivityTabItem);
            if (itemSrc)
            {
                itemSrc.init(data);
                self.tabContent.addChild(tabItem);

                this._tabs[data.id] = itemSrc;

                if(this._selectId == null)
                {
                    this._selectId = data.id;
                }
            }
        });

        
        this._refreshTabContent();
    },

    _refreshTabContent(){
        for (const key in this._tabs) {
            if (this._tabs.hasOwnProperty(key)) {
                const element = this._tabs[key];
                element.selectShow(false);
            }
        }
        this._tabs[this._selectId].selectShow(true);
        
        // let acfg = yx.cfgMgr.getOneRecord("ActivityConfig",{ID:this._selectId});
        // if(acfg.activityType == yx.ActivityType.LEVEL)
        // {
        //     yx.resUtil.LoadSprite("textures/activity/iocn-136", this.pageBg);
        // }
        // else if(acfg.activityType == yx.ActivityType.TIME)
        // {
        //     yx.resUtil.LoadSprite("textures/activity/iocn-139", this.pageBg);
        // }
        // else if(acfg.activityType == yx.ActivityType.ACCOUNT)
        // {
        //     yx.resUtil.LoadSprite("textures/activity/iocn-137", this.pageBg);
        // }


        let data = this._tabs[this._selectId].getData();
        let list = yx.ActivityMgr.getTasks(data.fileName);
        this._items = [];
        let self = this;
        self.scrollContent.removeAllChildren(true);
        list.forEach(datacfg => {

            let item = null;
            let itemSrc = null;
            if(data.type == yx.ActivityType.ACCOUNT)
            {
                item = cc.instantiate(self.activityItem2Prefab); 
                itemSrc = item.getComponent(ActivityScrollItem2);
            }
            else{
                item = cc.instantiate(self.activityItemPrefab);
                itemSrc = item.getComponent(ActivityScrollItem);
            }

            
            if (itemSrc)
            {
                itemSrc.init(datacfg,data.type);
                self.scrollContent.addChild(item);
                self._items.push(itemSrc);
            }
        });
      
        this.onTaskRefresh();
    },

    
    onRefresh(){
        this._refresh();
    },

    onSelect(args){
        if(this._selectId == args.id)
            return;
        this._selectId = args.id;
        this._refreshTabContent();
    },

    _refreshScrollContent(){

    },


    onTaskRefresh(){
        for (let index = 0; index < this._items.length; index++) {
            const element = this._items[index];
            element.onUpdate();
        }
    },


    onLeftBtnClick(){
        let curOffsetX = this.tabScrollView.getScrollOffset().x;
        this.tabScrollView.scrollToOffset(cc.v2(Math.abs(curOffsetX) - this.tabScrollView.node.width, 0), 1.5);
    },

    onRightBtnClick(){
        let curOffsetX = this.tabScrollView.getScrollOffset().x;
        this.tabScrollView.scrollToOffset(cc.v2(Math.abs(curOffsetX) + this.tabScrollView.node.width, 0), 1.5);
    },
    

});