/**
 * 战斗确认面板
 */
const BaseWindow = require('BaseWindow');

const FightRoundDuration = 2;

const ActionSample = 10;
const AttackMove = 250;

const AtkType = cc.Enum({
    Normal: 0,
    ShanBi: 1,
    BaoJi:  2,
});

const ActionName = {
    Attack:     "attack",
    Die:        "die",
    Hit:        "hit",
    Idle:       "stand",
    Skill:     "skill",
};

const FightStatus = cc.Enum({
    Ready:      0,
    Fighting:   1
});

let FightPanel = cc.Class({
    extends: BaseWindow,

    properties: {
        //maskBtn:                cc.Button,
        
        nameLabel:              cc.Label,
        titleGroup:             cc.Node,
        hpGroup:                cc.Node,
        myPb:                   cc.ProgressBar,
        enemyPb:                cc.ProgressBar,

        myAnim:                 cc.Animation,
        enemyAnim:              cc.Animation,
        damageLabel:            cc.Label,

        desRichText:            cc.RichText,
        textScrollView:         cc.ScrollView,

        atkBtn:                 cc.Button,
        cancelBtn:              cc.Button,
        exitBtn:                cc.Button,

        _fightStatus:           0,//0-打斗前，1-打斗中
        _fightMonMsg:           null, 
        _fightType:             0,
        _enemyId:               0,
        _myInfoMsg:             null,
        _enemyInfoMsg:          null,

        _roundList:             null,
        _isWin:                 false,
        _dropMsg:               null,

        _myZhaoShiCfg:          null,
        _enemyZhaoShiCfg:       null,
        _showDrop:              false,//是否显示掉落面板

        _endCallback:           null,
        _endTarget:             null,
    },

    statics:{

        ShowFightPanel(type, enemyId, callback, target){
            let args = {};
            args.type = type;
            args.enemyId = enemyId;
            args.status = FightStatus.Ready;
            args.showDrop = true;
            
            yx.windowMgr.showWindow("fightPanel", args);
        },

        /**
         * 显示指定的战斗过程
         * @param {String} type 战斗类型，在哪里发生的战斗
         * @param {String} enemyName 敌方名字
         * @param {FightResultMsg} resultMsg 战斗结果
         * @param {Boolean} showDrop 是否自动显示掉落面板
         * @param {Function} callback 战斗结束后的回调
         * @param {Object} target 回调的对象
         */
        ShowFightResult(type, enemyName, resultMsg, showDrop, callback, target){
            if (!resultMsg || !resultMsg.fightInfo || resultMsg.fightInfo.length == 0)
            {
                cc.error("[FightPanel ShowFightResult] fightInfo error");
                return;
            }

            let args = {};
            args.type = type;
            args.enemyId = resultMsg.init2.id;
            args.enemyName = enemyName;
            args.status = FightStatus.Fighting;
            args.resultMsg = resultMsg;
            args.showDrop = showDrop;

            if (callback && target)
            {
                args.callback = callback;
                args.target = target;
            }
            
            yx.windowMgr.showWindow("fightPanel", args);
        },
    },

    _onInit(args){
        this.atkBtn.node.on('click', this.onAtkBtnClick, this);    
        this.cancelBtn.node.on('click', this.onCancelBtnClick, this);    
        this.exitBtn.node.on('click', this.onExitBtnClick, this);   

        yx.eventDispatch.addListener(yx.EventType.FIGHT_MONSTER, this.onEventFightMonster, this);

        if (args)
        {
            this._fightStatus = args.status;
            this._fightType = args.type;
            this._enemyId = args.enemyId;
            this._showDrop = args.showDrop;

            if (args.enemyName)
            {
                this._enemyName = args.enemyName;
            }            

            if (args.resultMsg)
            {
                this._setResult(args.resultMsg);
            }

            if (args.callback && args.target)
            {
                this._endCallback = args.callback;
                this._endTarget = args.target;
            }
        }

        let self = this;

        yx.resUtil.LoadRes("action/role1", cc.SpriteAtlas, function(err, asset)
        {
            if (!err) 
            {
                if (asset != null)
                {
                    self._initRoleAnimations(asset, true, true);
                }
                else
                {
                    cc.warn("sprite is null");
                }
            } 
            else                       
            {
                cc.warn(path + " is not exist!");                     
            }
        });

        yx.resUtil.LoadRes("action/mon1", cc.SpriteAtlas, function(err, asset)
        {
            if (!err) 
            {
                if (asset != null)
                {
                    self._initRoleAnimations(asset, false, false);
                }
                else
                {
                    cc.warn("sprite is null");
                }
            } 
            else                       
            {
                cc.warn(path + " is not exist!");                     
            }
        });        

        this.myAnim.on('finished', this.onActionAnimComplete, this);
        this.enemyAnim.on('finished', this.onActionAnimComplete, this);
        this.enemyAnim.node.setScale(-1, 1);
    },

    _createClip(atlas, actionName, loop)
    {
        let spriteFrames = atlas.getSpriteFrames().filter(elem => {
            return elem.name.includes(actionName);
        });

        let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, ActionSample);
        clip.wrapMode = loop ? cc.WrapMode.Loop : cc.WrapMode.Normal;
  
        return clip;
    },

    _initRoleAnimations(spriteAtlas, isLeft, hasSkill)
    {
        let currAtlas = spriteAtlas;
        let curAnim = isLeft ? this.myAnim : this.enemyAnim;

        if (curAnim.getClips().length > 0)
        {
            return;
        }        
        
        curAnim.addClip(this._createClip(currAtlas, ActionName.Attack, false), ActionName.Attack);
        curAnim.addClip(this._createClip(currAtlas, ActionName.Die, false), ActionName.Die);
        curAnim.addClip(this._createClip(currAtlas, ActionName.Hit, false), ActionName.Hit);
        curAnim.addClip(this._createClip(currAtlas, ActionName.Idle, true), ActionName.Idle);
        if (hasSkill) curAnim.addClip(this._createClip(currAtlas, ActionName.Skill, false), ActionName.Skill);

        this._playAnim(ActionName.Idle, isLeft); 
    },   

    _playAnim(actionName, isLeft)
    {
        let curAnim = isLeft ? this.myAnim : this.enemyAnim;

        //如果有多种攻击方式，随机取一种
        if (actionName == ActionName.Attack && curAnim.getAnimationState(ActionName.Skill))
        {
            if (Math.random() >= 0.5)
            {
                actionName = ActionName.Skill;
            }   
        }

        //普通攻击要有位移
        if (actionName == ActionName.Attack)
        {
            curAnim.node.x += (isLeft ? 1 : -1) * AttackMove; 
        }

        curAnim.play(actionName);
    },

    _setResult(resp){
        this._myInfoMsg = resp.init1;
        this._enemyInfoMsg = resp.init2;
        this._roundList = resp.fightInfo;
        this._isWin = resp.win;
        this._dropMsg = resp.drop;

        this._myZhaoShiCfg = yx.cfgMgr.getOneRecord("SkillConfig", {Index:resp.init1.skill, Type:yx.proto.GongFaType.ZhaoShi});
        this._enemyZhaoShiCfg = yx.cfgMgr.getOneRecord("SkillConfig", {Index:resp.init2.skill, Type:yx.proto.GongFaType.ZhaoShi});
    },

    _onShow(args){
        // if (args)
        // {
        //     this._fightStatus = args.status;
        //     this._fightType = args.type;
        //     this._enemyId = args.enemyId;
        //     this._showDrop = args.showDrop;

        //     if (args.resultMsg)
        //     {
        //         this._setResult(args.resultMsg);
        //     }
        // }

        this._refresh();
    },

    _onHide(){
        this.damageLabel.string = "";
    },

    
    _refreshDetail(){        
        this.exitBtn.node.active = false;
        this.atkBtn.node.active = true;
        this.cancelBtn.node.active = true;

        this.titleGroup.active = true;

        this.hpGroup.active = false;

        switch (this._fightType)
        {
            case "lilian":
                let monCfg = yx.cfgMgr.getOneRecord("LiLianMonsterConfig", {ID: this._enemyId});

                if (monCfg)
                {
                    this.nameLabel.string = monCfg.Name;
                    this.desRichText.string = "境界：" + monCfg.LevelName + "\n" + "种族：" + yx.textDict.ZhongZu[monCfg.ZhongZu] + "\n" + monCfg.DefDesc;
                    this._enemyName = monCfg.Name;
                }
                break;
        }
    },

    _refreshFighting(){
        this.exitBtn.node.active = true;//退出按钮第二回合当显示
        this.atkBtn.node.active = false;
        this.cancelBtn.node.active = false;
        this.exitBtn.interactable = false;

        this.titleGroup.active = false;

        this.myPb.progress = 1;
        this.enemyPb.progress = 1;
        this._myHp = this._myInfoMsg.hp;
        this._enemyHp = this._enemyInfoMsg.hp;
        this._myName = yx.playerMgr.getName();
        this.hpGroup.active = true;
        this.desRichText.string = "";

        //this._refreshFightRound();
        this.schedule(this._refreshFightRound, FightRoundDuration, cc.macro.REPEAT_FOREVER, 1);

        //this.scheduleOnce(this._refreshFightRound, FightRoundDuration);//间隔一段时间再播放下一回合
    },

    _refresh(){
        if (this._fightStatus == FightStatus.Ready)
        {
            this._refreshDetail();
        }
        else if (this._fightStatus == FightStatus.Fighting)
        {
            this._refreshFighting();
        }
    },

    _playHitAnim(target, data){
        this._playAnim(data.actionName, data.isLeft);
    },

    _refreshFightRound(){
        // message FightInfo {
        //     optional int64 attack = 1;//攻击方
        //     optional int64 defense = 2;//被攻击方
        //     optional int32 status = 3;//1闪避,2暴击,0正常攻击
        //     optional int32 hurt = 4;//伤害值
        // }
        
        if (this.desRichText.string.length > 0 && this.exitBtn.interactable == false)
        {
            this.exitBtn.interactable = true;
        }

        if (this._roundList.length == 0)
        {
            this.onFightEnd();
            return;
        }

        let roundMsg = this._roundList.shift();

        let formatArgs = {};

        formatArgs.damage = roundMsg.hurt;

        let isDie = false;
        let isLeft = roundMsg.attack == yx.playerMgr.getPid();        

        //刷新血量
        //攻击者为玩家， 自己攻击
        if (isLeft)
        {
            this._enemyHp -= roundMsg.hurt;
            this.enemyPb.progress = this._enemyHp / this._enemyInfoMsg.hp;

            formatArgs.atkName = this._myName;
            formatArgs.defName = this._enemyName;

            formatArgs.zhaoshiName = this._myZhaoShiCfg.Name;

            isDie = this._enemyHp <= 0;

            this.damageLabel.node.setPosition(this.enemyAnim.node.getPosition());
        }
        else
        {            
            this._myHp -= roundMsg.hurt;
            this.myPb.progress = this._myHp / this._myInfoMsg.hp;

            formatArgs.atkName = this._enemyName;
            formatArgs.defName = this._myName;

            formatArgs.zhaoshiName = this._enemyZhaoShiCfg.Name;

            isDie = this._myHp <= 0;

            this.damageLabel.node.setPosition(this.myAnim.node.getPosition());
        }

        this._playAnim(ActionName.Attack, isLeft);

        this.damageLabel.string = "-" + roundMsg.hurt;
        
        let damageLabelAction = cc.sequence(cc.show(), cc.moveBy(1, cc.v2(0, 130)), cc.hide());

        this.damageLabel.node.runAction(damageLabelAction);

        let hitAction = null;

        if (isDie)
        {
            hitAction = cc.sequence(cc.delayTime(0.3), cc.callFunc(this._playHitAnim, this, {actionName: ActionName.Die, isLeft:!isLeft}));
            
            //this.scheduleOnce(this._playAnim(ActionName.Die, !isLeft), 0.3);
            //this._playAnim(ActionName.Die, !isLeft);
        }
        else
        {
            hitAction = cc.sequence(cc.delayTime(0.3), cc.callFunc(this._playHitAnim, this, {actionName: ActionName.Hit, isLeft:!isLeft}));
            //this.scheduleOnce(this._playAnim(ActionName.Hit, !isLeft), 0.3);
            //this._playAnim(ActionName.Hit, !isLeft);
        }       

        this.node.runAction(hitAction);

        let roundDes = "";

        switch (roundMsg.status)
        {
            case AtkType.Normal:
                roundDes = yx.textDict.Fight.Normal.format(formatArgs) + "\n";
                break;
            case AtkType.ShanBi:
                roundDes = yx.textDict.Fight.ShanBi.format(formatArgs) + "\n";
                break;
            case AtkType.BaoJi:
                roundDes = yx.textDict.Fight.BaoJi.format(formatArgs) + "\n";
                break;
        }

        this.desRichText.string += roundDes;
    },

    //攻击
    onAtkBtnClick(){
         yx.battleMgr.reqFightMonster();
    },

    //撤退
    onCancelBtnClick(){
        //要移动到上一个格子
        yx.eventDispatch.dispatchMsg(yx.EventType.FIGHT_PULLBACK);
        yx.windowMgr.goBack();
    },

    //退出
    onExitBtnClick(){
        this.onFightEnd();
    },

    onActionAnimComplete(name, animState)
    {
        if (animState && animState._target)
        {
            if (animState.name == ActionName.Die
                || animState.name == ActionName.Idle)
            {
                return;
            }

            //普攻结束后要移动回来
            if (animState.name == ActionName.Attack)
            {
                if (animState._target.node.x > 0)
                {
                    animState._target.node.x -= AttackMove;
                }
                else
                {
                    animState._target.node.x += AttackMove;
                }
            }

            animState._target.play(ActionName.Idle);
        }
    },

    onEventFightMonster(resp){
        if (!this.isShown())
        {
            return;
        }

        if (resp.init2.id != this._enemyId)
        {
            cc.error("ID不一样");
            return;
        }

        this._setResult(resp);

        if (this._myZhaoShiCfg && this._enemyZhaoShiCfg)
        {
            this._refreshFighting();
        }
        else
        {
            cc.error("[FightPanel onEventFightMonster] zhaoshiCfg error: " + resp.init1.skill + " and " + resp.init2.skill);
        }        
    },

    //战斗结束处理
    onFightEnd(){
        this.unschedule(this._refreshFightRound);

        if (this._isWin)
        {
            let dropMsg = this._dropMsg;

            yx.windowMgr.closeWindow(this);
    
            //直接弹出来掉落
            if (dropMsg && this._showDrop)
            {
                yx.DropShowPanel.ShowDropPanel(dropMsg);
            }
        }
        else
        {
            yx.windowMgr.closeWindow(this);
     
            //输了要弹回去疗伤的窗口 点确定返回历练主界面
            //yx.windowMgr.goBack();
        }

        if (this._endTarget && this._endCallback)
        {
            this._endCallback.call(this._endTarget, this._isWin);
        }
    },
});

module.exports = yx.FightPanel = FightPanel;
