
let BaseItem = cc.Class({
    extends: cc.Component,

    properties: {
    },

    statics:{
        createItemAsy(_prefabPath,parentNode,args){
            cc.loader.loadRes(_prefabPath, function (err, prefab) {
                let newNode = cc.instantiate(prefab);
                parentNode.addChild(newNode);
                let itemSrc = newNode.getComponent(BaseItem);
                itemSrc.init(args);
                //return itemSrc;
            });
        },
        createItemSync(prefab,parentNode,args){
            let newNode = cc.instantiate(prefab);
            parentNode.addChild(newNode);
            let itemSrc = newNode.getComponent(BaseItem);
            itemSrc.init(args);
            return itemSrc;
        },
    },

    init(args){
        cc.log("BaseItem init");
    }

});

module.exports = BaseItem;