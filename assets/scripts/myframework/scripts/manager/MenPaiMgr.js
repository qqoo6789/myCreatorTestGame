
/**
 * !#en MenPaiManager
 * !#zh 门派数据类。
 * @class MenPaiManager
 * @extends 
 */
yx.MenPaiManager = function () {
    // 自己的门派数据
    this._mineMenPaiData = {};
};

yx.MenPaiManager.prototype = {
    constructor: yx.MenPaiManager,
    /**
     * 初始化函数
     */
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.JOIN_MENPAI, this.onMessageJoinMenPai); 
        yx.network.addHandler(yx.proto.CmdId.QUIT_MENPAI, this.onMessageMenPaiExit); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI, this.onMessageMenPaiInfo); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI_START_TASK, this.onMessageDoTask);
        yx.network.addHandler(yx.proto.CmdId.MENPAI_PAY, this.onMessageMenPaiFenglu); 
        yx.network.addHandler(yx.proto.CmdId.LIANGONG, this.onMessageLianGong); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI_CHALLENGE, this.onMessageTiaoZhan); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI_PROMOTION, this.onMessageTiShengZhiWei);
        yx.network.addHandler(yx.proto.CmdId.MENPAI_SAYHI, this.onMessageQingAn); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI_STUDY_SKILL, this.onMessageXueXiSkill); 
        yx.network.addHandler(yx.proto.CmdId.MENPAI_STUDY, this.onMessageQieCuo); 
        
        yx.eventDispatch.addListener(yx.EventType.DAOLV_ZENGLI, this.onMessageZengLi, this);
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    // 加入门派
    Join(star){
        cc.log("[MenPaiManager] Join");
        let req = new yx.proto.C2S_JoinMenpai();
        req.star = star;
        yx.network.sendMessage(yx.proto.CmdId.JOIN_MENPAI, req);
    },

     // 获取门派信息
    Info(){
        cc.log("[MenPaiManager] Info");
        let req = new yx.proto.C2S_Menpai();
        yx.network.sendMessage(yx.proto.CmdId.MENPAI, req);
    },

    // 领取俸禄
    fengLu(){
        cc.log("[MenPaiManager] fengLu");
        let req = new yx.proto.C2S_MenpaiPay();
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_PAY, req);
    },

    // 挑战
    PK(lingPai){
        cc.log("[MenPaiManager] PK");
        let req = new yx.proto.C2S_MenpaiChallenge();
        req.lingPai = lingPai;
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_CHALLENGE, req);
    },

    // 叛教
    panJiao(){
        cc.log("[MenPaiManager] panJiao");
        let req = new yx.proto.C2S_QuitMenpai();
        yx.network.sendMessage(yx.proto.CmdId.QUIT_MENPAI, req);
        
    },

    // 请安
    qingAn(configId){
        cc.log("[MenPaiManager] qingAn configId=="+configId);
        let req = new yx.proto.C2S_MenpaiSayHi();
        req.id = configId; 
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_SAYHI, req);
    },

    // 切磋
    qieCuo(npcId){
        cc.log("[MenPaiManager] qieCuo npcId=="+npcId);
        let req = new yx.proto.C2S_MenpaiStudy();
        req.npcId = npcId; 
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_STUDY, req);
    },

    // 学习功法
    xueXi(IndexId){
        cc.log("[MenPaiManager] xueXi IndexId=="+IndexId);
        let req = new yx.proto.C2S_MenpaiStudySkill();
        req.gongfaId = IndexId;
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_STUDY_SKILL, req);
    },

    // 提升职位
    tiShen(zhiwei){
        cc.log("[MenPaiManager] tiShen zhiwei=="+zhiwei);
        let req = new yx.proto.C2S_MenpaiPromotion();
        req.zhiwu = zhiwei;
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_PROMOTION, req);
    },

    // 赠礼
    zengLi(npcId){
        cc.log("[MenPaiManager] zengLi npcId=="+npcId);
        let daoLvCfg = yx.cfgMgr.getRecordByKey("DaoLvListConfig", {NpcID:npcId});
        cc.log("[MenPaiManager] zengLi daoLvId=="+daoLvCfg.ID);
        
        // let req = new yx.proto.C2S_DaoLv();
        // req.cmdType = yx.proto.DaoLvCmdType.GifgGiving_Cmd;
        // req.id = daoLvCfg.ID;
        // yx.network.sendMessage(yx.proto.CmdId.DaoLv, req);

        yx.daoLvMgr.reqDaoLv(yx.proto.DaoLvCmdType.GifgGiving_Cmd,daoLvCfg.ID);
    },

    // 练功
    LianGong(id){
        cc.log("[MenPaiManager] LianGong id=="+id);
        let req = new yx.proto.C2S_Liangong();
        req.configId = id;
        yx.network.sendMessage(yx.proto.CmdId.LIANGONG, req);
    },

    // 做任务
    RenWuDo(taskId){
        cc.log("[MenPaiManager] RenWuDo taskId=="+taskId);
        let req = new yx.proto.C2S_MenpaiStartTask();
        req.taskId = taskId;
        yx.network.sendMessage(yx.proto.CmdId.MENPAI_START_TASK, req);
    },

    // 兑换奖励
    duiHuan(exchangeID){
        cc.log("[MenPaiManager] duiHuan exchangeID=="+exchangeID);
        yx.bagMgr.reqExchangeItem(exchangeID);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    // 加入门派
    onMessageJoinMenPai(errMsg, data)
    {
        cc.log("onMessageJoinMenPai-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageJoinMenPai] error:" + errMsg);
            return;
        }

        yx.menPaiMgr.Info();

    },

    // 获取门派信息
    onMessageMenPaiInfo(errMsg, data)
    {
        cc.log("onMessageMenPaiInfo-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageMenPaiInfo] error:" + errMsg);
            return;
        }
        
        let resp = yx.proto.S2C_Menpai.decode(data);
        yx.menPaiMgr.setMineMenPaiData(resp);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_INFO_REFRESH);
    },

    // 领取俸禄
    onMessageMenPaiFenglu(errMsg, data)
    {
        cc.log("onMessageMenPaiFenglu-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageMenPaiFenglu] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        let resp = yx.proto.S2C_MenpaiPay.decode(data);

        let updateData = {};
        updateData.lastPayTime = resp.payTime;
        yx.menPaiMgr.setMineMenPaiData(updateData);
        yx.ToastUtil.showListToast("领取成功");
    },

    // 叛教
    onMessageMenPaiExit(errMsg, data)
    {
        cc.log("onMessageMenPaiExit-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageMenPaiExit] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        // let resp = yx.proto.S2C_QuitMenpai.decode(data);

        yx.menPaiMgr.clearMineMenPaiData();
        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_INFO_REFRESH);
    },

    // 请安
    onMessageQingAn(errMsg, data)
    {
        cc.log("onMessageQingAn-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageQingAn] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        let resp = yx.proto.S2C_MenpaiSayHi.decode(data);

        let updateData = {};
        updateData.lastSayHiTime = resp.sayHiTime;
        yx.menPaiMgr.setMineMenPaiData(updateData);

        let menpaiConfig = yx.menPaiMgr.getMineMenPaiConfig();
        let npcZhangmenConfig = yx.menPaiMgr.GetNpcZhangMenConifg(menpaiConfig);
        let qingAnConfig =  yx.cfgMgr.getRecordByKey("MenPaiQingAnConfig", {ID:resp.id});
        if(npcZhangmenConfig)
        {
            let talkContent = "<color=#17a479>{palyerName}</color>恭恭敬敬得向{npcName}磕头请安，“师傅在上，徒儿给您请安了”。\n<color=#e7452f>{npcName}</color>微微点头示意起身。\n";
            let rewards = qingAnConfig.Reward;
            for (let index = 0; index < rewards.length; index++) {
                const element = rewards[index];
                talkContent = talkContent + yx.bagMgr.GetItemName(element.type,element.id) + "<color=#ffd066>+" + element.count + "</color>,";
            }
            talkContent = talkContent.substring(0,talkContent.length-1);

            talkContent = talkContent.format({palyerName:yx.playerMgr.getName(),npcName:npcZhangmenConfig.Name});
            yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_ADD_DAIRY_LOG,{talkContent:talkContent});
        }
        
    },

    // 学习功法
    onMessageXueXiSkill(errMsg, data)
    {
        cc.log("onMessageXueXiSkill-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageXueXiSkill] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        // let resp = yx.proto.S2C_MenpaiStudySkill.decode(data);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_SKILL_REFRESH);
    },

    // 提升职位
    onMessageTiShengZhiWei(errMsg, data)
    {
        cc.log("onMessageTiShengZhiWei-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageTiShengZhiWei] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        let resp = yx.proto.S2C_MenpaiPromotion.decode(data);
        let updateData = {};
        updateData.zhiwei = resp.zhiwu;
        yx.menPaiMgr.setMineMenPaiData(updateData);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_ZHIWEI_REFRESH);

        yx.ToastUtil.showListToast("申请成功");
    },

    // 练功
    onMessageLianGong(errMsg, data)
    {
        cc.log("onMessageLianGong-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageLianGong] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        let resp = yx.proto.S2C_Liangong.decode(data);
        yx.menPaiMgr.setLiangongData(resp.liangong);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_LIANGONG_REFRESH);
    },

    // 做任务
    onMessageDoTask(errMsg, data)
    {
        cc.log("onMessageDoTask-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageDoTask] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        
        let resp = yx.proto.S2C_MenpaiStartTask.decode(data);
        yx.menPaiMgr.setMineMenPaiData(resp);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_TASK_REFRESH);
    },

    // 挑战
    onMessageTiaoZhan(errMsg, data)
    {
        cc.log("onMessageTiaoZhan-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageTiaoZhan] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }

        let resp = yx.proto.S2C_MenpaiChallenge.decode(data);
        let updateData = {};
        updateData.challengeEndTime = resp.challengeEndTime;
        updateData.ticketEndTime = resp.ticketEndTime;
        yx.menPaiMgr.setMineMenPaiData(updateData);

        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_TIAOZHAN_REFRESH);

         // 战斗场景
         let args = {};
         args.eason = "menpai_tiaozhan";
         args.result = resp.result;
         yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_PK_SHOW,args);
    },

    //切磋 
    onMessageQieCuo(errMsg, data)
    {
        cc.log("onMessageQieCuo-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageQieCuo] error:" + errMsg);
            yx.ToastUtil.showListToast(errMsg);
            return;
        }
        
        let resp = yx.proto.S2C_MenpaiStudy.decode(data);

        cc.log("resp.result.fightInfo.defense=="+resp.result.init2.id);

        let win = resp.result.win;
        let npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {ID:resp.result.init2.id});
        let colorName = "";
        let winName = "";
        let rewardDesc = "";
        if(win)
        {
            rewardDesc = "\n";
            colorName = "#17a479";
            winName = yx.playerMgr.getName();
            var rewards = npcConfig.PkWinReward;
            for (var index = 0; index < rewards.length; index++) {
                var element = rewards[index];
                rewardDesc = rewardDesc + yx.bagMgr.GetItemName(element.type, element.id) + "<color=#ffd066>+" + element.count + "</color>,";
            }
            rewardDesc = rewardDesc.substring(0, rewardDesc.length - 1);
        }
        else
        {
            colorName = "#e7452f";
            winName = npcConfig.Name;
        }
        let content = "听闻你道法高强，今日我来请求指点一下，若有失礼之处，还望多多包涵……\n<color=#e7452f>{npcName}</color>：以武论道，岂不快哉！\n<color={colorName}}>{winName}</color>：承让！承让！{rewardDesc}"
        content = content.format({npcName:npcConfig.Name,colorName:colorName,winName:winName,rewardDesc:rewardDesc});
        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_ADD_DAIRY_LOG,{talkContent:content});

        // 战斗场景
        let args = {};
        args.eason = "menpai_qiecuo";
        args.result = resp.result;
        yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_PK_SHOW,args);

    },


    // 赠礼
    onMessageZengLi(resp)
    {
        cc.log("onMessageZengLi");
        let rlt = resp.result;
        if(rlt == null)
        {
            let daoLvId = resp.daoLvInfo[0].id;
            cc.log("daoLvId =="+daoLvId);
            let daoLvCfg = yx.cfgMgr.getRecordByKey("DaoLvListConfig", {ID:daoLvId});
            let npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {ID:daoLvCfg.NpcID});
            let talkConfig =  yx.cfgMgr.getRecordByKey("TalkListConfig", {ID:npcConfig.ZengLiSuccTalkID});
            if(talkConfig)
            {
                let content = "<color=#17a479>"+npcConfig.Name+":</color>"+talkConfig.Talk;
                // 赠礼成功
                yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_ADD_DAIRY_LOG,{talkContent:content});
            }
        }
        // else
        // {
        //     cc.log("rlt.errorCode=="+rlt.errorCode);
        //     if(rlt.errorCode == yx.proto.ErrorCodeType.NO_AVALIABLE_GIFT)
        //     {
        //         yx.ToastUtil.showListToast("没有可以赠送的礼物");
        //     }
        //     else
        //     {
        //         let daoLvId = resp.daoLvInfo[0].id;
        //         cc.log("daoLvId =="+daoLvId);
        //         let daoLvCfg = yx.cfgMgr.getRecordByKey("DaoLvListConfig", {ID:daoLvId});
        //         let npcConfig = yx.cfgMgr.getRecordByKey("NpcListConfig", {ID:daoLvCfg.NpcID});
        //         let talkConfig =  yx.cfgMgr.getRecordByKey("TalkListConfig", {ID:npcConfig.ZengLiFailTalkID});
        //         if(talkConfig)
        //         {
        //             let content = "<color=#17a479>"+npcConfig.Name+":</color>"+talkConfig.Talk;
        //             // 赠礼失败
        //             yx.eventDispatch.dispatchMsg(yx.EventType.MENPAI_ADD_DAIRY_LOG,{talkContent:content});
        //         }
        //     }
        // }
        

    },
    
    //////////////////////////////////以下逻辑接口//////////////////////////////////    

    // 获取xx星的所有门派配置
    getMenPaiListByStar(star)
    {
        let configDatas =  yx.cfgMgr.getRecordList("MenPaiConfig", {Star:star});
        return configDatas;
    },

    // 根据门派ID获取门派配置
    getMenPaiConfig(id){
        let configData =  yx.cfgMgr.getRecordByKey("MenPaiConfig", {ID:id});
        return configData;
    },  

    // 获取自己的门派配置
    getMineMenPaiConfig(){
        if(this.isOwnMenPai())
        {
            let configData =  yx.cfgMgr.getRecordByKey("MenPaiConfig", {ID:this._mineMenPaiData.menpaiId});
            return configData;
        }
        return null;
    },  

    // 设置练功数据
    setLiangongData(data){
        cc.log("data.id=="+data.id);
        if(data.id == 1)
        {
            cc.log("data.liangongStartTime=="+data.start);
            cc.log("data.liangongEndTime=="+data.end);
            this._mineMenPaiData.liangongStartTime = data.start;
            this._mineMenPaiData.liangongEndTime = data.end;
        }
        else
        {
            cc.log("data.zhangmenliangongStartTime=="+data.start);
            cc.log("data.zhangmenliangongEndTime=="+data.end);
            this._mineMenPaiData.zhangmenliangongStartTime = data.start;
            this._mineMenPaiData.zhangmenliangongEndTime = data.end;
        }
    },

    // 设置自己门派数据
    setMineMenPaiData(resp)
    {
        if(resp.menpaiId != null)
        {
            cc.log("resp.menpaiId=="+resp.menpaiId);
            this._mineMenPaiData.menpaiId = resp.menpaiId;
        }
        if(resp.zhangmenId != null)
        {
            cc.log("resp.zhangmenId=="+resp.zhangmenId);
            this._mineMenPaiData.zhangmenId = resp.zhangmenId;
        }
        if(resp.zhangmenName != null)
        {
            cc.log("resp.zhangmenName=="+resp.zhangmenName);
            this._mineMenPaiData.zhangmenName = resp.zhangmenName;
        }
        if(resp.liangong != null)
        {
            for (let index = 0; index < resp.liangong.length; index++) {
                const element = resp.liangong[index];
                this.setLiangongData(element);
            }
        }
        if(resp.taskId != null)
        {
            cc.log("resp.taskId=="+resp.taskId);
            this._mineMenPaiData.taskId = resp.taskId;
        }
        if(resp.taskStartTime != null)
        {
            cc.log("resp.taskStartTime=="+resp.taskStartTime);
            this._mineMenPaiData.taskStartTime = resp.taskStartTime;
        }
        if(resp.lastPayTime != null)
        {
            cc.log("resp.lastPayTime=="+resp.lastPayTime);
            this._mineMenPaiData.lastPayTime = resp.lastPayTime;
        }
        if(resp.lastSayHiTime != null)
        {
            cc.log("resp.lastSayHiTime=="+resp.lastSayHiTime);
            this._mineMenPaiData.lastSayHiTime = resp.lastSayHiTime;
        }
        
        if(resp.zhiwei != null)
        {
            cc.log("resp.zhiwei=="+resp.zhiwei);
            this._mineMenPaiData.zhiwei = resp.zhiwei;
        }

        if(resp.zhangmenIcon != null)
        {
            cc.log("resp.zhangmenIcon=="+resp.zhangmenIcon);
            this._mineMenPaiData.zhangmenIcon = resp.zhangmenIcon;
        }

        if(resp.challengeEndTime != null)
        {
            cc.log("resp.challengeEndTime=="+resp.challengeEndTime);
            this._mineMenPaiData.challengeEndTime = resp.challengeEndTime;
        }

        if(resp.ticketEndTime != null)
        {
            cc.log("resp.ticketEndTime=="+resp.ticketEndTime);
            this._mineMenPaiData.ticketEndTime = resp.ticketEndTime;
        }

    },

    // 清空自己门派数据
    clearMineMenPaiData(){
        this._mineMenPaiData = {};
    },

    // 获取自己门派数据
    getMineMenPaiData(){
        return this._mineMenPaiData;
    },

     // 是否已经加入门派
    isOwnMenPai()
    {
        if(this._mineMenPaiData.menpaiId && this._mineMenPaiData.menpaiId != 0)
        {
            return true;
        }
        return false;
    },

    // 获取门派贡献
    getGongXian(){
        return yx.playerMgr.getCurrency(yx.CyType.GONGXIAN);
    },

    // 获取今日是否已经领取俸禄
    HasGetFenglu(){
        if(yx.timeUtil.IsSameDay(this._mineMenPaiData.lastPayTime,yx.timeUtil.getServerTime()))
        {
            return true;
        }
        return false;
    },
    
     // 代理掌门信息
     DaiLiZhangMen(){
        if(this._mineMenPaiData.zhangmenName)
        {
            return {Name:this._mineMenPaiData.zhangmenName,Icon:this._mineMenPaiData.zhangmenIcon};
        }
        return null;
    },


    // 获取今日是否请安
    HasQingAn(){
        if(yx.timeUtil.IsSameDay(this._mineMenPaiData.lastSayHiTime,yx.timeUtil.getServerTime()))
        {
            return true;
        }
        return false;
    },

    // 我当前的职位
    currZhiWei(){
        return this._mineMenPaiData.zhiwei;
    },

    // 获取已兑换次数
    getExchangeCount(ID){
        return yx.bagMgr.getExchangeAmount(ID) ;
    },

    // 当前任务ID
    CurrRenWu()
    {
        return this._mineMenPaiData.taskId;
    },

    // 任务开始时间
    RenWuStartTime()
    {
        return this._mineMenPaiData.taskStartTime;
    },

    // 练功的开始时间
    LianGongStartTime()
    {
        return this._mineMenPaiData.liangongStartTime;
    },

    // 练功的结束时间
    LianGongEndTime()
    {
        return this._mineMenPaiData.liangongEndTime;
    },
  
    // 掌门练功的开始时间
    ZhangMenLianGongStartTime()
    {
        return this._mineMenPaiData.zhangmenliangongStartTime;
    },

    // 掌门练功的结束时间
    ZhangMenLianGongEndTime()
    {
        return this._mineMenPaiData.zhangmenliangongEndTime;
    },
      
    // 挑战冷却结束时间
    PKEndTime(){
        if(this._mineMenPaiData.challengeEndTime)
        return this._mineMenPaiData.challengeEndTime;
    return 0;
    },

    // 挑战令冷却结束时间
    TiaoZhanLingEndTime(){
        if(this._mineMenPaiData.ticketEndTime)
            return this._mineMenPaiData.ticketEndTime;
        return 0;
    },
    
    // 获取Npc掌门Config
    GetNpcZhangMenConifg(menpaiConfig)
    {
        let npcs = menpaiConfig.Npc;
        for (let index = 0; index < npcs.length; index++) {
            const element = npcs[index];
            let npcCfg = yx.cfgMgr.getRecordByKey("NpcListConfig", {ID:element.ID});
            if(npcCfg.ZhiWuID == 1)
            {
                return npcCfg;
            }
        }

        return null;
    },

    // 是否道侣
    IsDaoLv(npcId)
    {
        let daoLvCfg = yx.cfgMgr.getRecordByKey("DaoLvListConfig", {NpcID:npcId});
        if(daoLvCfg)
        {
            return true;
        }

        return false;
    },

};

/**
 * !#en MenPaiManager
 * !#zh 门派数据类。
 * @property menPaiMgr
 * @type {MenPaiManager}
 */
yx.menPaiMgr = new yx.MenPaiManager();

module.exports = yx.menPaiMgr;