import { XiuLianType } from "../proto/protores";

cc.Class({
    extends: cc.Component,

    properties: {
        zhiweiLabel:     cc.Label,
        shenqingBtn:      cc.Button,
    },

    init(data){
        this._menPaiPostConfig =  yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":data.ID});
        let content = "申请为{zhiwei}";
        content = content.format({zhiwei:this._menPaiPostConfig.ZhiWuName});
        this.zhiweiLabel.string = content;

        this.shenqingBtn.node.on('click',this.onShenQingBtnClick,this);
    },

    onShenQingBtnClick(){
        cc.log("申请");
        

        if(yx.menPaiMgr.currZhiWei() >= this._menPaiPostConfig.ZhiWu)
        {
            yx.ToastUtil.showListToast("已成为"+this._menPaiPostConfig.ZhiWuName);
            return;
        }
        else if(this._menPaiPostConfig.ZhiWu > yx.menPaiMgr.currZhiWei() + 1)
        {
            let nextConfig = yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":yx.menPaiMgr.currZhiWei() + 1});
            yx.ToastUtil.showListToast("需先升级为"+nextConfig.ZhiWuName);
            return;
        }


        let curConfig = yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":yx.menPaiMgr.currZhiWei()});
        let costName = yx.bagMgr.GetItemName(curConfig.Cost[0].type,curConfig.Cost[0].id);
        let content = "<color=#FFFFFF>申请成为{zhiweiName}，需要消耗{costValue}点门派{costName}！\n是否确认申请？</color>";
        
        content = content.format({zhiweiName:this._menPaiPostConfig.ZhiWuName,costValue:curConfig.Cost[0].count,costName:costName});
        yx.TextConfirm.ShowConfirm(content, yx.CodeHelper.NewClickEvent(this, "onTishengClick"));

    },

    onTishengClick()
    {
        let curConfig = yx.cfgMgr.getRecordByKey("MenPaiPostConfig", {"ZhiWu":yx.menPaiMgr.currZhiWei()});
        let ownCount = yx.bagMgr.GetItemOwnCount(curConfig.Cost[0].type,curConfig.Cost[0].id);
        let costName = yx.bagMgr.GetItemName(curConfig.Cost[0].type,curConfig.Cost[0].id);
        if(ownCount < curConfig.Cost[0].count)
        {
            yx.ToastUtil.showListToast(costName+"不足");
            return;
        }

        yx.menPaiMgr.tiShen(yx.menPaiMgr.currZhiWei()+1);
    },
});
