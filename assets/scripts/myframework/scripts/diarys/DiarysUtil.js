

let _diarysUtil = { 

    init(){
        //登录后有PID才能调用
        if (yx.playerMgr.getPid() > 0)
        {
            for (let key in yx.DiarysDict)
            {
                let diary = yx.DiarysDict[key];
                diary.showList = yx.localStorage.Load(yx.LSKey.EventLog + ":" + yx.playerMgr.getPid() + ":" + key);

                if (diary.showList == null || diary.showList.length == 0)
                {
                    diary.showList = new Array();
                    diary.showList.push(diary.getDefaultText());
                }
            }
        }
        else
        {

        }
    }, 

    _getShowList(type){
        let list = new Array();

        if (yx.DiarysDict.hasOwnProperty(type) && yx.DiarysDict[type].showList.length > 0)
        {            
            list = yx.DiarysDict[type].showList;
        }

        return list;
    },
    
    
    /**
     * //获取正在显示的日志
     * @param {cc.RichText} richText 要显示日志内容的富文本组件
     * @param {String} type 系统类型名
     */
    setRichTextWithShowList(richText, type){
        let list = this._getShowList(type);

        richText.string = "";

        if (list.length > 0)
        {
            richText.string = list.join('\n');
        }
    },

    addShowTextToRichText(richText, type, args){
        if (args == null || args.index == undefined){
            return;
        }

        let newText = yx.DiarysDict[type].getText(args);

        if (!newText)
        {
            return;
        }

        let list = this._getShowList(type);

        if (list.length >= yx.DiarysDict[type].maxline)
        {
            list.splice(0, list.length - yx.DiarysDict[type].maxline + 1); 
        }

        list.push(newText);

        if (richText) richText.string = list.join('\n');

        this.saveLocalDataWithList(type, list);
    }, 

    saveLocalData(type)
    {
        let list = this._getShowList(type);
      
        this.saveLocalDataWithList(list);
    },

    saveLocalDataWithList(type, list){
        yx.localStorage.Save(yx.LSKey.EventLog + ":" + yx.playerMgr.getPid() + ":" + type, list);
    },

    //重置到默认值
    resetLocalDataByType(type){
        if (yx.DiarysDict.hasOwnProperty(type))
        {
            yx.DiarysDict[type].showList = [];
            yx.DiarysDict[type].showList.push(yx.DiarysDict[type].getDefaultText());
            yx.localStorage.Save(yx.LSKey.EventLog + ":" + yx.playerMgr.getPid() + ":" + type,yx.DiarysDict[type].showList);
        }

    }
};

module.exports = yx.DiarysUtil = _diarysUtil;