/**
 * 背包内的装备控件
 */



cc.Class({
    extends: cc.Component,

    properties: {    
        //iconSprite:     cc.Sprite,
    },
     

    /**
     * ItemWidget的初始化函数
     * @param {ItemInfo} info 道具信息
     */
    init(equipType){   
        this.node.on('click', this.onBtnClick, this);

        this._equipType = equipType;

        this._iconSp = this.node.getComponentInChildren(cc.Sprite);

        this._itemMsg = yx.bagMgr.getEquipment(this._equipType);

        if (!this._itemMsg)
        {
            this._iconSp.spriteFrame = null;
        }
        else
        {
            this._itemCfg = yx.cfgMgr.getOneRecord("ItemConfig", {ID: this._itemMsg.itemId});

            if (this._itemCfg)
            {
                yx.resUtil.LoadSpriteByType(this._itemCfg.Icon, yx.ResType.EQUIP, this._iconSp);
            }
        }
    },

  
    //点击道具栏
    onBtnClick(){      
        if (!this._itemMsg)
        {
            return;
        }

        let args = {};
        args.id = this._itemMsg.id;
        args.wear = true;

        yx.windowMgr.showWindow("equipDetail", args);
    },
});