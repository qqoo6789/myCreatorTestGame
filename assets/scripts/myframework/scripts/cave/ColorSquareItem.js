/**
 * 彩色底框Item  目前用于道侣的头像 与 调制中item
 */

const _prefabPath = "prefabs/widgets/ColorSquareItem";

const _GreenBgPath = "textures/common/Head-52";
const _BlueBgPath = "textures/common/Head-53";
const _PurpleBgPath = "textures/common/Head-54";
const _OrangeBgPath = "textures/common/Head-55";

const ColorSquareType = {
    ITEM:1,//显示Item
    PLAYER:2,//用于显示头像
};

let ColorSquareItem = cc.Class({
    extends: cc.Component,

    properties: {
        bgSp: cc.Sprite,
        isCheckNode: cc.Node,
        nameRiText: cc.RichText,
        showSp: cc.Sprite
    },
    statics: {
        ColorSquareType:ColorSquareType,
        _itemPrefab: null,

        CreateItem(info, parent, name, cb,colorSquareType) {

            if (ColorSquareItem._itemPrefab) {
                return ColorSquareItem._createItemWithPrefab(info, parent, name, ColorSquareItem._itemPrefab, cb,colorSquareType);
            } else {
                cc.loader.loadRes(_prefabPath, function (err, prefab) {
                    if (!err) {
                        ColorSquareItem._itemPrefab = prefab;
                        return ColorSquareItem._createItemWithPrefab(info, parent, name, ColorSquareItem._itemPrefab, cb,colorSquareType);
                    } else {
                        cc.warn(_prefabPath + " is not exist!");
                    }
                });
            }
        },
        _createItemWithPrefab: function (info, parent, name, prefab, cb,colorSquareType) {

            let go = cc.instantiate(prefab);

            let slotNode = new cc.Node(name);

            parent.addChild(slotNode);

            if (name != null) {
                go.name = name;
            }

            let itemSrc = go.getComponent(ColorSquareItem);

            if (itemSrc) {
                itemSrc.init(info, cb,colorSquareType);
                slotNode.addChild(go);
                slotNode.setContentSize(go.getContentSize());
            } else {
                cc.warn("ColorSquareItem instantiate error!");
            }
            return itemSrc;
        }

    },
    /**
     *
     * @param info
     *  1 XianNiangMakeConfig 仙酿Item
     *  2 DaoLvListConfig 道侣头像item
     * @param cb
     * @param colorSquareType
     */

    init(info, cb,colorSquareType) {
        this._cb = cb;
        this._info = info;
        this._colorSquareType = colorSquareType;
        this.node.on('click', this._onItemBtnClick.bind(this), this);

        this.refresh(info);

    },

    refresh(info){
        if (this._colorSquareType == ColorSquareType.PLAYER){
            this._setPlayerItem(info);
        }else {
            this._setItemConfig(info);
        }
    },

    //设置人物头像
    _setPlayerItem(info){

        //没传值过来，头像隐藏
        if (!info || !info.npcListCfg) {
            this.showSp.node.active = false;
            this.nameRiText.string = "";
            return;
        }



        let name = info.npcListCfg.Name?info.npcListCfg.Name:"";

        this._setName(info["PinZhi"],name);

        //显示头像icon
        this._setNpcSprite(info.npcListCfg.Icon,this.showSp);

    },

    //设置材料
    _setItemConfig(info){
        if (!info) return;

        //获取对应的item
        let itemCfg =  yx.cfgMgr.getRecordByKey("ItemConfig", {ID: info["Reward"][0]["id"]});

        if (itemCfg){
            //显示材料icon
            this._setItemSprite(itemCfg["Icon"],itemCfg["Type"],this.showSp);

            this._setName(itemCfg["PinZhi"],itemCfg["Name"]);

        }
    },

    _setName(pinzhi,name){

        if (pinzhi){
            //材料名称
            this.nameRiText.string  = yx.colorUtil.AddColorString(name,yx.textDict.QualityColor[pinzhi]) ;

            //green
            if (pinzhi <= 3){
                yx.resUtil.LoadSprite(_GreenBgPath,this.bgSp);
            }//blue
            else if (pinzhi <= 6){
                yx.resUtil.LoadSprite(_BlueBgPath,this.bgSp);
            }//purple
            else if (pinzhi <= 9){
                yx.resUtil.LoadSprite(_PurpleBgPath,this.bgSp);
            }//orange
            else {
                yx.resUtil.LoadSprite(_OrangeBgPath,this.bgSp);
            }
        }
    },

    _onItemBtnClick(){
        if (this._cb){
            this._cb(this,this._info);
        }
    },
    showIsCheck(is){
        this.isCheckNode.active = is;
    },
    _setItemSprite(icon,type,sprite){
        if (icon != null && icon.length > 0)
        {
            if (type == yx.ItemType.EQUIP)
            {
                yx.resUtil.LoadSpriteByType(icon, yx.ResType.EQUIP, sprite);
            }
            else
            {
                yx.resUtil.LoadSpriteByType(icon, yx.ResType.ITEM, sprite);
            }
        }
    },
    _setNpcSprite(icon,sprite){
        if (!icon){return}
        if (!sprite){return}

        let resCfg = yx.cfgMgr.getRecordByKey("ResConfig",{ID:icon});
        if (resCfg){
            yx.resUtil.LoadSpriteByType(resCfg["Head"],yx.ResType.NPC,sprite);
            sprite.node.active = true;
        }

    },

    setPlayerGray(is){

        //图片灰色
        let colorState = is ? cc.Sprite.State.GRAY : cc.Sprite.State.NORMAL;
        let sps = this.getComponentsInChildren(cc.Sprite);
        for (let i in sps){
            sps[i].setState(colorState);
        }

        //名字灰色
        let name = this._info.npcListCfg.Name?this._info.npcListCfg.Name:"";
        if (is){
            this.nameRiText.string  = yx.colorUtil.AddColorString(name,yx.colorUtil.TextGray) ;
        }else {
            this._setName(this._info["PinZhi"],name);
        }
    }

});

yx.ColorSquareItem = module.exports = ColorSquareItem;
