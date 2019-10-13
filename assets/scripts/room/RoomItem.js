
const BaseItem = require("BaseItem");
const PlayerItem = require("PlayerItem");
let RoomItem = cc.Class({
    extends: BaseItem,
    statics:{
        PREFABPATH : "prefab/room/RoomItem",
        prefab:null,
    },
    properties: {
        roomName:cc.Label,
        roomCode:cc.Label,
        roomPlayNum:cc.Label,
        roomDes:cc.Label,
        playerLayout:cc.Layout,
        itemBtn:cc.Button,
    },

    init(roomAttribute){
        this.itemBtn.node.on('click',this.itemBtnClick,this);

        this.roomAttribute = roomAttribute;
        cc.log("RoomItem init");
        this.roomName.string = "房间名称："+roomAttribute.roomName;
        this.roomCode.string = "房间号："+roomAttribute.roomID;
        this.roomPlayNum.string = "房间人数："+roomAttribute.gamePlayer+"/"+roomAttribute.maxPlayer;
        this.roomDes.string = "房间描述："+roomAttribute.roomProperty;
        //
    },
    itemBtnClick(){

    },
    updatePlayer(msRoomUserInfo){
        PlayerItem.createItemAsy(PlayerItem.PREFABPATH,this.playerLayout.node,msRoomUserInfo);
        //this.player
    },
    getRoomId(){
        return this.roomAttribute.roomID;
    }
});

module.exports = RoomItem;