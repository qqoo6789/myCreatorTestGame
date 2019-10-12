
cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel:      cc.Label,
        descRichText:    cc.RichText,
        getBtn:          cc.Button,
        getBtnText:      cc.Label,
        scrollContent1:   cc.Node,
        scrollContent2:   cc.Node,
    },

    init(data,type){
        this.getBtn.node.on('click', this.onGetRewardClick, this);
        this._data = data;
        this._type = type;

        if(data.Name != null)
        {
            this.titleLabel.string = data.Name;
        }
        else
        {
            this.titleLabel.string = data.des;
        }

        cc.log("init=="+this._data.ID+"_"+this._data.Index);

        let list = data.Reward;
        cc.log("Reward.length=="+list.length);
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            cc.log("id=="+element.id);
        }
        let list1 = [];
        for (let index = 0; index < 4; index++) {
            const element = list[index];
            if(element)
            {
                list1.push(element);
            }
        }
        let list2 = [];
        for (let index = 4; index < 8; index++) {
            const element = list[index];
            if(element)
            {
                list2.push(element);
            }
        }


        let self = this;
        self.scrollContent1.removeAllChildren(true);
        list1.forEach(reward => {
            let itemInfo = {};
            itemInfo.amount = reward.count;
            itemInfo.itemId = reward.id;
            itemInfo.clickCallBack = self.onItemClick;
            yx.ItemWidget.CreateItemSlot(itemInfo, self.scrollContent1, "reward"+reward.id);
  
        });

        self.scrollContent2.removeAllChildren(true);
        list2.forEach(reward => {
            let itemInfo = {};
            itemInfo.amount = reward.count;
            itemInfo.itemId = reward.id;
            itemInfo.clickCallBack = self.onItemClick;
            yx.ItemWidget.CreateItemSlot(itemInfo, self.scrollContent2, "reward"+reward.id);
  
        });

        this.onUpdate();
    },

    onItemClick(itemInfo){
        let args = {};
        //传入Item 的id
        args.ID = itemInfo.itemId;
        //设置itemDetailShowPanel显示方式
        args.showType = yx.ItemDetailShowPanel.SHOW_TYPE_SIMPLE;
        //打开
        yx.windowMgr.showWindow("itemDetailShowPanel", args);
    },

    onGetRewardClick(){
       cc.log("领取奖励");
        yx.ActivityMgr.TaskReward(this._data.ID,this._data.Index);
    },

    onUpdate(){

        cc.log("onUpdate=="+this._data.ID+"_"+this._data.Index);
        let taskInfo = yx.ActivityMgr.getTaskInfo(this._data.ID,this._data.Index);

        if(taskInfo == null)
            return;

        if(taskInfo.taskState == yx.proto.TaskStateType.Processing)
        {
            this.getBtn.node.active = false;
            this.descRichText.node.active = true;

            let content = "";
            if(this._type == yx.ActivityType.LEVEL)
            {
                content = "<color=#ff0000>{cur}级</color><color=#ffffff>/{need}级</color>";
                content = content.format({cur:taskInfo.processing,need:this._data.Level});
                
            }
            else if(this._type == yx.ActivityType.TIME)
            {
                content = "<color=#ff0000>{cur}年</color><color=#ffffff>/{need}年</color>";
                content = content.format({cur:yx.timeUtil.minutes2year(taskInfo.processing),need:yx.timeUtil.minutes2year(this._data.Time)});
            }
            else if(this._type == yx.ActivityType.ACCOUNT)
            {
                content = "<color=#ff0000>{cur}</color><color=#ffffff>/{need}</color>";
                content = content.format({cur:taskInfo.processing,need:this._data.value});
            }
            this.descRichText.string = content;
            
        }
        else if(taskInfo.taskState == yx.proto.TaskStateType.Finish)
        {
            this.getBtn.node.active = true;
            this.descRichText.node.active = false;
        }
        else
        {
            this.getBtn.node.active = false;
            this.descRichText.node.active = true;
            this.descRichText.string = "已领取";
        }
    },

   
});
