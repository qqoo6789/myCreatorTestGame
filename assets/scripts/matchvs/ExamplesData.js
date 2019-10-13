/**
 * 体验地址的游戏信息
 * @type {{gameID: number, channel: string, platform: string, gameVersion: number, appKey: string, userName: string, mxaNumer: number, userID: string, token: string, host: string}}
 */

var GameData = {
    gameID: 217350,
    channel: 'Matchvs',
    platform: 'alpha',
    gameVersion: 1,
    appKey: '9541f28a15794557b0b30baa44bace9d#C',
    userName: '',
    mxaNumer: 3,
    userID: "",
    token: "",
    host: "",
    isPAAS: false,
    reset: function () {
        GameData.gameID = "";
        GameData.appKey = "";
        GameData.userID = "";
        GameData.token = "";
    },
}


module.exports = GameData;