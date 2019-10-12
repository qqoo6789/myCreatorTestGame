
let _yx = yx;



/**
 * !#zh 道具类型 1道具 2装备 3丹药 4仙酿 5鱼
 * @enum yx.ItemType
 */
_yx.ItemType = cc.Enum({
    /**
     * !#zh 1道具
     *@property {Number} ITEM
     */
    ITEM: 1,
    /**
     * !#zh 2装备
     *@property {Number} EQUIP
     */
    EQUIP: 2,
    /**
     * !#zh 3丹药
     *@property {Number} DANYAO
     */
    DANYAO: 3,
    /**
     * !#zh 4仙酿
     *@property {Number} XIANLIANG
     */
    XIANLIANG: 4,
    /**
     * !#zh 5鱼
     *@property {Number} XIANLIANG
     */
    FISH: 5,
});

/**
 * !#zh 道具装备类型 0道具 1武器 2衣服 3鞋子 4戒指 5手镯 6玉佩 7法宝 8头盔
 * @enum yx.ItemSubType
 */
_yx.EquipmentType = cc.Enum({
   
    ITEM:       0,    
    WuQi:       1, 
    YiFu:       2,   
    XieZi:      3,
    JieZi:      4,
    ShouZuo:    5,
    YuPei:      6,
    FaBao:      7,
    TouKui:      8    
});



/**
 * !#zh 资源类型
 * @enum yx.ResType
 */
_yx.ResType = cc.Enum({
    /**
     * !#zh 1道具
     *@property {Number} ITEM
     */
    ITEM: 1,
    /**
     * !#zh 2装备
     *@property {Number} EQUIP
     */
    EQUIP: 2,
    /**
     * !#zh 3NPC
     *@property {Number} NPC
     */
    NPC: 3,
    /**
     * !#zh 3技能功法
     *@property {Number} SKILL
     */
    SKILL: 4,
    /**
     * !#zh 丹炉
     *@property {Number} DANLU
     */
    DANLU: 5,
    /**
     * !#zh 战斗地图对象
     *@property {Number} MAP_OB
     */
    MAP_OB: 6,
    /**
     * !#zh 战斗地图
     *@property {Number} MAP
     */
    MAP: 7,
    /**
     * !#zh 鱼苗
     *@property {Number} FISH
     */
    FISH: 8,
    /**
     * !#zh 圣兽
     *@property {Number} SHENGSHOU
     */
    SHENGSHOU: 9,

    SCENE_BG: 10,//场景背景
    
    ROLE: 11,//角色模型
});

/**
 * !#zh 洞府四个资源类型
 * @enum yx.StuffItemType
 */
_yx.StuffItemType = cc.Enum({
    /**
     * !#zh 1 灵石
     *@property {Number} ITEM
     */
    LINGSHI: 1,
    /**
     * !#zh 2 食物
     *@property {Number} EQUIP
     */
    SHIWU: 2,
    /**
     * !#zh 3木材
     *@property {Number} NPC
     */
    MUCAI: 3,
    /**
     * !#zh 4 陨铁
     *@property {Number} NPC
     */
    YUNTIE: 4,

});


/**
 * !#zh 洞府5个建筑类型
 * @enum yx.CaveRoomType
 */
_yx.CaveBuildType = cc.Enum({
    /**
     * !#zh 1 书阁
     *@property {Number} SHUGE
     */
    SHUGE: 1,
    /**
     * !#zh 2 丹房
     *@property {Number} DANFANG
     */
    DANFANG: 2,
    /**
     * !#zh 3器室
     *@property {Number} QISHI
     */
    QISHI: 3,
    /**
     * !#zh 4药谷
     *@property {Number} YaoGu
     */
    YaoGu : 4,
    /**
     * !#zh 5 仙酿 配置里没有
     *@property {Number} XIANNIANG
     */
    XIANNIANG: 5,
    /**
     * !#zh 6 道侣 配置里没有
     *@property {Number} DAOLV
     */
    DAOLV: 6,

});

/**
 * !#zh 配方的2个类型
 * @enum yx.FormulaType
 */
_yx.FormulaType = cc.Enum({
    /**
     * 丹方
     *@property {Number} DANFANG
     */
    DANFANG: _yx.CaveBuildType.DANFANG,
    /**
     * 图纸
     *@property {Number} TUZHI
     */
    TUZHI: _yx.CaveBuildType.QISHI,

});

/**
 * !#zh 洞府书阁修炼类型
 * @enum yx.ShuGeItemType
 */
_yx.ShuGeItemType = cc.Enum({

    /**
     * 丹道
     */
    DANDAO: 1,
    /**
     * 器道
     */
    QIDAO: 2,
    /**
     * 悟道
     */
    WUDAO: 3,

});

/**
 * 洞府书阁书籍类型
 * @enum yx.ShuJiType
 */
_yx.ShuJiType = cc.Enum({

    /**
     * 论道
     */
    LUNDAO:1,

    /**
     * 传记
     */
    ZHUANJI:2,

    /**
     * 心得
     */
    XINDE:3,

    /**
     * 感悟
     */
    GANWU:4
});


/**
 * 门派职位类型
 * @enum yx.MenPaiZhiWeiType
 */
_yx.MenPaiZhiWeiType = cc.Enum({
    /**
     * 外门弟子
     */
    WAIMENDIZI:0,
    /**
     * 内门弟子
     */
    NEIMENDIZI:1,

    /**
     * 亲传弟子
     */
    QINCHUANDIZI:2,

    /**
     * 供奉
     */
    GONGFENG:3,

    /**
     * 护法
     */
    HUFU:4,
    /**
     * 掌门
     */
    ZHANGMEN:5,
});

_yx.CyType = (function () {
    //var valuesById = {};
    //var values = Object.create(valuesById);

    var valuesById = {}, values = Object.create(valuesById);

    values[valuesById[80000] = "XIUWEI"] = 80000;
    values[valuesById[80001] = "LINGSHI"] = 80001;
    values[valuesById[80002] = "SHENYU"] = 80002;//仙玉
    values[valuesById[80003] = "LINGQI"] = 80003;
    values[valuesById[80004] = "SHIWU"] = 80004;
    values[valuesById[80005] = "MUCAI"] = 80005;
    values[valuesById[80006] = "YUNTIE"] = 80006;
    values[valuesById[80007] = "WEIWANG"] = 80007;
    values[valuesById[80008] = "GONGXIAN"] = 80008;
    values[valuesById[80009] = "GONGDE"] = 80009;
    values[valuesById[80010] = "LINGYU"] = 80010;
    values[valuesById[80011] = "XIEYU"] = 80011;
    values[valuesById[80012] = "HAOYU"] = 80012;
    values[valuesById[80013] = "LINGMU"] = 80013;
    values[valuesById[80014] = "CHENMU"] = 80014;
    values[valuesById[80015] = "HANTIE"] = 80015;
    values[valuesById[80016] = "BINGPO"] = 80016;
    values[valuesById[80017] = "HUNSHI"] = 80017;
    values[valuesById[80018] = "SHENSHI"] = 80018;
    values[valuesById[80019] = "JIERIBI"] = 80019;
    values[valuesById[80020] = "PUCON"] = 80020;
    values[valuesById[80021] = "WUDAO"] = 80021;
    values[valuesById[80022] = "LIANQI"] = 80022;
    values[valuesById[80023] = "LIANDAN"] = 80023;
    values[valuesById[80024] = "MOJING"] = 80024;
    values[valuesById[80025] = "DIZIXIUWEI"] = 80025;
    values[valuesById[80026] = "SHENGYU"] = 80026;
    values[valuesById[80027] = "ZHENGQI"] = 80027;
    values[valuesById[80028] = "XIEQI"] = 80028;

    return values;
})();

_yx.EventType = cc.Enum({
    GAME_INITED:            "GameInited",
    SERVER_CONNECTED:       "ServerConnected",

    SCENE_ENTER:            "SceneEnter",
    SCENE_EXIT:             "SceneExit",
    /////////////以上是系统级的事件消息////////////////////


    //LOGIN_SELECT_SERVER:    "SelectServer",
    LOGIN_GET_SERVER_LIST:  "ServerListChg",
    /////////////登录系统相关事件消息/////////////////////

    GET_PLAYER_INFO:        "GetPlayerInfo",
    PLAYER_ITEM_CHG:        "ItemChange",
    CURRENCY_CHANGE:        "CurrencyChange",
    CURRENCY_CHANGE_SHOW:   "CurrencyChangeShow",
    PROPERTY_CHANGE:        "PropertyChange",
    LEVEL_UP:               "LevelUp",
    XIU_LIAN:               "XiuLianManual",
    ITEM_EXCHANGE:          "ItemExchange",
    EQUIPMENT_OPT:          "EquipmentOpt",
    PKG_LEVEL_CHANGE:       "PkgLevelChange",

    ////////////以上是角色相关事件消息
    WUDAO:                  "WuDaoInfo",
    UPGRADE_WUDAO:          "WuDaoChange",
    UPGRADE_WUDAO_ATTR:     "WuDaoAttrChange",

    /////////////以上是灵池相关事件消息

    GONG_FA_CHANGE:         "GongFaChange",
    ADD_MEN_PAI_SKILL_NUM:  "GongFaAddSkillNum",

    ///////////////以上是功法相关事件消息/////////////////

    REFRESH_STUFF_WINDOW:"refreshStuffWindow",//
    REFRESH_CAVE_SHUGE:"refreshCaveShuge",//
    REFRESH_CAVE_LIAN_DANFANG:"refreshCaveLianZhi",//
    REFRESH_CAVE_LIAN_QISHI:"refreshCaveLianQishi",//
    REFRESH_CAVE_LIAN_XIANNIANG:"refreshCaveXianNiang",//
    REFRESH_CAVE_YUDING_BOOK:"refresh_cave_yuding_book",//

    XIULIAN:"Xiulian",
    LIANQI_XIULIAN:"LianqiXiulian",
    LIANYAO_MAKE:"LianyaoMake",
    LIANQI_MAKE:"LianqiMake",
    LIANQI_AWARD:"LianqiAward",
    LIANYAO_AWARD:"LianyaoAward",
    DONGFU_UNLOCK_RES:"DongfuUnlockRes",
    DONGFU_BUILD_LEVELUP:"DongfuBuildLevelup",
    WUDAO_NOTIFY:"WudaoNotify",
    /////////////以上是洞府相关事件消息

    LILIAN_MAP:             "LiLianMap",
    ENTER_MAP:              "EnterMap",
    STEP_IN_MAP:            "StepInMap",
    FIGHT_MONSTER:          "fightMonster",
    FIGHT_PULLBACK:         "fightPullback",//撤退
    ///////////////以上是战斗相关事件消息/////////////////



    MENPAI_ADD_DAIRY_LOG:"menpaiAddDairyLog",
    MENPAI_INFO_REFRESH:"menpaiInfoRefresh",
    MENPAI_TASK_REFRESH:"menpaiTaskRefresh",
    MENPAI_SKILL_REFRESH:"menpaiSkillRefresh",
    MENPAI_ZHIWEI_REFRESH:"menpaiZhiWeiRefresh",
    MENPAI_LIANGONG_REFRESH:"menpaiLianGongRefresh",
    MENPAI_TIAOZHAN_REFRESH:"menpaiTiaoZhanRefresh",
    MENPAI_PK_SHOW:"menpaiPKShow",
    ////////////以上是门派相关的事件消息


    FANG_SHI_LIST:          "FangShiList",
    PURCHASE_GOODS:         "FangShiGoodsChange",
    /////////////以上是商店相关事件消息

    CHUIDIAO_RECONNECT_INFO:"chuidiao_reconnect_info",
    CHUIDIAO_COUNT_INFO:"chuidiao_count_info",
    CHUIDIAO_YUGAN_INFO:"chuidiao_yugan_info",
    CHUIDIAO_OPT_INFO:"chuidiao_opt_info",
    CHUIDIAO_CHANG_GAMESTATE:"chuidiao_chang_gamestate",
    CHUIDIAO_LAGAN_RESULT:"chuidiao_lagan_result",
    CHUIDIAO_LAGAN_RECOMMEND:"chuidiao_lagan_recommend",
    /////////////以上是垂钓相关事件消息

    SHENGYOU_ERFRESH_INFO:"shengyou_erfresh_info",
    SHENGYOU_SHENYOUITEM:"shengyou_shenyouitem",
    SHENGYOU_SET_AUTOSELL:"shengyou_set_autosell",
    SHENGYOU_LOG:"shengyou_log",
    SHENGYOU_STOPSHENYOU:"shengyou_stopshenyou",
    SHENGYOU_BEGINSHENYOU:"shengyou_beginshenyou",
    SHENGYOU_ENDSHENYOU:"shengyou_endshenyou",
    SHENGYOU_SHENYOU_ISDOING:"shengyou_shenyou_isdoing",
    /////////////以上是神游相关事件消息

    SHENGSHOU_REFRESH_INFO:"shengshou_refresh_info",
    //     /////////////以上是圣兽封印相关事件消息
    DAOLV_REFRESH_INFO:"daolv_refresh_info",
    DAOLV_ZENGLI:"daolv_zengli",
    DAOLV_DAIHUI:"daolv_daihui",
    DAOLV_YUANJIN:"daolv_yuanjin",
    DAOLV_TAKEHOME:"daolv_takehome",
    DAOLV_SHUANGXIU:"daolv_shuangxiu",
    DAOLV_SHUANGXIU_LOG:"daolv_shuangxiu_log",
    DAOLV_ERROR_TIP:"daolv_error_tip",
    //     /////////////以上是道侣相关事件消息


    JIYUAN_DOACTION_REFRESH:"jiyuan_action_refresh",
    JIYUAN_INFO_REFRESH:"jiyuan_info_refresh",
    ////////////以上是机缘相关的事件消息

    QIYU_OPEN_WINDOW:"qiyu_open_window", 
    QIYU_DOACTION_REFRESH:"qiyu_action_refresh", 
    ////////////以上是奇遇相关的事件消息

    MAIL_REFRESH:"mail_refresh",
    ////////////以上是邮件相关的事件消息

    HEISHI_REFRESH:"heishi_refresh",
    ////////////以上是黑市相关的事件消息

    ACTIVITY_REFRESH:"activity_refresh",
    ACTIVITY_SELECTTAB:"activity_selectTab",
    ACTIVITY_TASK_REFRESH:"activity_task_refresh",
    ////////////以上是活动相关的事件消息
});

_yx.LSKey = cc.Enum({
    USERNAME:               "username",
    LAST_LOGIN:             "lastlogin",
    EventLog:               "diarys",
    AUTO_ADAPT_DAN:          "autoAdaptDan",//丹炉自动适配
    AUTO_ADAPT_QI:           "autoAdaptQI",//器炉自动适配
    AUTO_HIDE_DAN:       "AUTO_HIDE_DAN",//自动隐藏材料不足的配方
    AUTO_HIDE_QI:       "AUTO_HIDE_QI",//自动隐藏材料不足的配方
});

/**
 * !#zh 地图资源类型
 * @enum yx.MapRes
 */
_yx.MapRes = {
    NO_FOOD:        -1,//没食物
    MON_NORMAL:     1,//普通小怪
    MUCAI:          2,//木材
    YUNTIE:         3,//陨铁
    LINGSHI:        4,//灵石
    ENTER:          5,//入口
    OUT:            6,//出口
    BAOXIANG:       7,//宝箱
    MON_BOSS:       8,//BOSS怪物
};


/**
 * 活动类型
 * @enum yx.ActivityType
 */
_yx.ActivityType = cc.Enum({
    /**
     * 角色等级
     */
    LEVEL:4,
    /**
     * 创角时长
     */
    TIME:5,
    /**
     * 累计充值
     */
    ACCOUNT:7,

});

//module.exports = yx.CyType = _yx.CyType;