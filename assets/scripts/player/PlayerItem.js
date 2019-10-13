const BaseItem = require("BaseItem");
let PlayerItem = cc.Class({
    extends: BaseItem,
    statics:{
        PREFABPATH : "prefab/player/PlayerItem",
        prefab:null,
    },
    properties: {
        nameLabel:cc.Label,
        uidLabel:cc.Label,
    },
    init(msRoomUserInfos){
        for (let i in msRoomUserInfos){
            this.uidLabel.string = msRoomUserInfos[i].userId;
            this.nameLabel.string = msRoomUserInfos[i].userProfile;
        }
    },
});

module.exports = PlayerItem;