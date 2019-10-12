
//功法类型对应增加的属性类型 不包含招式和门派技能
const GongFaDefaultType = {
    [2]: 2,//秘籍-攻击
    [3]: 4,//遁术-闪避
    [4]: 6,//绝学-修炼效率
    [5]: 1,//心经-生命
    [6]: 3,//真诀-防御
    [7]: 7,//残页-灵气获取
};

const MenPaiDefaultType = [3, 2, 1, 4];

/**
 * !#en GongFaManager
 * !#zh 功法数据类。
 * @class GongFaManager
 * @extends 
 */
yx.GongFaManager = function () {
    this._meipaiSkillInfo = null;
    this._gongfaList = {};
    this._curZhaoShi = 0;
};

yx.GongFaManager.prototype = {
    constructor: yx.GongFaManager,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.GONG_FA, this.onMessageGongFaInfo);
        yx.network.addHandler(yx.proto.CmdId.ADD_MEN_PAI_SKILL_NUM, this.onMessageAddMenPaiSkillNum);
        //yx.network.addHandler(yx.proto.CmdId.DELETE_MEN_PAI_SKILL, this.onMessageDeleteMenPaiSkill);    
        //yx.network.addHandler(yx.proto.CmdId.UPGRADE_GONG_FA, this.onMessageUpgradeGongFa);   
        //yx.network.addHandler(yx.proto.CmdId.CHANGE_ZHAO_SHI, this.onMessageChangeZhaoShi);   
        yx.network.addHandler(yx.proto.CmdId.GONG_FA_CHANGE, this.onMessageGongFaChange);  
        
    },

    getMenPaiSkillNum(){
        if (this._meipaiSkillInfo)
        {            
            return this._meipaiSkillInfo.Num;
        }
        return 6;
    },

    getNextSkillInfo(){
        let nextId = this._meipaiSkillInfo.ID + 1;

        return yx.cfgMgr.getRecordByKey("SkillNumConfig", {ID:nextId});
    },

    setMenPaiSkillNumId(id)
    {
        let record = yx.cfgMgr.getRecordByKey("SkillNumConfig", {ID:id});

        if (record)
        {
            this._meipaiSkillInfo = record;
        }
        else
        {
            cc.warn("[GongFaMgr setMenPaiSkillNumId] can't find record");
        }
    },

    initGongFaInfo(info){
        this.setMenPaiSkillNumId(info.skillNumID);

        for (let gongfa of info.gongFaInfo)
        {   
            this.addGongFa(gongfa);
        }

        this.setCurZhaoShi(info.zhaoShi);
    },

    getGongFa(type, id)
    {
        if (this._gongfaList[type])
        {
            return this._gongfaList[type].get(id);
        }

        return null;
    },

    setCurZhaoShi(id){
        this._curZhaoShi = id;
    },

    getCurZhaoShi(){
        return this._curZhaoShi;
    },

    /**
     * 判断某个功法是否学习过
     * @param {Number} type 功法类型
     * @param {Number} id 功法ID
     */
    hasLearn(type, id)
    {
        return this.getGongFa(type, id) != null;
    },

    /**
     * 判断某个功法是否学习过
     * @param {Number} type 功法类型
     * @param {Number} id 功法ID
     */
    hasLearnByIndex(index)
    {
        let cfg = yx.cfgMgr.getRecordByKey("SkillConfig", {Index:index});

        if (cfg)
        {
            return this.hasLearn(cfg.Type, cfg.ID);
        }

        return false;
    },

    addGongFa(gongfaMsg){
        if (this.hasLearn(gongfaMsg.gongFaType, gongfaMsg.id))
        {
            return;
        }

        if (!this._gongfaList[gongfaMsg.gongFaType])
        {
            this._gongfaList[gongfaMsg.gongFaType] = new Map();
        }
      
        //把功法表数据先存好
        let gongfaInfo = yx.cfgMgr.getRecordByKey("SkillConfig", {ID:gongfaMsg.id, Type:gongfaMsg.gongFaType});     

        gongfaMsg.cfg = gongfaInfo;

        this._gongfaList[gongfaMsg.gongFaType].set(gongfaMsg.id, gongfaMsg);        
    },

    getGongFaAdd(gongfaMsg){
        if (gongfaMsg && gongfaMsg.cfg)
        {
            return gongfaMsg.cfg.BaseAttr[0].value + gongfaMsg.cfg.AddAttr[0].value * (gongfaMsg.level - 1);
        }
        return 0;
    },

    getWuXingAdd(gongfaMsg){
        if (gongfaMsg && gongfaMsg.cfg)
        {
            return yx.wudaoMgr.getAttrAdd(gongfaMsg.cfg.WuXingType) * gongfaMsg.cfg.Star;
        }
        
        return 0;
    },

    //改变等级，增加的属性重新计算
    changeGongFa(info){
        let gongfaMsg = this.getGongFa(info.gongFaType, info.id);

        if (gongfaMsg)
        {
            gongfaMsg.level = info.level;     
        }
    },

    deleteGongFa(info){
        if (this._gongfaList[info.gongFaType])
        {
            this._gongfaList[info.gongFaType].delete(info.id);
        }
    },

    //获取某种类型的全部功法 没排序
    getGongFaByType(type){
        if (this._gongfaList[type])
        {
            return Array.from(this._gongfaList[type].values());
        }

        return new Array();
    },

    //返回值是一个Map
    calGongFaAttrByType(type)
    {
        if (type == yx.proto.GongFaType.ZhaoShi)
        {
            return null;
        }

        let attrList = {};

        if (type == yx.proto.GongFaType.MenPai)
        {
            for (let attrType of MenPaiDefaultType)
            {
                attrList[attrType] = 0;
            }
        }
        else
        {
            attrList[GongFaDefaultType[type]] = 0;
        }

        let gongfaList = this.getGongFaByType(type);       

        if (gongfaList)
        {
            // "AddAttr": [{
            //     "type": 2,
            //     "value": 4
            // }],
            // "BaseAttr": [{
            //     "type": 2,
            //     "value": 30
            // }],
            //"WuXingType": 1,
            gongfaList.forEach(gongfaMsg => {
                let gongfaInfo = gongfaMsg.cfg;

                if (gongfaInfo)
                {
                    let attrType = gongfaInfo.BaseAttr[0].type;

                    if (gongfaInfo.BaseAttr[0].type == gongfaInfo.AddAttr[0].type && attrList[attrType] >= 0)
                    {
                        attrList[attrType] += this.getWuXingAdd(gongfaMsg) + this.getGongFaAdd(gongfaMsg);
                    }             
                }
            });
        }

        return attrList;
    },



    //////////////////////////////////以下是请求//////////////////////////////////

    reqGongFaInfo(){
        let req = new yx.proto.C2S_GetGongFa();

        yx.network.sendMessage(yx.proto.CmdId.GONG_FA, req);
    },

    reqAddMenPaiSkill(){
        let req = new yx.proto.C2S_AddMenPaiSkillNumID();

        yx.network.sendMessage(yx.proto.CmdId.ADD_MEN_PAI_SKILL_NUM, req);
    },

    //升级功法
    reqGongFaUpgrade(type, id){
        yx.gongfaMgr.reqGongFaChange(yx.proto.GongFaCmdType.UpGradeSkill, type, id);
    },

    //改变当前招式
    reqChangeZhaoShi(id){
        yx.gongfaMgr.reqGongFaChange(yx.proto.GongFaCmdType.ChangeZhaoShi, yx.proto.GongFaType.ZhaoShi, id);
    },

    //遗忘门派功法
    reqForgetMenPaiGongFa(id){
        yx.gongfaMgr.reqGongFaChange(yx.proto.GongFaCmdType.DeleteMenPaiSkill, yx.proto.GongFaType.MenPai, id);
    },

    reqGongFaChange(opType, gongfaType, id){
        let req = new yx.proto.C2S_GongFaChange();
        req.operateType = opType;
        req.gongFaType = gongfaType;
        req.id = id;

        yx.network.sendMessage(yx.proto.CmdId.GONG_FA_CHANGE, req);
    },

    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageGongFaInfo(errMsg, data){
        let resp = yx.proto.S2C_GetGongFa.decode(data);

        yx.gongfaMgr.initGongFaInfo(resp);

        yx.eventDispatch.dispatchMsg(yx.EventType.GONG_FA, resp);
    },

    onMessageAddMenPaiSkillNum(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[GongFaMrg onMessageAddMenPaiSkillNum] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_AddMenPaiSkillNumID.decode(data);

        yx.gongfaMgr.setMenPaiSkillNumId(resp.skillNumID);

        yx.eventDispatch.dispatchMsg(yx.EventType.ADD_MEN_PAI_SKILL_NUM);
    },

    onMessageGongFaChange(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[GongFaMrg onMessageGongFaChange] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_GongFaChange.decode(data);

        switch (resp.operateType)
        {
            case yx.proto.GongFaCmdType.AddSkill:
                yx.gongfaMgr.addGongFa(resp.gongFaInfo);
                break;
            case yx.proto.GongFaCmdType.UpGradeSkill:
                yx.gongfaMgr.changeGongFa(resp.gongFaInfo);
                break;
            case yx.proto.GongFaCmdType.DeleteMenPaiSkill:
                yx.gongfaMgr.deleteGongFa(resp.gongFaInfo);
                break;
            case yx.proto.GongFaCmdType.ChangeZhaoShi:
                //let oldZhaoShi = yx.gongfaMgr.getCurZhaoShi();
                yx.gongfaMgr.setCurZhaoShi(resp.zhaoShi);
                break;
            default:
                return;
        }

        yx.eventDispatch.dispatchMsg(yx.EventType.GONG_FA_CHANGE, resp);
    },
};

/**
 * !#en GongFaManager
 * !#zh 功法数据类。
 * @property gongfaMgr
 * @type {GongFaManager}
 */
yx.gongfaMgr = new yx.GongFaManager();

module.exports = yx.gongfaMgr;