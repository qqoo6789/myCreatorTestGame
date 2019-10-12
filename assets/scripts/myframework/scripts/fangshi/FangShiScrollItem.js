const GoodsItemWidget = require("GoodsItemWidget");

cc.Class({
    extends: cc.Component,
    properties: {         
        goodsItem1:         GoodsItemWidget,
        goodsItem2:         GoodsItemWidget,
        goodsItem3:         GoodsItemWidget,
    },

    init(goodsMsg1, goodsMsg2, goodsMsg3){
        if (goodsMsg1)
        {
            this.goodsItem1.node.active = true;
            this.goodsItem1.init(goodsMsg1);
        }
        else
        {
            this.goodsItem1.node.active = false;
        }

        if (goodsMsg2)
        {
            this.goodsItem2.node.active = true;
            this.goodsItem2.init(goodsMsg2);
        }
        else
        {
            this.goodsItem2.node.active = false;
        }

        if (goodsMsg3)
        {
            this.goodsItem3.node.active = true;
            this.goodsItem3.init(goodsMsg3);
        }
        else
        {
            this.goodsItem3.node.active = false;
        }        
    },
});