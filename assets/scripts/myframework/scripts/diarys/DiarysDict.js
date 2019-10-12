/**
 * 存放日志系统的文字信息
 */
let _textDict = {
    main: {
        title: "修炼界面",
        list: [
            //渡劫成功
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{name}</color>历经九重天劫，渡劫成功，修为提升至<color=#bb1f29>{levelName}</color>。\n【<color=#1d8d00>{year}年</color>】元始天尊见你勤奋刻苦，奖励你<color=#bb1f29>{amount}</color>灵石。",
            //渡劫失败
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{name}</color>没能经受住天劫，被打成重伤，修为大减。",
            //肉身升级
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{name}</color>引导玄气入体，洗练全身骨骼，吐纳天地灵气，肉身境界提升到<color=#bb1f29>{cuitiLevelName}</color>",
        ],
        defDes: [
            "道可道，非常道；名可名，非常名。\n无名，万物之始，有名，万物之母。\n故常无欲，以观其妙，常有欲，以观其徼。\n此两者，同出而异名，同谓之玄，玄之又玄，众妙之门。\n【<color=#1d8d00>1年</color>】<color=#bb1f29>{name}</color>开启了修真之旅",
            "反者道之动，弱者道之用。\n天下万物生于有，有生于无。\n<color=#bb1f29>{name}</color>历经九重天劫，渡劫成功，修为提升至<color=#bb1f29>{levelName}</color>。"],
        maxline: 4,
        getText(args) {
            if (args) {
                //XiuLianEventText
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            let args = {};
            args.name = yx.playerMgr.getName();
            args.levelName = yx.playerMgr.dujieInfo.Name;

            if (yx.playerMgr.getDuJieLevel() > 1) {
                return this.defDes[1].format(args);
            }

            return this.defDes[0].format(args);
        },
    },
    wudao: {
        title: "灵根界面",
        "list": [
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{name}</color>盘坐入定，从灵池拨出一缕灵气，注入<color={color}>{type}</color>系灵根，灵气逐渐凝练并且被灵根吸收，该灵根成功提升到<color=#bb1f29>{levelName}</color>", //灵根升级
            "【<color=#1d8d00>{year}年</color>】合抱之木，生于毫末；九层之台，起于累土。<color=#bb1f29>{name}</color>汇集天材地宝将灵池成功提升到了<color=#bb1f29>{level}</color>级。", //灵池升级
        ],
        "defDes": ["历来得仙家福缘聊聊少数，乃天地气运，九州大陆万中无一，得灵根者天赋异禀。灵气在心，一来一逝，其细无内，其大无外。"],
        "maxline": 4,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return this.defDes[0];
        },
    },
    dongfu: {
        "title": "洞府",
        "list": [
            "【<color=#1d8d00>{year}年</color>】正所谓技多不压身。于潜心修道之余，开始研习<color=#bb1f29>{name}</color>典籍。",//0
            "【<color=#1d8d00>{year}年</color>】丹方，乃汇聚诸多丹道大家毕生绝学之配方。今有幸习得<color=#bb1f29>{name}</color>。",
            "【<color=#1d8d00>{year}年</color>】获得{name}<color=#bb1f29>{name}</color>，如此机缘气运，实在是羡煞旁人。",
            "【<color=#1d8d00>{year}年</color>】携灵药异草步入丹室，沉心静气开始<color=#bb1f29>炼制丹药</color>。",//3
            "【<color=#1d8d00>{year}年</color>】携奇珍异宝步入器室，沉心静气开始<color=#bb1f29>锻造法宝</color>。",
            "【<color=#1d8d00>{year}年</color>】一阵耀眼夺目的彩芒闪过，定是那<color=#bb1f29>{name}</color>锻造大功告成。",//5
            "【<color=#1d8d00>{year}年</color>】一阵沁人心脾的丹香传来，定是那<color=#bb1f29>{name}</color>炼制大功告成。",
            "【<color=#1d8d00>{year}年</color>】汇聚天地灵宝，以鬼斧神工般的手法于洞府内建造了<color=#bb1f29>{name}</color>。",
            "【<color=#1d8d00>{year}年</color>】工欲善其事，必先利其器。用上佳灵木，将<color=#bb1f29>{name}</color>提升至<color=#bb1f29>{level}</color>级。",
            "【<color=#1d8d00>{year}年</color>】灵药异草历来珍稀，而丹药所耗甚大。为确保炼丹顺利，于药谷<color=#bb1f29>种植草药</color>。",
            "【<color=#1d8d00>{year}年</color>】转眼一百年已过，药材成熟，药谷传来阵阵芳香。<color=#bb1f29>收获</color>到些很不错的药材。",//10
            "【<color=#1d8d00>{year}年</color>】平定心神，开始参悟<color=#bb1f29>《{name}》</color>。",
            "【<color=#1d8d00>{year}年</color>】一阵焦糊的味道传来，看来那<color=#bb1f29>{name}</color>炼制失败了。",
            "【<color=#1d8d00>{year}年</color>】一阵焦糊的味道传来，看来那<color=#bb1f29>{name}</color>装备锻造失败了。",//13
        ],
        "defDes": ["道本虚无，因恍惚而有物；气元冲始，乘运化而分形。精象玄著，列宫阙于清景；幽质潜凝，开洞府于名山。\n乾坤既辟，清浊肇分，融为江河，结为山岳，或上配辰宿，或下藏洞天。"],
        "maxline": 4,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return this.defDes[0];
        },
    },
    chuiDiao: {
        "title": "垂钓",
        "list": [
            "<color=#bb1f29>{name}</color>向前抛出了鱼竿，鱼饵缓缓下垂直到鱼漂剩下一小节露出水面。",//0
            "只见鱼漂猛然下沉，波纹以沉落处为圆心四散开来，鱼竿夸张的弯曲着仿佛随时要断裂一般。(宜大力猛拉)",
            "鱼漂在轻微抖动后不降反升，直到整根浮起横倒在了水面。（宜迂回提拉）",
            "鱼漂开始连续的抖动，频率极快微微荡起了一层层的涟漪。（宜快速提拉）",
            "<color=#bb1f29>{name}</color>大力猛拉，绷直的鱼线吱吱作响，激烈的浪花中鱼获被拉出了水面。",
            "<color=#bb1f29>{name}</color>反复提拉鱼竿，竿稍弯曲弧度一度垂直向下，最终鱼获缓缓被拖至水面。",//5
            "<color=#bb1f29>{name}</color>单手轻巧一抬，鱼钩稳稳的刺中了鱼获。",
            "<color=#bb1f29>{name}</color>提起了鱼竿，并没有任何收获，似乎这时并没有鱼在咬勾。",
            "<color=#bb1f29>{name}</color>提起了鱼竿，遗憾是的鱼儿似乎溜走了。",
            "获得<color=#99ff35>{name}【{num}】</color>",//9
            "恭喜你获极为稀有的<color=#99ff35>{name}</color>，特殊鱼类会直接进入人物背包",
        ],
        "defDes": [""],
        "maxline": 4,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return this.defDes[0];
        },
    },
    menpai: {
        title: "门派界面",
        list: [
            "{str}"
        ],
        defDes: [],
        maxline: 4,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return "";
        },
    },
    fengyin: {
        "title": "圣兽封印",
        "list": [
            //boss攻击躲避
            "[<color=#32BF72>{year}年</color>]{title}发出震天嘶吼，集聚气力作势欲攻，众修行者纷纷暂退。接着一记威势滔天的横扫袭来，有很少的奋勇者避之不及，中招重伤。",//0
            //boss攻击重伤
            "[<color=#32BF72>{year}年</color>]{title}一记横扫，重创少量修士。<color=#95462A>{name}</color>重伤败退，需疗伤一年方可再次参与封印。",
            //boss暴怒躲避
            "[<color=#32BF72>{year}年</color>]{title}变得暴躁愤怒，周身散发出恐怖的气息，有修行者预感不妥，暂退避其锋芒。接着一记毁天灭地的狂暴撕咬袭来，有少量奋勇者避之不及，中招重伤。",
            //boss暴怒重伤
            "[<color=#32BF72>{year}年</color>]{title}暴怒，重创少量修士。<color=#95462A>{name}</color>重伤败退，需疗伤一年方可再次参与封印。",
            //boss削弱
            "[<color=#32BF72>{year}年</color>]暴怒之后耗费精力的{title}虚弱下来。众修士哪能错过此等机会，抓紧完善{title1}，大阵完成度增加<color=#95462A>{fengYinAdd}点</color>。",
            //玩家贡献
            "[<color=#32BF72>{year}年</color>]<color=#0070C0>{name}</color>贡献了<color=#95462A>{atkOne}点</color>{title1}的完成度。",//5
            //自己贡献
            "[<color=#32BF72>{year}年</color>]<color=#95462A>{name}</color>贡献了<color=#95462A>{atkOne}点</color>{title1}的完成度。",
            //boss死亡
            "[<color=#32BF72>{year}年</color>]在一众修行者众志成城的合作下，{title1}终于趋于完成。随着最后一道阵门的闭合，{title}终于被成功封印。恐怕至少数百年之内{title}都不得再次为祸。",//7
        ],
        "defDes": [""],
        "maxline": 15,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return this.defDes[0];
        },
    },
    daoLv: {
        title: "道侣交谈",
        list: [
            "{str}",
            "对方似乎不想再与你交谈",
            "对方很不屑的离开了",
            "<color=#e7452f>{npcName}</color>：我们好感度尚浅。",
        ],
        defDes: [],
        maxline: 6,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return "";
        },
    },
    daoLvLog: {
        title: "道侣双修日志",
        list: [
            "{str}",
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{npcName}</color>与<color=#bb1f29>{name}</color>发生争执，<color=#bb1f29>{name}</color>十分沮丧，百年之内不想修炼。",
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{npcName}</color>外出游玩得到了一个用于渡劫的丹药，打算在双修时赠与你。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>双修后，灵气饱满，精神换发，百年内后续双修效果大幅提升。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后修为增加了<color=#bb1f29>{xiuwei}</color>。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后炼器经验增加了<color=#bb1f29>{lianqi}</color>点。",//5
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后炼丹经验增加了<color=#bb1f29>{liandan}</color>点。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后获得威望<color=#bb1f29>{weiwang}</color>点。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后突破成功率提升<color=#bb1f29>{radio}%</color>。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后修为增加了<color=#bb1f29>{xiuwei}</color>，威望下降了<color=#bb1f29>{weiwang}</color>。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修结束后渡劫成功率提升<color=#bb1f29>{radio}%</color>，修为下降<color=#bb1f29>{xiuwei}</color>。",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修后获得功德<color=#bb1f29>{gongde}</color>",//11
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修后获得灵玉<color=#bb1f29>{lingyu}</color>",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修后获得玉盒*{yuhe}",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>一番云雨，双修后炼丹、炼器经验分别增加<color=#bb1f29>{jingyan}</color>",
            "【<color=#1d8d00>{year}年</color>】与<color=#bb1f29>{npcName}</color>结束双修关系。",//15
            "【<color=#1d8d00>{year}年</color>】<color=#bb1f29>{npcName}</color>拒绝与你双修。"//16
        ],
        defDes: [],
        maxline: 20,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return "";
        },
    },
    liLian: {
        title: "历练",
        list: [
            // 1.解锁关卡，2. 通关成功,3.通关失败，4.奇遇，5.奇遇损失，6.奇遇兑换，7.奇遇获得，8.奇遇战斗胜利，9.奇遇战斗失败，10.开始挂机，11.挂机收益，12.挂机结束，13.飞升，14.飞升成功，15.飞升失败,16.挂机没有收益
            "{str}",
            "【<color=#1d8d00>{year}年</color>】于历练中逐渐融汇神通，<color=#bb1f29>%s</color>已再无挑战，遂准备前往<color=#bb1f29>%s</color>历练。",
            "【<color=#1d8d00>{year}年</color>】以英明神武的姿态扫荡<color=#bb1f29>%s</color>，所遇对手几乎无一合之敌。",
            "【<color=#1d8d00>{year}年</color>】于<color=#bb1f29>%s</color>遭遇强敌，一番激烈的斗法之后惨败而归。",
            "【<color=#1d8d00>{year}年</color>】于<color=#bb1f29>%s</color>历练时偶得一份<color=#bb1f29>奇遇</color>，至于是福是祸，尚未可知。",
            "【<color=#1d8d00>{year}年</color>】遇人不淑，惨遭蒙骗，损失物品<color=#bb1f29>%s</color>。",//5
            "【<color=#1d8d00>{year}年</color>】偶遇妙人，花费<color=#bb1f29>%s</color>物品换得物品<color=#bb1f29>%s</color>。",
            "【<color=#1d8d00>{year}年</color>】巧遇奇人，福缘爆发，获得物品<color=#bb1f29>%s</color>。",
            "【<color=#1d8d00>{year}年</color>】遭遇恶人，一言不合大打出手，最终凭借一身神通<color=#bb1f29>略胜一筹</color>。",
            "【<color=#1d8d00>{year}年</color>】遭遇恶人，一言不合大打出手，最终棋差一招<color=#bb1f29>仓惶逃亡</color>。",
            "【<color=#1d8d00>{year}年</color>】炼神还虚，神魂出窍。开始神游<color=#bb1f29>{curMapName}</color>。",//10
            "【<color=#1d8d00>{year}年</color>】神游<color=#bb1f29>{curMapName}</color>时，遭遇数个<color=#bb1f29>{npcName}</color>围攻。一番血战之后，最终取得<color=#bb1f29>胜利</color>！获得奖励：{reword}。",
            "【<color=#1d8d00>{year}年</color>】引神入体，神魂归窍。结束神游。",
            "【<color=#1d8d00>{year}年</color>】修道大有所成，渐感飞升不日将近。因于<color=#bb1f29>%s</color>更有感应，最终决定<color=#bb1f29>%s</color>。",
            "【<color=#1d8d00>{year}年</color>】强<color=#bb1f29>%s</color>，<color=#bb1f29>%s</color>皆不可当，成功飞升。",//14
            "【<color=#1d8d00>{year}年</color>】强<color=#bb1f29>%s</color>，<color=#bb1f29>%s</color>大发神威，修为不足，<color=#bb1f29>飞升失败</color>。",
            "【<color=#1d8d00>{year}年</color>】探索<color=#bb1f29>%s</color>。无奈神肉分离过久，异常虚弱，一无所获，空手而归",//16
        ],
        defDes: [],
        maxline: 4,
        getText(args) {
            if (args) {
                return this.list[args.index].format(args);
            }
        },
        getDefaultText() {
            return "修真修道者，需动静相宜。\n动者，静之基。清者，浊之源。砺其体炼其形，增益其所不能，以入真道。\n如此形神俱妙，与道合真。";
        },
    },
};

module.exports = yx.DiarysDict = _textDict;