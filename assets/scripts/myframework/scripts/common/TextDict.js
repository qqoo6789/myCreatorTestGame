//----------------------------------------------------------------------------------------------------------------------

let _cyTextDict = {};

module.exports = yx.textDict = {
    /**
     * 属性 由策划定义在excel里面 通用配置
     * 1 体魄；2 真气； 3 根骨；4 身法；5 灵力；6 悟性；7 机缘；
     * @property {Map}
     */
    Attr: (function () {
        var valuesById = {};
        var values = Object.create(valuesById);

        valuesById[1] = values["TiPo"] = "体魄";
        valuesById[2] = values["ZhenQi"] = "真气";
        valuesById[3] = values["GenGu"] = "根骨";
        valuesById[4] = values["ShenFa"] = "身法";
        valuesById[5] = values["LingLi"] = "灵力";
        valuesById[6] = values["WuXing"] = "悟性";
        valuesById[7] = values["JiYuan"] = "机缘";
        valuesById[101] = values["JinXi"] = "金系伤害";
        valuesById[102] = values["MuXi"] = "木系伤害";
        valuesById[103] = values["ShuiXi"] = "水系伤害";
        valuesById[104] = values["HuoXi"] = "火系伤害";
        valuesById[105] = values["TuXi"] = "土系伤害";
        valuesById[201] = values["RenZu"] = "人族伤害";
        valuesById[202] = values["YaoZu"] = "妖族伤害";
        valuesById[203] = values["MoZu"] = "魔族伤害";
        valuesById[204] = values["ShouZu"] = "兽族伤害";
        valuesById[205] = values["LongZu"] = "龙族伤害";
        valuesById[206] = values["XianRen"] = "仙人伤害";
        valuesById[301] = values["ZhengQi"] = "正气";
        valuesById[302] = values["XieQi"] = "邪气";

        return values;
    })(),
    SecAttrName: {
        [1]: "生命",    //体魄 * 15
        [2]: "攻击",    //真气 * 5
        [3]: "防御",    //根骨 * 5
        [4]: "闪避",    //身法 * 3
        [5]: "暴击",    //灵力 * 3
        [6]: "修炼速度",//悟性 / 2 向下取整
        [7]: "灵力获取",//机缘 / 2 向下取整
    },
    WuDaoTypeName: {
        [1]: "神仙道功法",
        [2]: "人间道功法",
        [3]: "畜生道功法",
        [4]: "恶鬼道功法",
        [5]: "地狱道功法",
    },
    GongFaTypeName: {
        [1]: "招式",
        [2]: "秘籍",
        [3]: "遁术",
        [4]: "绝学",
        [5]: "心经",
        [6]: "真诀",
        [7]: "残页",
        [8]: "门派技能",
    },

    Title: {
        LingGen: "灵根",
        GongFa: "功法",
        MenPai: "门派",
        DongFu: "洞府",
        LiLian: "历练",
    },
    MainWindow: {
        Year: "年",

    },

    ChineseNum: {
        [1]: "一",
        [2]: "二",
        [3]: "三",
        [4]: "四",
        [5]: "五",
        [6]: "六",
        [7]: "七",
        [8]: "八",
        [9]: "九",
        [10]: "仙一",
        [11]: "仙二",
        [12]: "仙三",
        [13]: "仙四",
        [14]: "仙五",
        [15]: "仙六",
        [16]: "仙七",
        [17]: "仙八",
        [18]: "仙九",
    },
    QualityColor: {
        [0]: "#46A142",
        [1]: "#46A142",
        [2]: "#46A142",
        [3]: "#46A142",
        [4]: "#2D94C9",
        [5]: "#2D94C9",
        [6]: "#2D94C9",
        [7]: "#AE4DE6",
        [8]: "#AE4DE6",
        [9]: "#AE4DE6",
        [10]: "#F25B00",
        [11]: "#F25B00",
        [12]: "#F25B00",
        [13]: "#F25B00",
        [14]: "#F25B00",
        [15]: "#F25B00",
        [16]: "#F25B00",
        [17]: "#F25B00",
        [18]: "#F25B00",
    },
    shuGeWuDaoRecord: {
        [1]: "读到了某些精彩之处，不禁拍案叫绝",
        [2]: "读了一小会突然停了下来，若有所思",
        [3]: "参悟良久，有些困顿，沏了杯茶醒神",
        [4]: "想通了某些关键之处，不禁喜上眉梢",
        [5]: "读到了晦涩难懂之处，不禁眉头紧蹙",
        [6]: "难以理解其中要义，在洞府踱步不止",
        [7]: "有所感悟，便用玉简记录下心得体会",
        [8]: "有所感悟，便用玉简记录下心得体会",
        [9]: "有所感悟，便用玉简记录下心得体会",
        [10]: "有所感悟，便用玉简记录下心得体会",

        getRandomValues: function () {
            return this[Math.floor((Math.random() * 10) + 1)];
        }
    },
    shuGeDanDaoRecord: {
        [1]: "研读丹籍中",
        [2]: "冥想沉思中",
        [3]: "熟悉药材中",
        [4]: "推敲丹理中",
        [5]: "实践炼制中 ",
        getValue(index){
            if (index >= 1 && index <= 4){
                return this[index];
            }
            return this[5];
        }
    },
    shuGeQiDaoRecord: {
        [1]: "研读书籍中",
        [2]: "冥想沉思中",
        [3]: "熟悉材料中",
        [4]: "推敲锻术中",
        [5]: "实践锻造中 ",
        getValue(index){
            if (index >= 1 && index <= 4){
                return this[index];
            }
            return this[5];
        }
    },
    ZhongZu:{
        [1]: "人族",
        [2]: "妖族",
        [3]: "魔族",
        [4]: "仙族",
        [5]: "龙族 ",
        [6]: "兽族 ",
    },
    Fight:{
        ShanBi: "<color=#de4a4a>{atkName}</color>一招<color=#d25910>{zhaoshiName}</color>使出，<color=#0cb181>{defName}</color>身形弹起，轻轻避过。",
        BaoJi: "<color=#de4a4a>{atkName}</color>一招<color=#d25910>{zhaoshiName}</color>使出，<color=#0cb181>{defName}</color>闷哼一声，显然受了内伤（造成<color=#f52424>{damage}</color>暴击伤害）",
        Normal: "<color=#de4a4a>{atkName}</color>一招<color=#d25910>{zhaoshiName}</color>使出，<color=#0cb181>{defName}</color>闷哼一声，显然受了内伤（造成<color=#f52424>{damage}</color>伤害）",
    },
    DuJie: {   
        DuJieing: ["远处天空传来雷声呼啸",
                    "一片雾气在这闷闷轰鸣下如卷起的大浪一般轰轰来临",
                    "接着闪电一道接一道的落下",
                    "每一道银白色的闪电都直指{name}",
                    "数声巨响之后雷云散去"],
        Succ: "只见{name}毫发无损,渡劫成功!\n境界提升至 <color=#ffe683>{levelName}</color>",
        Fail: "只见{name}身负重伤\n渡劫失败并且损失{num}点修为",
    }  
};