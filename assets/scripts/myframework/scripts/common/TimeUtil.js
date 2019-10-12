

const OneMinute = 60 * 1000;
//修炼一年等于多少秒
const YearSeconds = 900;

let _serverTime = 0;
let _createTime = 0;
let _appStartTime = 0;


let TimeUtil = {
    /**
     * 设置服务器时间，一般每次登录的时间校准一次
     * 服务器下发的是Unix时间毫秒
     */
    setServerTime(time){
        _serverTime = new Date().setTime(time);
        _appStartTime = Date.now();
        
        //如果本地时间误差超过10分钟，使用服务器时间
        if (Math.abs(_appStartTime - _serverTime) > OneMinute * 10)
        {
            _appStartTime = _serverTime;
        }
    },

    setCreateTime(time)
    {
        _createTime = new Date().setTime(time);
    },

    //获取服务器时间，注意，这里返回的值不是登录时下发的时间，会加上客户端运行的一个时间
    getServerTime(){
        return _serverTime + this._getRunTime();
    },

    //修炼了多少年
    getXiuLianYear()
    {
        return this.millis2year(this.getServerTime() - _createTime);
    },

    //
    getXiuLianYearByCreateTime(createTime){
        return this.millis2year(this.getServerTime() - createTime);
    },

    //传入过去的时间，计算得到过去的修炼时间      应用：日志的修炼时间
    getXiuLianByTime(pastTime){
        return this.millis2year(pastTime - _createTime);
    },

    getCreateTime(){
        return _createTime;
    },

    _getRunTime()
    {
        let time = Date.now() - _appStartTime;

        if (time < 0)
        {
            cc.warn("[TimeUtil getRunTime] 系统时间可能被修改");                            
        }

        return time;
    },
   

    //现实时间（分）转换成修炼时间（年）
    minutes2year(minutes)
    {
        return this.seconds2year(minutes*60);
    },

    //现实时间（秒）转换成修炼时间（年）
    seconds2year(seconds)
    {
        let year = seconds / YearSeconds;

        //统一向上取整
        return Math.ceil(year);
    },

    millis2year(millis)
    {
        return this.seconds2year(millis / 1000);
    },

    /**
     * 秒数 -> 时分秒
     * 当没有 “时” 小于0的时候，不显示 时
     * 分、秒 小于0的时候，会显示 00
     * @param value
     * @returns {string}
     */
    seconds2hourMinSecond(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime >= 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);

            //如果分钟大于60，将分钟转换成小时
            if(minuteTime >= 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }

        secondTime = this._addZero(secondTime);
        let result = "" + secondTime;

        minuteTime = this._addZero(minuteTime);
        result = "" + (minuteTime) + ":" + result;

        if(hourTime > 0) {
            hourTime = this._addZero(hourTime);
            result = "" + (hourTime) + ":" + result;
        }
        return result;
    },

    //小于10的数字 ，在前面补 0
    _addZero(value){
        value = parseInt(value);
        return value < 10 ? "0" + parseInt(value):"" + parseInt(value);
    },

    //把date数据转成timestring，精确到毫秒
    //格式14:52:32.835
    getTimeString(date){
        return "{hh}:{mm}:{ss}.{ms}".format({hh:date.getHours(), mm:date.getMinutes(), ss:date.getSeconds(), ms:date.getMilliseconds()});
    },

    //获取当前时间的字符串形式，主要用来打LOG用
    //14:52:32.835
    getNowTimeString(){
        let nowDate = new Date();

        return this.getTimeString(nowDate);
    },

    // 时间戳转日期
    TimestampToDate (timeStamp) {
        let date = new Date();
        date.setTime(timeStamp);
        // let y = date.getFullYear();
        // let m = date.getMonth() + 1;
        // let d = date.getDate();
        // let h = date.getHours();
        // let minute = date.getMinutes();
        // let second = date.getSeconds();

        return date;
    },

    // 是否同一天
    IsSameDay (timeStamp1,timeStamp2) {
        let date1 = new Date();
        date1.setTime(timeStamp1);
        let y1 = date1.getFullYear();
        let m1 = date1.getMonth() + 1;
        let d1 = date1.getDate();

        let date2 = new Date();
        date2.setTime(timeStamp2);
        let y2 = date2.getFullYear();
        let m2 = date2.getMonth() + 1;
        let d2 = date2.getDate();

        if(y1 == y2 && m1 == m2 && d1 == d2)
        {
            return true;
        }

        return false;
    },
};

module.exports = yx.timeUtil = TimeUtil;