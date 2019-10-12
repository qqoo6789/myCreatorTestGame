
// const ItemIconPath = "icon/item/";
// const EquipIconPath = "icon/arm/";
// const SkillIconPath = "icon/skill/";
// const DanluIconPath = "icon/liandanlu/";
// const NpcIconPath = "icon/npc/";
// const MapObjectPath = "map/res/";
// const MapPath = "map/bg/";
// const FishPath = "icon/fish/";
// const ShengShouPath = "icon/shengshou/";

const ResPath = {
    [yx.ResType.ITEM]:      "icon/item/",
    [yx.ResType.EQUIP]:     "icon/arm/",
    [yx.ResType.NPC]:       "icon/npc/",
    [yx.ResType.SKILL]:     "icon/skill/",
    [yx.ResType.DANLU]:     "icon/liandanlu/",
    [yx.ResType.MAP_OB]:    "map/res/",
    [yx.ResType.MAP]:       "map/bg/",
    [yx.ResType.FISH]:      "icon/fish/",
    [yx.ResType.SHENGSHOU]: "icon/shengshou/",
    [yx.ResType.SCENE_BG]:  "textures/bg/",
    [yx.ResType.ROLE]:      "role/",
};

yx.ResUtil = function () {  
};

yx.ResUtil.prototype = {
    constructor: yx.ResUtil,

    LoadRes(path, type, callback)
    {
        cc.loader.loadRes(path, type, function (err, asset) {
            if (callback)
            {
                callback(err, asset);
            }        
        });
    },

    /**
     * 
     * @param {String} path 资源路径
     * @param {cc.Sprite} sprite 要设置的对象 
     */
    LoadSprite(path, sprite)
    {
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (!err) 
            {
                if (sprite != null)
                {
                    sprite.spriteFrame = spriteFrame;
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
    },

    //设置
    LoadSpriteByType(name, type, sprite)
    {
        if (!name || name.length == 0)
        {
            cc.warn("[ResUtil LoadSpriteByType] name is null");
            return;
        }

        let path = name;

        if (ResPath[type] && ResPath[type].length > 0)
        {
            path = ResPath[type] + path;
            this.LoadSprite(path, sprite);
        }
        else
        {
            cc.warn("[ResUtil LoadSpriteByType] Res path info is null, type:" + type);
        }             
    },

    LoadSpriteFromResConfig(id, type, sprite)
    {
        let resCfg = yx.cfgMgr.getRecordByKey("ResConfig", id);

        if (resCfg)
        {
            this.LoadSpriteByType(resCfg.Head, type, sprite);
        }
    },

    LoadSpriteFromResConfigById(id,sprite)
    {
        let resCfg = yx.cfgMgr.getRecordByKey("ResConfig", id);
        if(resCfg)
        {
            let head = resCfg.Head.toString();
            let type = yx.ResType.ITEM;
            if(head.indexOf("item") != -1)
            {
                type = yx.ResType.ITEM;
            }
            else if(head.indexOf("arm")!= -1){
                type = yx.ResType.ITEM;
            }
            else if(head.indexOf("npc")!= -1){
                type = yx.ResType.NPC;
            }
            else if(head.indexOf("skill")!= -1){
                type = yx.ResType.SKILL;
            }
            else if(head.indexOf("lu")!= -1){
                type = yx.ResType.DANLU;
            }
            else if(head.indexOf("fish")!= -1){
                type = yx.ResType.FISH;
            }

            this.LoadSpriteByType(resCfg.Head, type, sprite);
        }
        
    },

    getResPathByType(type)
    {
        if (ResPath[type] && ResPath[type].length > 0)
        {
            return ResPath[type];
        }

        return null; 
    },

    // //获取path
    // getSpritePathByType(name, type)
    // {
    //     let path = name;

    //     switch (type)
    //     {
    //         case yx.ResType.ITEM:
    //             path = ItemIconPath + path;
    //             break;
    //         case yx.ResType.EQUIP:
    //             path = EquipIconPath + path;
    //             break;
    //         case yx.ResType.NPC:
    //             path = NpcIconPath + path;
    //             break;
    //         case yx.ResType.SKILL:
    //             path = SkillIconPath + path;
    //             break;
    //     }
    //     return path;
    // },

    //播放角色龙骨动画
    loadRoleDragonBones(animationDisplay, resName, animName){
        let path = this.getResPathByType(yx.ResType.ROLE);

        if (!path)
        {
            return;
        }

        path = path + resName;

        this.loadDragonBones(animationDisplay, path, "MovieClip", animName);
    },

    //龙骨动画
    loadDragonBones(animationDisplay, path, armatureName, animName, completeCallback = null, playTimes = -1) {  //动态加载龙骨
        cc.loader.loadResDir(path, function(err, assets){

            if(err || assets.length <= 0)  return;

            assets.forEach(asset => {
                if(asset instanceof dragonBones.DragonBonesAsset){
                    animationDisplay.dragonAsset = asset;
                }
                if(asset instanceof dragonBones.DragonBonesAtlasAsset){
                    animationDisplay.dragonAtlasAsset  = asset;
                }
            });

            animationDisplay.armatureName = armatureName;
            animationDisplay.playAnimation(animName, playTimes);

            if (completeCallback)
            {
                animationDisplay.addEventListener(dragonBones.EventObject.COMPLETE, completeCallback);
            }            
        });
    },

    //播放角色spine动画
    loadRoleSpineAnimation(skeleton, resName, animName){
        let path = this.getResPathByType(yx.ResType.ROLE);

        if (!path)
        {
            return;
        }

        path = path + resName;

        this.loadSpineAnimation(skeleton, path, animName);
    },

    loadSpineAnimation(skeleton, path, animName, completeCallback = null){
        cc.loader.loadResDir(path, function(err, assets){
            if(err || assets.length <= 0)  return;

            assets.forEach(asset => {
                if(asset instanceof sp.SkeletonData){
                    skeleton.skeletonData = asset;
                }          
            });

            skeleton.setAnimation(0, animName, true);

            if (completeCallback)
            {
                skeleton.setCompleteListener(completeCallback);
            }            
        });
    },
};

yx.resUtil = new yx.ResUtil();

module.exports = yx.resUtil;