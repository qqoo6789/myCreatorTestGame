const BaseWindow = require('BaseWindow');

//let _slotTotal = 40;

//格子大小
const GridWidth = 72;
const GridHeight = 72;
//背景图缩放倍数
const BgScale = GridHeight / 39.5;

//移动一格的时间
const MoveDuration = 0.25;


//迷雾长宽要比地图多
//一边多3个格子 根据地图文件格子外的可见区域来定        
let MoreFog = 3;

const IconMap = {
    [yx.MapRes.MUCAI]       : "object_17",
	[yx.MapRes.YUNTIE]      : "object_18",
	[yx.MapRes.LINGSHI]     : "object_16",
	[yx.MapRes.BAOXIANG]    : "object_19",
	[101]                   : "object_23",
	[102]                   : "object_20",
};

const FogClearData = [
    //当前格全清
    {offsetX: 0,    offsetY: 0,     maskValue:0b0000},
    //周边8格全清
    {offsetX: -1,   offsetY: -1,    maskValue:0b0000},
    {offsetX: 0,    offsetY: -1,    maskValue:0b0000},
    {offsetX: 1,    offsetY: -1,    maskValue:0b0000},
    {offsetX: -1,   offsetY: 0,     maskValue:0b0000},
    {offsetX: 1,    offsetY: 0,     maskValue:0b0000},
    {offsetX: -1,   offsetY: 1,     maskValue:0b0000},
    {offsetX: 0,    offsetY: 1,     maskValue:0b0000},
    {offsetX: 1,    offsetY: 1,     maskValue:0b0000},
    //上面一排中间三个[1,1,0,0]
    {offsetX: -1,   offsetY: 2,     maskValue:0b0011},
    {offsetX: 0,    offsetY: 2,     maskValue:0b0011},
    {offsetX: 1,    offsetY: 2,     maskValue:0b0011},
    //右边中间三个[0,1,1,0]
    {offsetX: 2,    offsetY: 1,     maskValue:0b0110},
    {offsetX: 2,    offsetY: 0,     maskValue:0b0110},
    {offsetX: 2,    offsetY: -1,    maskValue:0b0110},
    //下边中间三个[0,0,1,1]
    {offsetX: -1,   offsetY: -2,    maskValue:0b1100},
    {offsetX: 0,    offsetY: -2,    maskValue:0b1100},
    {offsetX: 1,    offsetY: -2,    maskValue:0b1100},
    //左边中间三个[1,0,0,1]
    {offsetX: -2,   offsetY: 1,     maskValue:0b1001},
    {offsetX: -2,   offsetY: 0,     maskValue:0b1001},
    {offsetX: -2,   offsetY: -1,    maskValue:0b1001},
    //左上角[1,1,0,1]
    {offsetX: -2,   offsetY: 2,     maskValue:0b1011},
    //右上角[1,1,1,0]
    {offsetX: 2,    offsetY: 2,     maskValue:0b0111},
    //右下角[0,1,1,1]
    {offsetX: 2,    offsetY: -2,    maskValue:0b1110},
    //左下角[1,0,1,1]
    {offsetX: -2,   offsetY: -2,    maskValue:0b1101},
];

// let flags2fogValue = function(flags)
// {
//     let fogValue = 0b1111;

//     if (flags && flags.length == 4)
//     {
//         fogValue = 0;
//         for (let i = 0; i < flags.length; i++)
//         {
//             let flag = flags[i] > 1 ? 1 : flags[i];

//             fogValue += flag << i;
//         }
//     }

//     return fogValue;
// };

// let fogVlaue2flags = function(fogValue){
//     let flags = new Array(4);

//     for (let i  = 0; i < flags.length; i++)
//     {
//         flags[i] = 0b0001 & (fogValue >> i);
//     }

//     return flags;
// };



cc.Class({
    extends: BaseWindow,

    properties: {
        moveLayer:          cc.Node,
        mapBgSp:            cc.Sprite,
        resLayer:           cc.Node,
        fogLayer:           cc.Node,
        playerNode:         cc.Node,
        touchLayerBtn:      cc.Button,

        bagBtn:             cc.Button,
        hintLabel:          cc.Label,
        shiwuHintLabel:     cc.Label,
        shiwuLabel:         cc.Label,

        enterEffect:        cc.Node,
        exitEffect:         cc.Node,
 
        maskSpFrameArray: {
            default: [],
            type: cc.SpriteFrame
        },

        //地图信息
        //角色数据
        //战争迷雾
        _mapData:           Array,
        _roleData:          Array,
        _fogData:           Array,
 
    },

    _onInit(args){
        if (!args)
        {
            return;
        }

        this._mapId = args.mapId;

        
        //触控层，把点击转成坐标
        this.touchLayerBtn.clickEvents.length = 0;
        this.touchLayerBtn.clickEvents.push(yx.CodeHelper.NewClickEvent(this, "onTouchLayerClick"));
        this.bagBtn.node.on('click', this.onBagBtnClick, this);

        yx.eventDispatch.addListener(yx.EventType.STEP_IN_MAP, this.onEventMove, this);
        yx.eventDispatch.addListener(yx.EventType.FIGHT_PULLBACK, this.onEventPullBack, this);
        yx.eventDispatch.addListener(yx.EventType.FIGHT_MONSTER, this.onEventFightMonster, this);
        yx.eventDispatch.addListener(yx.EventType.CURRENCY_CHANGE, this.onEventCurrencyChange, this);
        
        

        //地图左下角为起始点(0,0)
        this._mapCfg = yx.cfgMgr.getOneRecord("LiLianMapConfig", {ID:this._mapId});

        if (!this._mapCfg)
        {
            return;
        }        

        if (this._mapCfg.Cost[0].count > 0)
        {
            this.shiwuHintLabel.string = "每步消耗" + this._mapCfg.Cost[0].count + "点食物";
        }
        else
        {
            this.shiwuHintLabel.string = "不消耗食物";
        }
        
        //设置背景图
        yx.resUtil.LoadSpriteByType(this._mapCfg.MapName, yx.ResType.MAP, this.mapBgSp);
        this.mapBgSp.node.setScale(BgScale);

        this.enterEffect.active = false;
        this.exitEffect.active = false;

        //边长 20X20
        this._sideNum = 20;
        this._offsetIndex = - this._sideNum / 2 + 0.5;
        this._offsetX = (this._sideNum / 2 - 0.5) * GridWidth;
        this._offsetY = (this._sideNum / 2 - 0.5) * GridHeight;

        this._path = new Array();
        this._curPos = cc.v2(args.posX, args.posY);
        this._backPos = cc.v2(args.backX, args.backY);
        this._movePath = new Array();
        this._baoxiangDrop = null;

        if (args.mapInfo)
        {
            args.mapInfo.forEach(element => {
                this._path.push(cc.v2(element.posX, element.posY));
            });
        }

        this._initMapData();

        this._initFogData();

        this._refreshMap();
    },

    _initMapData(){
        //一个二维数组
        //{type: , value, node: }
        this._mapData = {};//资源信息层     
        
        for (let i = -MoreFog; i < this._sideNum + MoreFog; i++)
        {
            if (i >= 0 && i < this._sideNum)
            {
                this._mapData[i] = {};
            }
        }

        //秘境
        for (let mijing of this._mapCfg.MiJing)
        {

        }

        //奇遇
        for (let qiyu of this._mapCfg.QiYu)
        {
            
        }
    
        for (let res of this._mapCfg.Res)
        {
            if (res.ResType > 0)
            { 
                this._mapData[res.x][res.y] = {type:res.ResType, value:res.Val, node:null};
            }
        } 

        //再按走过的路清一遍
        for (let pos of this._path)
        {
            this._clearMapGrid(pos.x, pos.y);
        }
    },

    //把指定的格子数据清掉
    _clearMapGrid(col, row)
    {
        if (this._mapData[col][row])
        { 
            if (this._mapData[col][row].node)
            {
                this._mapData[col][row].node.removeFromParent(true);
            }

            this._mapData[col][row] = null;
        }
    },

    _setMapData(col, row, resType, resValue)
    {
        if (col < 0 || col >= this._sideNum || row < 0 || row >= this._sideNum)
        {
            return;
        }

        if (!this._mapData[col][row])
        {
            this._mapData[col][row] = {type:resType, value:resValue, node:null};
        } 
        else
        {
            this._mapData[col][row].type = resType;
            this._mapData[col][row].value = resValue;
        }
    },

    _initFogData(){       
        //一个格子看成四个小格子，每个位置用一个二进制数据表示，左上，右上，右下，左下，0表示没有迷雾
        this._fogData = {};

        for (let col = -MoreFog; col < this._sideNum + MoreFog; col++)
        {
            this._fogData[col] = {};

            for (let row = -MoreFog; row < this._sideNum + MoreFog; row++)
            {      
                this._fogData[col][row] = {value: 0b1111, sp: null};
            }
        }        
        
        //先清当前位置
        this._clearFogData(this._curPos.x, this._curPos.y, false);

        if (!this._path)
        {
            return;
        }

        //再按走过的路清一遍
        for (let pos of this._path)
        {
            this._clearFogData(pos.x, pos.y, false);
        }
    },

    //按视野清雾
    /**
     * 
     * @param {Number} col 
     * @param {Number} row 
     * @param {Boolean} withSp 是否刷新图片
     */
    _clearFogData(col, row, withSp){
        //let fogValue = this._fogData[col][row].value;

        for (let i = 0; i < FogClearData.length; i++)
        {            
            let clearData = FogClearData[i];
            let posX = col + clearData.offsetX;
            let posY = row + clearData.offsetY;

            this._changeFogData(posX, posY, clearData.maskValue, withSp);

            //刷完雾的数据后，要把清出来的雾下来刷一次
            if (withSp)
            {
                this._refreshMapRes(posX, posY);
            }
        }
    },

    _changeFogData(col, row, newValue, withSp)
    {
        let fogInfo = this._fogData[col][row];

        if (!fogInfo || fogInfo.value == newValue)
        {
            return;
        }
    
        fogInfo.value &= newValue;     

        if (withSp) this._refreshFogSprite(col, row);
    },

    //根据数据刷新地图
    _refreshMap(){
        for (let col = -MoreFog; col < this._sideNum + MoreFog; col++)
        { 
            for (let row = -MoreFog; row < this._sideNum + MoreFog; row++)
            {      
                //刷雾
                this._refreshFogSprite(col, row);

                //刷资源
                this._refreshMapRes(col, row);
            }
        }   
    },

    //屏幕坐标系转成游戏地图坐标
    _pos2index(pos)
    {
        let index = cc.v2();

        index.x = Math.floor((pos.x + this._sideNum * GridWidth / 2) / GridWidth);
        index.y = Math.floor((pos.y + this._sideNum * GridHeight / 2) / GridHeight);

        return index;
    },
    
    _refreshShiWu(){
        this.shiwuLabel.string = yx.playerMgr.getCurrency(yx.CyType.SHIWU);
    },

    _refreshMapBg(){
        if (this._mapCfg)
        {
            //设置背景图
            yx.resUtil.LoadSpriteByType(this._mapCfg.MapName, yx.ResType.MAP, this.mapBgSp);
            this.mapBgSp.node.setScale(BgScale);
        }
    },

    _refreshFogSprite(col, row)
    {
        let fogInfo = this._fogData[col][row];

        if (!fogInfo)
        {
            return;
        }

        if (!fogInfo.sp)
        {
            let node = new cc.Node("Fog");
            let sp = node.addComponent(cc.Sprite);

            this.fogLayer.addChild(node);

            node.setPosition((col + this._offsetIndex) * GridWidth, (row + this._offsetIndex) * GridHeight); 
            fogInfo.sp = sp;
        }    

        fogInfo.sp.node.rotation = 0;
        fogInfo.sp.sizeMode = cc.Sprite.SizeMode.RAW;

        switch (fogInfo.value)
        {
            case 0:
                fogInfo.sp.spriteFrame = null;
                break;
            //一个小格子
            case 1:
            case 2:
            case 4:
            case 8:               
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask1");
                fogInfo.sp.node.rotation = Math.log2(fogInfo.value) * 90;
                
                break;
            //两个小格子同侧
            case 3:     //1+2
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask21");
                fogInfo.sp.node.rotation = 0;
                break;
            case 6:     //2+4
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask21");
                fogInfo.sp.node.rotation = 90;
                break;
            case 12:    //4+8
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask21");
                fogInfo.sp.node.rotation = 180;
                break;
            case 9:     //8+1
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask21");
                fogInfo.sp.node.rotation = 270;
                break;
            //两个小格子不同侧
            case 5:     //1+4
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask22");
                fogInfo.sp.node.rotation = 0;
                break;
            case 10:     //2+8      
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask22");
                fogInfo.sp.node.rotation = 90;
                break;
            //三小格子
            case 7:     //1+2+4
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask3");
                fogInfo.sp.node.rotation = 0;
                break;
            case 11:     //1+2+8
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask3");
                fogInfo.sp.node.rotation = 270;
                break;
            case 13:     //1+4+8
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask3");
                fogInfo.sp.node.rotation = 180;
                break;
            case 14:     //2+4+8    
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask3");
                fogInfo.sp.node.rotation = 90;
                break;
            case 15:
                //yx.resUtil.LoadSpriteByType("mask4", yx.ResType.MAP_OB, fogInfo.sp);
                fogInfo.sp.spriteFrame = this._getMaskSpriteFrame("mask4");
                break;
        }
    },

    //刷地图资源
    _refreshMapRes(col, row)
    {
        if (col < 0 || col >= this._sideNum || row < 0 || row >= this._sideNum)
        {
            return;
        }

        //没有雾或者半雾要显示格子里的东西
        if (this._fogData[col][row] && this._fogData[col][row] != 0b1111)
        {
            let gridInfo = this._mapData[col][row];

            if (gridInfo)
            {
                if (!gridInfo.node)
                {
                    gridInfo.node = new cc.Node("Grid");
                    this.resLayer.addChild(gridInfo.node);
                    gridInfo.node.setPosition((col + this._offsetIndex) * GridWidth, (row + this._offsetIndex) * GridHeight); 
                }
               
                switch (gridInfo.type)
                {
                    case yx.MapRes.MON_NORMAL:
                    case yx.MapRes.MON_BOSS:
                        let monCfg = yx.cfgMgr.getRecordByKey("LiLianMonsterConfig", gridInfo.value);
    
                        if (monCfg)
                        {
                            let sp = gridInfo.node.getComponent(cc.Sprite);

                            if (!sp)
                            {
                                sp = gridInfo.node.addComponent(cc.Sprite);
                            }                      
    
                            yx.resUtil.LoadSpriteFromResConfig(monCfg.Icon, yx.ResType.MAP_OB, sp);
                        }
    
                        break;
                    case yx.MapRes.MUCAI:
                    case yx.MapRes.YUNTIE:
                    case yx.MapRes.LINGSHI:
                    case yx.MapRes.BAOXIANG:
                        let sp = gridInfo.node.getComponent(cc.Sprite);

                        if (!sp)
                        {
                            sp = gridInfo.node.addComponent(cc.Sprite);
                        }   
    
                        yx.resUtil.LoadSpriteByType(IconMap[gridInfo.type], yx.ResType.MAP_OB, sp);
                        break;
                   
                    case yx.MapRes.ENTER://入口
                        this.enterEffect.active = true;
                        this.enterEffect.setPosition(gridInfo.node.getPosition());
                        break;
                    case yx.MapRes.OUT://出口
                        this.exitEffect.active = true;
                        this.exitEffect.setPosition(gridInfo.node.getPosition());
                        break;          
                }
            }            
        }
    },
 
    _onShow(){
        // this.scheduleOnce(function(){
        //     this._setPlayerPos(1, 1);
        // }, 3);    
        this._setPlayerPos(this._curPos.x, this._curPos.y);   

        this._refreshShiWu();
    },

    _refresh(){

    },

    _getMaskSpriteFrame(name)
    {
        switch (name)
        {
            case "mask1":
                return this.maskSpFrameArray[0];
            case "mask21":
                return this.maskSpFrameArray[1];
            case "mask22":
                return this.maskSpFrameArray[2];
            case "mask3":
                return this.maskSpFrameArray[3];
            case "mask4":
                return this.maskSpFrameArray[4];   
        }

        return null;
    },


    _setPlayerPos(col, row){
        this._curPos = cc.v2(col, row);
        
        //player移动其实是移动moveLayer
        this.moveLayer.setPosition(cc.v2(this._offsetX - col * GridWidth, this._offsetX - row * GridHeight));

        this._clearFogData(col, row, true);
    },

    _movePlayer(col, row)
    {
        cc.log("[BattleMapWindow _movePlayer] desPos:" + col + ":" + row);

        //超出边界不响应
        if (col < 0 || col >= this._sideNum)
        {
            return;
        }

        if (row < 0 || row >= this._sideNum)
        {
            return;
        }

        this._path.length = 0;

        let step = Math.sign(col - this._curPos.x);
        let index = this._curPos.x;

        while (index != col)
        {
            index += step;

            this._path.push(cc.v2(index, row));
        };

        step = Math.sign(row - this._curPos.y);
        index = this._curPos.y;

        while (index != row)
        {
            index += step;

            this._path.push(cc.v2(col, index));
        };

        //原地不动
        if (this._path.length == 0)
        {
            return;
        }

        // let moveAction = cc.moveTo(1, cc.v2());
        // this.moveLayer.runAction(moveAction);
     
        this._setPlayerPos(col, row);
    },

    _calMovePath(endX, endY){
        let startX = this._curPos.x;
        let startY = this._curPos.y;

        if (endX == startX && endY == startY)
        {
            return;
        }

         //超出边界不响应
         if (endX < 0 || endX >= this._sideNum)
         {
             return;
         }
 
         if (endY < 0 || endY >= this._sideNum)
         {
             return;
         }
 
         this._movePath.length = 0;
 
         let step = Math.sign(endX - startX);
         let index = startX;
 
         while (index != endX)
         {
             index += step;
 
             this._movePath.push(cc.v2(index, startY));
         };
 
         step = Math.sign(endY - startY);
         index = startY;
 
         while (index != endY)
         {
             index += step;
 
             this._movePath.push(cc.v2(endX, index));
         };
 
         if (this._movePath.length > 1)
         {
             this._backPos = this._movePath[this._movePath.length - 2];
         }
         else if (this._movePath.length == 1)
         {
            this._backPos = this._curPos;
         }
    },

    _doEvent(col, row)
    {
        let gridInfo = this._mapData[col][row];

        if (!gridInfo)
        {
            return;
        }

        switch (gridInfo.type)
        {
            case yx.MapRes.NO_FOOD:
                yx.ToastUtil.showSimpleToast("食物不足", this.node);       
                break;
            case yx.MapRes.MON_NORMAL:
            case yx.MapRes.MON_BOSS:
                let monId = gridInfo.value;
                yx.FightPanel.ShowFightPanel("lilian", monId);
                break;
          
            case yx.MapRes.MUCAI:
                yx.ToastUtil.showSimpleToast("获得木材" + gridInfo.value, this.node); 
                this._clearMapGrid(col, row);
                break;
            case yx.MapRes.YUNTIE:
                yx.ToastUtil.showSimpleToast("获得陨铁" + gridInfo.value, this.node); 
                this._clearMapGrid(col, row);
                break;
            case yx.MapRes.LINGSHI:
                yx.ToastUtil.showSimpleToast("获得灵石" + gridInfo.value, this.node); 
                this._clearMapGrid(col, row);
                break;      
            case yx.MapRes.BAOXIANG:
                if (this._baoxiangDrop)
                {
                    yx.DropShowPanel.ShowDropPanel(this._baoxiangDrop);
                }
                this._clearMapGrid(col, row);
                break; 
            case yx.MapRes.ENTER://入口
                //this.enterEffect.setPosition(gridInfo.node.getPosition());
                yx.windowMgr.goBack();
                break;
            case yx.MapRes.OUT://出口
                yx.windowMgr.goBack();
                //this.exitEffect.setPosition(gridInfo.node.getPosition());
                break;   
        }
    },

    _moveAnimEnd()
    {
        let pos = this._movePath.shift();

        this._curPos = pos;

        this._clearFogData(pos.x, pos.y, true);

        cc.log("[BattleMapWindow _moveAnimEnd]  time:" + yx.timeUtil.getNowTimeString());

        //停止来后要检查当前格
        if (this._movePath.length == 0)
        {
            this._doEvent(pos.x, pos.y);
            return;
        }
        else if (this._mapData[pos.x][pos.y] && 
            (this._mapData[pos.x][pos.y].type == yx.MapRes.MUCAI
                || this._mapData[pos.x][pos.y].type == yx.MapRes.YUNTIE 
                || this._mapData[pos.x][pos.y].type == yx.MapRes.LINGSHI))
        {
            this._doEvent(pos.x, pos.y);
        }

        this._startMove();
    },

    _startMove(){
        if (this._movePath.length == 0)
        {
            return;
        }

        let pos = this._movePath[0];

        cc.log("[BattleMapWindow startMove]  time:" + yx.timeUtil.getNowTimeString());

        let action = cc.sequence(cc.moveTo(MoveDuration, cc.v2(this._offsetX - pos.x * GridWidth, this._offsetX - pos.y * GridHeight)), cc.callFunc(this._moveAnimEnd, this));

       this.moveLayer.runAction(action);       
    },

    onTouchLayerClick(event, customEventData){
        if (this._movePath.length > 0)
        {
            return;
        }

        let clickPos = event.getLocation();
        cc.log("[BattleMapWindow onTouchLayerClick] clickPos:" + clickPos.toString());

        let mapPos = this.moveLayer.convertToNodeSpaceAR(clickPos);
        cc.log("[BattleMapWindow onTouchLayerClick] mapPos:", mapPos);

        let index = this._pos2index(mapPos);
        cc.log("[BattleMapWindow onTouchLayerClick] index:", index);

        //this.setPosition(index.x, index.y);
        //this._movePlayer(index.x, index.y);

        yx.battleMgr.reqMove(index.x, index.y);
    },

    onBagBtnClick(){
        yx.windowMgr.showWindow("bag");
    },

    onEventMove(resp){
        if (!this.isShown())
        {
            return;
        }
        // //903 在地图中移动
        // message S2C_StepInMap {
        //     optional int32 posX = 1;//当前坐标
        //     optional int32 posY = 2;//当前坐标
        //     optional int32 ResType = 3;//停止移动的事件类型,-1表示食物不足
        //     optional int32 ResValue = 4;//事件值
        //     repeated ItemMsg drop = 5;//掉落的物品
        // }

        //this._setMapData(resp.posX, resp.posY, resp.ResType, resp.ResValue);

        if (resp.posX == this._curPos.x && resp.posY == this._curPos.y)
        {
            //坐标没变
            if (resp.ResType == yx.MapRes.NO_FOOD)
            {
                yx.ToastUtil.showSimpleToast("食物不足", this.node);
            }
            return;
        }

        this._baoxiangDrop = resp.drop;

        //计算路径
        this._calMovePath(resp.posX, resp.posY);

        //移动
        this._startMove();        
    },

    onEventPullBack(){
        if (!this.isShown())
        {
            return;
        }

        yx.battleMgr.reqMove(this._backPos.x, this._backPos.y);
    },

    onEventFightMonster(resp){
        if (this.node != null && resp.win)
        {
            this._clearMapGrid(this._curPos.x, this._curPos.y);
        }
    },

    onEventCurrencyChange(diff){
        if (this.isShown())
        {
            //只管灵气变化
            if (diff != null && diff[yx.CyType.SHIWU] != 0)
            {
                this._refreshShiWu();
            }            
        }
    },

});