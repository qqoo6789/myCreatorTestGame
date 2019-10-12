/**
 *
 * 时间进度条
 * 由于 update /this.schedule 方法，在本node 节点或者父节点被隐藏active=false的时候，是不会再被执行。
 * 所以这里应采取canvas.schedule的调度。
 * 这里采取一个map来保存多个进度的调度。所以这里使用_uniqueKey代表当前调度是操作哪一个，来判断目前是不是正在执行中,避免了多次调用导致的多个重复调度。
 * 为了通用性，具体的调度实现通过callback来调用，在通过refresh来刷新此进度条显示。
 * 参数 1 _uniqueKey - 唯一值，避免开启多个调度
 *     2 data 必须包含 curTime ,maxTime 表示当前时间与最大时间
 *     3 contentStr 【正在修炼中 00:43】   ,contentStr 表示的正是 “正在修炼中”
 *     4 cb 外部传进来的回调, 因为使用的调度器室在canvas的，那么记得在回调里需要注意调用unSchedule 解除调度；
 */

let TimeProBarWidget = cc.Class({
    extends: cc.Component,

    statics:{
        _scheduleMap:new Map(),
    },

    properties: {
        contentTimeLabel:cc.Label,
        progressBar:cc.ProgressBar,
    },

    //更新数据以及开始计时
    updateAndBegin(uniqueKey,data,contentStr,cb,endStr){
        if (data["curTime"] < 0){
            return;
        }

        if (!contentStr){
            contentStr = "";
        }

        if (!endStr){
            endStr = "";
        }

        this.cb = cb;
        this._uniqueKey = uniqueKey;
        //更新数据
        this._data = data;
        this.contentStr = contentStr;
        this.endStr = endStr;

        //粗略的，每一秒调一次(重开panel的时候，重新拉取服务器数值即可)
        let timeProBarSrc = TimeProBarWidget._scheduleMap.get(this._uniqueKey);

        //当前实例已经在开启调度器了，那就不必再开了
        if (timeProBarSrc){
            return;
        }

        //初始化（调度器在1秒之后才开始，这里先初始化设置）
        this.refresh(this._data.curTime,this._data.maxTime);

        //开启调度器
        this.scheduleCallback = this._progressCallBack.bind(this);
        cc.Canvas.instance.schedule(this.scheduleCallback, 1, cc.macro.REPEAT_FOREVER, 0);

        //标志当前唯一指示为已开启调度
        TimeProBarWidget._scheduleMap.set(this._uniqueKey,true);

    },

    refresh(curTime,maxTime,contentStr,endStr){
        this.progressBar.progress = curTime / maxTime;

        if (contentStr && contentStr.length > 0){
            this.contentStr = contentStr;
        }
        if (endStr && endStr.length > 0){
            this.endStr = endStr;
        }

        this.contentTimeLabel.string = this.contentStr+" "+yx.timeUtil.seconds2hourMinSecond(this._data.curTime)+this.endStr;

    },

    _progressCallBack(){
        this.cb(this,this._data);
    },

    /**
     *
     */
    unSchedule(){
        //标志当前表示为 未调度
        cc.Canvas.instance.unschedule(this.scheduleCallback);
        TimeProBarWidget._scheduleMap.set(this._uniqueKey,false);
    }

});
