/**
 * 服务器列表条目
 */


cc.Class({
    extends: cc.Component,

    properties: { 
        btn:            cc.Button,
        textLabel:      cc.Label,    
        iconSp:         cc.Sprite,

        _info:          null,
    },

  

    /**
     * ItemWidget的初始化函数
     * @param {ItemInfo} info 道具信息
     */
    init(info){
        //this.node.on('click', this.onBtnClick, this);
        //this.node.setContentSize(this.bgSprite.node.getContentSize());
        this._info = info;

        if (this._info == null)
        {
            this.iconSp.node.active = false;
            this.textLabel.string = "服务器列表空";
            return;
        }

        //{"id":1,"name":"张书厂","host":"192.168.101.38","port":8010,"status":2}

        this.textLabel.string = info.id + "区:" + info.name + " state:" + info.status;
    },    

    getInfo()
    {
        return this._info;
    }

    // //点击
    // onBtnClick(){    
    //     yx.eventDispatch.dispatchMsg(yx.EventType.LOGIN_SELECT_SERVER, this._info);
    // },
});
