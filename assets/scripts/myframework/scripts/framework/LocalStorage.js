
/**
 * 存储一些用户数据在本地缓存中
 */

yx.LocalStorage = function () {  
};

yx.LocalStorage.prototype = {
    constructor: yx.LocalStorage,
       

    /**
     * 加载本地缓存的数据，如果不存在返回null
     * @param {String} key 
     */
    Load(key)
    {
        var dataString = cc.sys.localStorage.getItem(key);

        var value = JSON.parse(dataString);

        return value;
    },

    /**
     * 把数据缓存到本地
     * @param {String} key 要保存数据的关键字
     * @param {any} value 要保存的数据
     */
    Save(key, value)
    {
        var dataString = JSON.stringify(value);

        cc.sys.localStorage.setItem(key, dataString);
    },
};

yx.localStorage = new yx.LocalStorage();

module.exports = yx.localStorage;