
/**
 * !#en ActivityManager
 * !#zh 活动数据类。
 * @class ActivityManager
 * @extends 
 */
yx.ActivityManager = function () {

};

yx.ActivityManager.prototype = {
    constructor: yx.ActivityManager,
    /**
     * 初始化函数
     */
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.ACTIVITY_CONFIG, this.onMessageActivity); 
        yx.network.addHandler(yx.proto.CmdId.PLAYER_TASK, this.onMessagePlayerTask); 

        this._activityList = null;
        this._taskMap = null;
    },

    //////////////////////////////////以下是请求//////////////////////////////////

    // 活动信息
    Info(){
        cc.log("ActivityManager  Info")
        let req = new yx.proto.C2S_Activity();
        req.cmdType = yx.proto.ActivityCmdType.GetActivityConfig_Cmd;
        yx.network.sendMessage(yx.proto.CmdId.ACTIVITY_CONFIG, req);

    },


    // 获取所有任务状态
    TaskInfo(){
        cc.log("ActivityManager  TaskInfo")
        let req = new yx.proto.C2S_PlayerTask();
        req.cmdTyp = yx.proto.PlayerTaskCmdType.GetPlayerTask_Cmd;
        yx.network.sendMessage(yx.proto.CmdId.PLAYER_TASK, req);
        
    },

     // 领取任务奖励
     TaskReward(id,index){
        cc.log("ActivityManager  TaskReward id=="+id+",index="+index)
        let req = new yx.proto.C2S_PlayerTask();
        req.cmdTyp = yx.proto.PlayerTaskCmdType.Received_Cmd;
        req.id = id;
        req.index = index;
        yx.network.sendMessage(yx.proto.CmdId.PLAYER_TASK, req);
    },

    //////////////////////////////////以下是消息处理//////////////////////////////////

    // 更新活动状态
    onMessageActivity(errMsg, data)
    {
        cc.log("onMessageActivity-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessageActivity] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_Activity.decode(data);
        yx.ActivityMgr.updateList(resp);
        
    },

    // 更新活动任务状态
    onMessagePlayerTask(errMsg, data)
    {
        cc.log("onMessagePlayerTask-----");
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[MenPaiMgr onMessagePlayerTask] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_PlayerTask.decode(data);
        yx.ActivityMgr.updateTaskList(resp);
    },

    //////////////////////////////////以下逻辑接口//////////////////////////////////    

    updateList(resp){
        this._activityList = [];
        
        for (let index = 0; index < resp.activityConfig.length; index++) {
            const element = resp.activityConfig[index];
            if(element.avalid)
            {
                let acfg = yx.cfgMgr.getOneRecord("ActivityConfig",{ID:element.id});
                this._activityList.push({id:element.id,type:acfg.activityType,fileName:"ActivityType"+acfg.activityType+"Config"});
            }    
        }

        yx.eventDispatch.dispatchMsg(yx.EventType.ACTIVITY_REFRESH);


        if(this._taskMap == null)
        {
            yx.ActivityMgr.TaskInfo();
        }
    },

    updateTaskList(resp){

        if(this._taskMap == null)
        {
            this._taskMap = {};
        }

        let taskinfoArr = resp.taskInfo;
        for (let index = 0; index < taskinfoArr.length; index++) {
            const element = taskinfoArr[index];
            if(this._taskMap[element.id] == null)
            {
                this._taskMap[element.id] = {};
            }
            this._taskMap[element.id][element.index] = element;
        }
        
        yx.eventDispatch.dispatchMsg(yx.EventType.ACTIVITY_TASK_REFRESH);
    },

    // 获取活动列表
    getList()
    {
        return this._activityList;
    },

    // 获取指定活动的所有任务配置
    getTasks(fileName)
    {
        cc.log("fileName="+fileName);
        let list = yx.cfgMgr.getAllConfig(fileName);
        return list;
    },

    // 
    getTaskInfo(id,index){
        if(this._taskMap && this._taskMap[id] && this._taskMap[id][index])
            return this._taskMap[id][index];

        return null;
    },
};

/**
 * !#en ActivityManager
 * !#zh 活动数据类。
 * @property ActivityMgr
 * @type {ActivityManager}
 */
yx.ActivityMgr = new yx.ActivityManager();

module.exports = yx.ActivityMgr;