
cc.Class({
    extends: cc.Component,

    properties: {
        yuGanAnimation:cc.Animation,
        paoganBtn:cc.Button,
        daliBtn:cc.Button,
        kuaisuBtn:cc.Button,
        kuaisu2Btn:cc.Button,
    },

    onLoad(){
        //this.yuGanAnimation


       /* this.paoganBtn.node.on('click',this.paoGanBtnClick,this);
        this.daliBtn.node.on('click',this.daliBtnClick,this);
        this.kuaisuBtn.node.on('click',this.kuaisuBtnClick,this);
        this.kuaisu2Btn.node.on('click',this.kuaisu2BtnClick,this);
        this.yuGanAnimation.play();*/
    },
    paoGanBtnClick(){
        this.yuGanAnimation.play("diaoyu_paogan");
    },
    daliBtnClick(){
        this.yuGanAnimation.play("diaoyu_dalila");

    },
    kuaisuBtnClick(){
        this.yuGanAnimation.play("diaoyu_kuaisula");

    },
    kuaisu2BtnClick(){
        this.yuGanAnimation.play("diaoyu_kuaisula2");

    },
    //bookClickHandler(event){
        //cc.log("bookClickHandler");
    //}

});
