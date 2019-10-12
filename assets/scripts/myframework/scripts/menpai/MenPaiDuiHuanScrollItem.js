
let _titleString = "{Id}={name}";



cc.Class({
    extends: cc.Component,

    properties: {
        duihuanBtn:      cc.Button,
        duihuanLabel:    cc.Label,
        rewardNode:      cc.Node,
        cailiaoNode1:      cc.Node,
        cailiaoNode2:      cc.Node,
        cailiaoNode3:      cc.Node,
    },

    init(data){
        this.duihuanBtn.node.on('click',this.onDuihuanBtnClick,this);

        this._data = data;
        this._costNodes = [this.cailiaoNode1,this.cailiaoNode2,this.cailiaoNode3];

        let itemInfo = {};
        itemInfo["content"] = ""+data.GetReward[0].count;
        itemInfo["ID"] = data.GetReward[0].id;
        yx.ItemRichTextWidget.CreateItemSlot(itemInfo, this.rewardNode, "reward_1",null);

        for (let index = 0; index < 3; index++) {
            if(index < data.Cost.length)
            {
                const element = data.Cost[index];
                let itemInfo1 = {};
                let itemId = element.id;
                if(element.type == 0)
                {
                    itemId = itemId + 80000;
                }
                let count = yx.bagMgr.GetItemOwnCount(element.type,element.id);
                itemInfo1["content"] = count +"/"+element.count;
                itemInfo1["ID"] = itemId;

                yx.ItemRichTextWidget.CreateItemSlot(itemInfo1, this._costNodes[index], "cailiao_1",null);
            }
            else
            {
                this._costNodes[index].active = false;
            }
        }

        this.duihuanLabel.string = yx.menPaiMgr.getExchangeCount(this._data.ID)+"/"+ data.DayNum;

    },

    onDuihuanBtnClick(){
        cc.log("兑换");

        if(yx.menPaiMgr.getExchangeCount(this._data.ID)>= this._data.DayNum)
        {   
            yx.ToastUtil.showListToast("剩余兑换次数不足");
            return;
        }

        let enough = true;
        for (let index = 0; index < this._data.Cost.length; index++) {
            if(index < this._data.Cost.length)
            {
                let element = this._data.Cost[index];
                let ownCount = yx.bagMgr.GetItemOwnCount(element.type,element.id);;
                if(ownCount < element.count)
                {
                    enough = false;
                    break;
                }
            }
            
        }

        if(!enough)
        {   
            yx.ToastUtil.showListToast("兑换材料不足");
            return;
        }

        yx.menPaiMgr.duiHuan(this._data.ID);
    },

    refreshExchange(){
        this.duihuanLabel.string = yx.menPaiMgr.getExchangeCount(this._data.ID)+"/"+ this._data.DayNum;
    },
});
