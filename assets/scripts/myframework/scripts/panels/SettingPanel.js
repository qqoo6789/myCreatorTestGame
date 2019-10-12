const BaseWindow = require('BaseWindow');

cc.Class({
    extends: BaseWindow,

    properties: {              

    },

    onLoad() 
    {
        this._super();

        cc.log(this.name + " onLoad");
    },

    start () {
        this._super();

        cc.log(this.name +  " start");
     
    },

    onDestroy(){
        this._super();

        cc.log(this.name + "onDestroy");
    },

    onTestBtnClick(){
        //onTestBtnClick
        cc.log("onTestBtnClick");
    },
   
});