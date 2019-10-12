
const BaseWindow = require('BaseWindow');

let windowInfoDict = {
    /************************登录场景窗口***********************/
    //登录
    "login": {
        name: "login",
        prefab: "prefabs/windows/LoginWindow",
        type: BaseWindow.Type.WINDOW
    },
    //服务器选择
    "serverlist":{
        name: "serverlist",
        prefab: "prefabs/panels/ServerListPanel",
        type: BaseWindow.Type.PANEL
    },
    //创角
    "createRole":{
        name: "createRole",
        prefab: "prefabs/windows/CreateRoleWindow",
        type: BaseWindow.Type.WINDOW
    },
    /************************大厅主要系统***********************/
    //主界面
    "main": {
        name: "main",
        prefab: "prefabs/windows/MainWindow",
        type: BaseWindow.Type.WINDOW
    },
    //主界面-离线收益
    "lixian": {
        name: "lixian",
        prefab: "prefabs/panels/LiXianPanel",
        type: BaseWindow.Type.PANEL
    },    
    //主界面-渡劫
    "dujie": {
        name: "dujie",
        prefab: "prefabs/windows/DuJieWindow",
        type: BaseWindow.Type.WINDOW
    },    
    //渡劫里的丹药使用面板
    "itemUsePanel": {
        name: "itemUsePanel",
        prefab: "prefabs/panels/ItemUsePanel",
        type: BaseWindow.Type.PANEL
    },  
    //五道(灵根)-主窗口
    "wudao": {
        name: "wudao",
        prefab: "prefabs/windows/WuDaoWindow",
        type: BaseWindow.Type.WINDOW
    },
    //功法-主窗口
    "gongfa":{
        name: "gongfa",
        prefab: "prefabs/windows/GongFaWindow",
        type: BaseWindow.Type.WINDOW
    },    
    
    "stuff": {
        name: "stuff",
        prefab: "prefabs/windows/StuffWindow",
        type: BaseWindow.Type.WINDOW
    },
    "dongfu": {
        name: "dongfu",
        prefab: "prefabs/windows/DongFuWindow",
        type: BaseWindow.Type.WINDOW
    },    
    "buildPanel":{//洞府- 建造
        name: "buildPanel",
        prefab: "prefabs/panels/BuildPanel",
        type: BaseWindow.Type.PANEL
    },
    "shuge":{//洞府 - 书阁
        name: "shuge",
        prefab: "prefabs/windows/ShuGeWindow",
        type: BaseWindow.Type.WINDOW
    },
    "lianZhiPanel":{//洞府 - 丹房/器室   炼制
        name: "lianZhiPanel",
        prefab: "prefabs/panels/LianZhiPanel",
        type: BaseWindow.Type.PANEL
    },
    "xianNiangWindow":{//洞府 - 仙酿
        name: "xianNiangWindow",
        prefab: "prefabs/windows/XianNiangWindow",
        type: BaseWindow.Type.WINDOW
    },
    "itemDetailShowPanel":{//item详情展示[无操作按钮]
        name: "itemDetailShowPanel",
        prefab: "prefabs/panels/ItemDetailShowPanel",
        type: BaseWindow.Type.PANEL
    },
    "shuPanel":{//书籍详情
        name: "shuPanel",
        prefab: "prefabs/panels/ShuPanel",
        type: BaseWindow.Type.PANEL
    },
    "shenHunWuDaoPanel":{//神魂悟道
        name: "shenHunWuDaoPanel",
        prefab: "prefabs/panels/ShenHunWuDaoPanel",
        type: BaseWindow.Type.PANEL
    },

    "daoLv":{//道侣
        name: "daoLv",
        prefab: "prefabs/windows/DaoLvWindow",
        type: BaseWindow.Type.WINDOW
    },

    //历练-副本地图
    "battleMap":{
        name: "battleMap",
        prefab: "prefabs/windows/BattleMapWindow",
        type: BaseWindow.Type.WINDOW
    },
    "fightPanel":{
        name: "fightPanel",
        prefab: "prefabs/panels/FightPanel",
        type: BaseWindow.Type.PANEL
    },
    "dropPanel":{
        name: "dropPanel",
        prefab: "prefabs/panels/DropShowPanel",
        type: BaseWindow.Type.PANEL
    },

    "menPai":{//门派
        name: "menPai",
        prefab: "prefabs/windows/MenPaiWindow",
        type: BaseWindow.Type.WINDOW
    },
    "menPaiSelectPanel":{//门派  -  选择门派
        name: "menPaiSelectPanel",
        prefab: "prefabs/panels/MenPaiSelectPanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiTiaoZhanPanel":{//门派  -  挑战掌门
        name: "menPaiTiaoZhanPanel",
        prefab: "prefabs/panels/MenPaiTiaoZhanPanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiShouYePanel":{//门派  -  授业
        name: "menPaiShouYePanel",
        prefab: "prefabs/panels/MenPaiShouYePanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiZhiWeiPanel":{//门派  -  职位
        name: "menPaiZhiWeiPanel",
        prefab: "prefabs/panels/MenPaiZhiWeiPanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiDuiHuanPanel":{//门派  -  兑换
        name: "menPaiDuiHuanPanel",
        prefab: "prefabs/panels/MenPaiDuiHuanPanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiChuangongPanel":{//门派  -  掌门传功
        name: "menPaiChuangongPanel",
        prefab: "prefabs/panels/MenPaiChuangongPanel",
        type: BaseWindow.Type.PANEL
    },
    "menPaiQingAnPanel":{//门派  -  请安
        name: "menPaiQingAnPanel",
        prefab: "prefabs/panels/MenPaiQingAnPanel",
        type: BaseWindow.Type.PANEL
    },
    "skillTipsPanel":{//技能描述tips
        name: "skillTipsPanel",
        prefab: "prefabs/panels/SkillTipsPanel",
        type: BaseWindow.Type.PANEL
    },

    /************************大厅辅助系统***********************/
    //背包-主界面
    "bag": {
        name: "bag",
        prefab: "prefabs/windows/BagWindow",
        type: BaseWindow.Type.WINDOW
    },
    //背包-角色信息
    "roleInfo": {
        name: "roleInfo",
        prefab: "prefabs/windows/RoleInfoWindow",
        type: BaseWindow.Type.WINDOW
    },
    //背包-道具详情
    "itemDetail": {
        name: "itemDetail",
        prefab: "prefabs/panels/ItemDetailPanel",
        type: BaseWindow.Type.PANEL
    },
    //背包-装备详情
    "equipDetail": {
        name: "equipDetail",
        prefab: "prefabs/panels/EquipDetailPanel",
        type: BaseWindow.Type.PANEL
    },
    //背包升级
    "pkgUpgrade": {
        name: "pkgUpgrade",
        prefab: "prefabs/panels/PkgUpgradePanel",
        type: BaseWindow.Type.PANEL
    },
    //背包-一键出售
    "oneKeySell": {
        name: "oneKeySell",
        prefab: "prefabs/panels/OneKeySellPanel",
        type: BaseWindow.Type.PANEL
    },
    //坊市-主窗口
    "fangshi":{
        name: "battleMap",
        prefab: "prefabs/windows/FangShiWindow",
        type: BaseWindow.Type.WINDOW
    },
    "goodsDetail": {
        name: "goodsDetail",
        prefab: "prefabs/panels/GoodsDetailPanel",
        type: BaseWindow.Type.PANEL
    },

    // 邮件-主界面
    "mail":{
        name: "mail",
        prefab: "prefabs/windows/MailWindow",
        type: BaseWindow.Type.WINDOW
    },

    //邮件-详细界面
    "mailInfo": {
        name: "mailInfo",
        prefab: "prefabs/panels/MailInfoPanel",
        type: BaseWindow.Type.PANEL
    },

    "setting": {
        name: "setting",
        prefab: "prefabs/panels/SettingPanel",
        type: BaseWindow.Type.PANEL
    },
  "liLianWindow":{//历练
        name: "liLianWindow",
        prefab: "prefabs/windows/LiLianWindow",
        type: BaseWindow.Type.WINDOW
    },
    "lilianPanel":{//历练
        name: "lilianPanel",
        prefab: "prefabs/panels/LilianPanel",
        type: BaseWindow.Type.PANEL
    },
    "chuiDiaoWindow":{//历练
        name: "chuiDiaoWindow",
        prefab: "prefabs/windows/ChuiDiaoWindow",
        type: BaseWindow.Type.WINDOW
    },
    "shuoMingPanel":{//说明
        name: "shuoMingPanel",
        prefab: "prefabs/panels/ShuoMIngPanel",
        type: BaseWindow.Type.PANEL
    },
    "yuHuoPanel":{//鱼获
        name: "yuHuoPanel",
        prefab: "prefabs/panels/YuHuoPanel",
        type: BaseWindow.Type.PANEL
    },
    "duiHuanPanel":{//鱼贩兑换
        name: "duiHuanPanel",
        prefab: "prefabs/panels/DuiHuanPanel",
        type: BaseWindow.Type.PANEL
    },
    "shenYouPanel":{//神游
        name: "shenYouPanel",
        prefab: "prefabs/panels/ShenYouPanel",
        type: BaseWindow.Type.PANEL
    },
    "itemQuickBuyPanel":{//快速购买
        name: "itemQuickBuyPanel",
        prefab: "prefabs/panels/ItemQuickBuyPanel",
        type: BaseWindow.Type.PANEL
    },
    "shenHunShiYiPanel":{//神魂拾遗
        name: "shenHunShiYiPanel",
        prefab: "prefabs/panels/ShenHunShiYiPanel",
        type: BaseWindow.Type.PANEL
    },
    "qiYuWindow":{//奇遇
        name: "qiYuWindow",
        prefab: "prefabs/windows/QiYuWindow",
        type: BaseWindow.Type.WINDOW
    },

    //机缘-主界面
    "jiyuan": {
        name: "jiyuan",
        prefab: "prefabs/windows/JiYuanWindow",
        type: BaseWindow.Type.WINDOW
    },
    // 黑市
    "heishi": {
        name: "heishi",
        prefab: "prefabs/windows/HeiShiWindow",
        type: BaseWindow.Type.WINDOW
    },
    // 黑市 -- 奖励弹窗
    "heishiRewardPanel": {
        name: "heishiRewardPanel",
        prefab: "prefabs/panels/HeiShiRewardPanel",
        type: BaseWindow.Type.PANEL
    },

    // 活动
    "activity": {
        name: "activity",
        prefab: "prefabs/windows/ActivityWindow",
        type: BaseWindow.Type.WINDOW
    },


    /*****************************公共窗口************************/
    //一般文字提示框
    "textConfirm":{
        name: "textConfirm",
        prefab: "prefabs/panels/TextConfirm",
        type: BaseWindow.Type.PANEL
    },
    //数量选择面板
    "numpad": {
        name: "numpad",
        prefab: "prefabs/panels/NumpadPanel",
        type: BaseWindow.Type.PANEL
    },
};

module.exports = windowInfoDict;