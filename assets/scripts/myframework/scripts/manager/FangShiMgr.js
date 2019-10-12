
/**
 * !#en FangShiManger
 * !#zh 坊市(商店)数据类。
 * @class FangShiManger
 * @extends 
 */
yx.FangShiManger = function () {
  
    this._shopData = {};
};

yx.FangShiManger.prototype = {
    constructor: yx.FangShiManger,
  
    init: function () {
        yx.network.addHandler(yx.proto.CmdId.FANG_SHI_LIST, this.onMessageShopList);
        yx.network.addHandler(yx.proto.CmdId.PURCHASE_GOODS, this.onMessagePurchaseGoods);
    },

    //商店数据初始化
    initShopList(shopList){
        this._shopData = {};

        for (let goodsMsg of shopList)
        {
            if (!this._shopData[goodsMsg.shopType])
            {
                this._shopData[goodsMsg.shopType] = {};
            }

            if (!this._shopData[goodsMsg.shopType][goodsMsg.layer])
            {
                this._shopData[goodsMsg.shopType][goodsMsg.layer] = new Map();
            }

            this._shopData[goodsMsg.shopType][goodsMsg.layer].set(goodsMsg.goodsID, goodsMsg);
        }
    },

    /**
     * 获取指定商店类型指定楼层的商店数据
     * @param {Number} type 商店类型
     * @param {Number} level 楼层
     */
    getGoodsList(type, level)
    {
        if (this._shopData[type] && this._shopData[type][level])
        {
            return Array.from(this._shopData[type][level].values());
        }

        return new Array();
    },

   changeGoods(goodsMsg){
        if (this._shopData[goodsMsg.shopType] 
            && this._shopData[goodsMsg.shopType][goodsMsg.layer] 
            && this._shopData[goodsMsg.shopType][goodsMsg.layer].has(goodsMsg.goodsID))
        {
            this._shopData[goodsMsg.shopType][goodsMsg.layer].set(goodsMsg.goodsID, goodsMsg);
        }
   },




    //////////////////////////////////以下是请求//////////////////////////////////

    reqShopList(){
        let req = new yx.proto.C2S_GetShopList();

        yx.network.sendMessage(yx.proto.CmdId.FANG_SHI_LIST, req);
    },

   
    /**
     * 购买商店请求
     * @param {Number} shopType 商店类型(参考ShopType)
     * @param {Number} layer 楼层
     * @param {Number} goodsID 商品ID
     * @param {Number} count 购买数量
     */
    reqPurchaseGoods(shopType, layer, goodsID, count){
        let req = new yx.proto.C2S_PurchaseGoods();
        req.shopType = shopType;
        req.layer = layer;
        req.goodsID = goodsID;
        req.count = count;

        yx.network.sendMessage(yx.proto.CmdId.PURCHASE_GOODS, req);
    },

    //////////////////////////////////以上是请求//////////////////////////////////
   

    //////////////////////////////////以下是消息处理//////////////////////////////////

    onMessageShopList(errMsg, data){
        let resp = yx.proto.S2C_GetShopList.decode(data);

        yx.fangshiMgr.initShopList(resp.shopInfo);

        yx.eventDispatch.dispatchMsg(yx.EventType.FANG_SHI_LIST, resp);
    },

    onMessagePurchaseGoods(errMsg, data){
        if (errMsg != null && errMsg.length > 0)
        {
            cc.log("[FangShiManger onMessagePurchaseGoods] error:" + errMsg);
            return;
        }

        let resp = yx.proto.S2C_PurchaseGoods.decode(data);

        yx.fangshiMgr.changeGoods(resp.shopInfo);
    
        yx.eventDispatch.dispatchMsg(yx.EventType.PURCHASE_GOODS, resp);
    },
};

/**
 * !#en FangShiManger
 * !#zh 坊市(商店)数据类。
 * @property fangshiMgr
 * @type {FangShiManger}
 */
yx.fangshiMgr = new yx.FangShiManger();

module.exports = yx.fangshiMgr;