/**
 * 配置表的key与index映射关系
 * 注意 function里面的参数顺序要与keys数组里面的key一致
 */
let _configKeyMap = {
    CharacterAvatarConfig:{
        keys: ["ZhongZu", "Level"],
        calIndex: function (ZhongZu, Level) {
            return ZhongZu + Level * 100;
        }
    },
	CuiTiConfig: {
        keys: ["Level"],      
    },
    DiZiLevelConfig:{
        keys: ["Level"],
    },
	DongFuBuildConfig: {
        keys: ["Type"],
    },
	DongFuConfig: {
        keys: ["Type", "Level"],
        calIndex: function (type, level) {
            return type + level * 10000;
        }
    },
	DuJieConfig: {
        keys: ["Level"],
    },
    DropConfig:{
        keys: ["ID"],
    },
    DaoLvSkillStepConfig: {
        keys: ["SkillID", "Step"],
        calIndex: function (SkillID, Step) {
            return SkillID + Step * 10000;
        }
    },
	DaoLvSkillRewardConfig: {
        keys: ["SkillID", "Step1OpID", "Step2OpID", "Step3OpID"],
        calIndex: function (SkillID, Step1OpID, Step2OpID, Step3OpID) {
            return SkillID * 1 + Step1OpID * 100 + Step2OpID * 10000 + Step3OpID * 1000000;
            //return SkillID + Step1OpID + Step2OpID + Step3OpID * 10000;
        }
    },
	DaoLvSkillStepTxtConfig: {
        keys: ["OpID"],
    },
    
	DongFuOrderConfig: {
        keys: ["Type"],
    },
    EquipConfig:{
        keys: ["ID"],
    },
    ExchangeConfig:{
        keys: ["ID"],
    },
    FishDesConfig: {
        keys: ["PiaoType"],
    },
	GuaXiangConfig: {
        keys: ["Type", "Level"],
        calIndex: function (Type, Level) {
            return Type + Level * 100;
        }
    },
    HeiShiItemConfig:{
        keys: ["ID"],
    },
    HuoLangConfig:{
        keys: ["YouLiId", "Top"],
        calIndex: function (YouLiId, Top) {
            return YouLiId + Top * 1000;
        }
    },
    LianQiFormulaConfig:{
        keys:["ID"],
    },
    LianQiLuConfig: {
        keys: ["PinZhi"],
    },    
	LianQiLevelConfig: {
        keys: ["Level"],
    },
    LianYaoFormulaConfig:{
        keys:["ID"],
    },   
	LianYaoLevelConfig: {
        keys: ["Level"],
    },
	LianYaoLuConfig: {
        keys: ["PinZhi"],
    },
    LiLianMonsterConfig:{
        keys: ["ID"],
    },
    LiLianMapRewardConfig:{
        keys: ["ID"],
    },
    ItemConfig:{
        keys: ["ID"],
    },
	MenpaiLevelConfig: {
        keys: ["Star"],
    },
	MenPaiPostConfig: {
        keys: ["ZhiWu"],
    },
    MiJingEventConfig:{
        keys: ["EventID"],
    },    
    MiJingListConfig:{
        keys: ["ID"],
    },
    MonsterAttrConfig:{
        keys: ["ID"],
    },
    NpcListConfig:{
        keys: ["ID"],
    },
    PkgLevelConfig: {
        keys: ["Level"],
    },
    QiYuListConfig:{
        keys: ["ID"],
    },
	QiYuRateConfig: {
        keys: ["LevelFrom"],
    },
    QiYuRewardConfig:{
        keys: ["ID"],
    },
    ResConfig:{
        keys:["ID"],
    },
    ShopListConfig:{
        keys: ["ID", "Type", "Layer"],
        calIndex: function (ID, Type, Layer) {
            return ID + Type * 1000 + Layer * 100000;
        }
    },
    SkillConfig:{
        keys:["ID", "Type"],
        calIndex: function (ID, Type) {
            return ID + Type * 10000;
        }
    },
    SkillUpdateConfig: {
        keys: ["Level"],
    },
    ShiJieEventList:{
        keys: ["ID"],
    },
    TalkListConfig:{
        keys: ["ID"],
    },
    WuDaoAttrConfig: {
        keys: ["Type", "Level"],
        calIndex: function (type, level) {
            return type + level * 10000;
        }
    },
	WuDaoChingConfig: {
        keys: ["Level"],
    },
	WuDaolevelConfig: {
        keys: ["Level"],
    },
	WuDaoProficiencyConfig: {
        keys: ["Level"],
    },
    WuDaoBookConfig:{
        keys: ["ID"],
    },
    XianFangListConfig:{
        keys: ["ID", "Type", "Layer"],
        calIndex: function (ID, Type, Layer) {
            return ID + Type * 1000 + Layer * 100000;
        }
    },
    XianPuExpandConfig: {
        keys: ["Times"],
    },
    XiSuiConfig:{
        keys: ["Jie", "Num"],
        calIndex: function (Jie, Num) {
            return Jie * 100 + Num;
        }
    },
    YouLITownConfig:{
        keys: ["ID"],
    },
    YouLiEventConfig:{
        keys: ["ID"],
    },
    ZongMenNiTiConfig:{
        keys: ["ID"],
    },
    ZongMenWudaoConfig:{
        keys: ["ID"],
    },

    FuncOpenConfig:{
        keys:["ID"],
    },
    LiLianMapConfig:{
        keys:["ID"],
    },
    PayItemConfig:{
        keys:["ID"],
    },
    FengYinBossConfig:{
        keys:["ID"],
    },
    FengYinBossDamageConfig:{
        keys:["ID"],
    },
    DaoLvListConfig:{
        keys:["ID"],
    },
    DaoLvNatureConfig:{
        keys:["ID"],
    },
    DaoLvPhysiqueConfig:{
        keys:["ID"],
    },
    LiLianGuaJiRewardConfig:{
        keys:["ID"],
    },
};

//配置表名映射关系
let _configNameMap = {
    //test code
    HeiShiItemDef: "HeiShiItemDef2",
    MonDef: "MonDef2",
    LingGenDef: "LingGenDef2",
    DongFuBuildDef: "DongFuBuildDef2",
    ItemDef: "ItemDef2",
    QiYuLevelDef: "QiYuLevelDef2"
};

/**
 * !#en ConfigManager
 * !#zh 窗口管理类。
 * @class ConfigManager
 * @extends 
 */
let ConfigManager = function () {
    this._init = false;
    this._cfgs = null;
};

ConfigManager.prototype = {
    constructor: ConfigManager,
    /**
     * 初始化函数
     * 预先加载完所有表格数据，并按key做好索引
     */
    init: function () {
        cc.log("configmanager init");
        this._cfgs = new Map();

        var self = this;

        //因为cocos creator只有异步加载，所以在初始化时全部加载，防止要用的时候等数据
        cc.loader.loadResDir("config", function(error, resource, urls)
        {
            if (error != null)
            {
                cc.error("ConfigManager Init loadResDir error", error);            
            }
            else
            {
                for (var i = 0; i < resource.length; i++)
                {
                    if (resource[i] instanceof cc.JsonAsset)
                    {
                        self._setCfg(resource[i]._name, resource[i].json);
                    }
                }                

                self._init = true;
                cc.log("ConfigManager Init loadResDir complete res count:" + resource.length + " succ cfg count:" + self._cfgs.size);       
            }
        });
    },

  
    /**
     * 把json文件里读出来的数据处理后存到map里面，方便使用时查找
     * @param {String} cfgName 配置表名
     * @param {Array} jsonArray json文件里读出来数据
     */
    _setCfg(cfgName, jsonArray)
    {
        //原始的jsonObject是一个数组，不利于查找数据，要改造一下

        let cfgMap = new Map();

        let keyAndIndex = this._getKeyAndIndex(cfgName);

        if (jsonArray.length > 100 && keyAndIndex == null)
        {
            cc.error("一百条以上的数据需要添加索引信息方便查找:" + cfgName + ":" + JSON.stringify(jsonArray[0]));
            return;
        }

        for (var i = 0; i < jsonArray.length; i++)
        {
            let obj = jsonArray[i];

            let index = i;
            
            if (keyAndIndex)
            {
                index = this._genIndex(keyAndIndex, obj);
            }

            if (index < 0)
            {
                index = i;
            }
         
            if (CC_DEBUG)
            {
                if (cfgMap.has(index))
                {
                    cc.error("Config:" + cfgName + " 重复索引:" + JSON.stringify(obj));
                    return;
                }
            }
            cfgMap.set(index, obj);        
        }

        this._cfgs.set(cfgName, cfgMap);
    },

    _getKeyAndIndex(cfgName){
        let keyAndIndex = _configKeyMap[cfgName];

        if (!keyAndIndex)
        {
            return null;
        }

        if (!keyAndIndex.keys)
        {
            //keyAndIndex.keys = null;// ["ID"];
            return null;
        }
            
        if (keyAndIndex.calIndex == undefined)
        {
            keyAndIndex.calIndex = function(id){
                return id;
            };
        }

        return keyAndIndex;
    },

    //从一个obj中找出几个key，并按索引计算方法得到真正的索引值
    _genIndex(keyAndIndex, obj)
    {
        //如果参数没有达到索引函数的接收参数长度，这是有问题的
        if (keyAndIndex == null 
            || keyAndIndex.keys == null
            || keyAndIndex.keys.length != keyAndIndex.calIndex.length)
        {
            cc.warn("[ConfigManager _genIndex] keys length not same the calIndex func length");
            return -1;
        }

        let valueArray = new Array();

        for (let i = 0; i < keyAndIndex.keys.length; i++)
        {
            let value = obj[keyAndIndex.keys[i]];

            if (value == undefined)
            {
                cc.warn("[ConfigManager _genIndex] obj is not have the key:" + keyAndIndex.keys[i]);
                return -2;
            }

            valueArray.push(value);
        }

        let finalIndex = 0;

        switch (valueArray.length)
        {
            case 1:
                finalIndex = keyAndIndex.calIndex(valueArray[0]);
            break;
            case 2:
                finalIndex = keyAndIndex.calIndex(valueArray[0], valueArray[1]);
            break;
            case 3:
                finalIndex = keyAndIndex.calIndex(valueArray[0], valueArray[1], valueArray[2]);
            break;
            case 4:
                finalIndex = keyAndIndex.calIndex(valueArray[0], valueArray[1], valueArray[2], valueArray[3]);
            break;
            default:
                //最多四个Key决定索引，再多或者没有都不行
                cc.warn("[ConfigManager _genIndex] key length error len:" + valueArray.length);
                return -3;
            break;
        }

        return finalIndex;
    },

    _getRealCfg(cfgName)
    {
        if (this._init == false)
        {
            return null;
        }

        if (_configNameMap[cfgName] != undefined)
        {
            cfgName = _configNameMap[cfgName];
        }

        return this._cfgs.get(cfgName);
    },

    /**
     * 根据字段名和索引号在指定表中查找某一条记录 
     * 注意：老接口，建议用getOneRecord或者getRecordList代替
     * @param {String} cfgName 配置表名
     * @param {Object} findObj 要查找的关键字对象 类似{ID:1}或者{Type:2, Level:10}
     */
    getRecordByKey(cfgName, findObj)
    {
        return this.getOneRecord(cfgName, findObj);     
    },

    /**
     * 根据条件在指定表中查找某一条记录
     * @param {String} cfgName 配置表名
     * @param {Object} findObj 要查找的关键字对象 类似{ID:1}或者{Type:2, Level:10}
     */
    getOneRecord(cfgName, findObj){
        if (findObj == null)
        {
            cc.warn("[ConfigManager getRecordByKey] findObj null");
            return null;
        }

        if (findObj.constructor == Number)
        {
            findObj = {ID:findObj};
        }

        if (findObj.constructor != Object)
        {
            cc.warn("[ConfigManager getRecordByKey] findObj error");
            return null;
        }

        let cfg = this._getRealCfg(cfgName);
       
        if (cfg == null)
        {
            cc.warn("no config:" + cfgName);
            return null;
        }
        else
        {
            let keyAndIndex = this._getKeyAndIndex(cfgName);    

            //搜索key的数量与主键key一致才获取index
            if (keyAndIndex && keyAndIndex.keys && keyAndIndex.keys.length == Object.keys(findObj).length)
            {
                let index = this._genIndex(keyAndIndex, findObj);
           
                if (index >= 0)
                {
                    if (cfg.has(index))
                    {
                        return cfg.get(index);
                    }
                }  
            }                  
 
            {
                let ret = Array.from(cfg.values()).find(elem => {
                    let match = true;
                    for (var keys = Object.keys(findObj), i = 0; i < keys.length; ++i)
                    {
                        if (findObj[keys[i]] == null || findObj[keys[i]] != elem[keys[i]])
                        {
                            match = false;
                            break;
                        }
                    }

                    return match;
                });

                return ret;
            }
            return null;
        }
    },

    /**
     * 根据条件在指定表中查找符合条件的所有记录
     * @param {String} cfgName 配置表名
     * @param {Object} findObj 要查找的关键字对象 类似{ID:1}或者{Type:2, Level:10}
     */
    getRecordList(cfgName, findObj){
        if (findObj == null || findObj == undefined)
        {
            cc.warn("[ConfigManager getRecordByKey] findObj null");
            return this.getAllConfig(cfgName);
        }

        if (findObj.constructor == Number)
        {
            findObj = {ID:findObj};
        }

        if (findObj.constructor != Object)
        {
            cc.warn("[ConfigManager getRecordByKey] findObj error");
            return null;
        }

        let cfg = this._getRealCfg(cfgName);
       
        if (cfg == null)
        {
            cc.warn("no config:" + cfgName);
            return null;
        }
        else
        {          
            let ret = Array.from(cfg.values()).filter(elem => {
                let match = true;
                for (var keys = Object.keys(findObj), i = 0; i < keys.length; ++i)
                {
                    if (findObj[keys[i]] == null || findObj[keys[i]] != elem[keys[i]])
                    {
                        match = false;
                        break;
                    }
                }

                return match;
            });

            return ret;      
        }
    },
    
    /**
     * 获取整张表的数据
     * @param {String} cfgName 配置表名
     * @returns {Map} 整张表
     */
    getAllConfig(cfgName)
    {
        let cfg = this._getRealCfg(cfgName);
       
        if (cfg == null)
        {
            cc.warn("no config:" + cfgName);
            return null;
        }
        else
        {
            return Array.from(cfg.values());
        }
    },
};

/**
 * !#en ConfigManager
 * !#zh 窗口管理类。
 * @property cfgMgr
 * @type {ConfigManager}
 */
yx.cfgMgr = new ConfigManager();

module.exports = yx.cfgMgr;