
cc.Class({
    extends: cc.Component,
    properties: {
        shuiHuaAnima:cc.Animation,
        yuPiaoAnima:cc.Animation,//鱼漂
        yuGanAnimation:cc.Animation,
        boWenAnimation:cc.Animation,
    },
    onLoad(){
    },
    //大力提拉 触发水花
    daLiShuiHua(){
        this.shuiHuaAnima.play();
    },
    //快速提拉 触发水花
    kuaiSuShuiHua(){
        this.shuiHuaAnima.play();
    },
    //抛竿 触发水花
    paoGanShuiHua(){
        this.shuiHuaAnima.play();
        this.yuPiaoAnima.play("diaoyu_yupiao_idle");
        this.boWenAnimation.play("diaoyu_bowen");
    },
    //抛竿结束，进入等待动画
    paoGanEnd(){
        this.yuGanAnimation.play("diaoyu_dengdai");
    },
    //快速提拉结束之后，进入 空闲动画
    kuaiSuLaEnd(){
        this.yuGanAnimation.play("diaoyu_idle");
    },
    //大力提拉 结束后，进入空闲动画
    daLiLaEnd(){
        this.yuGanAnimation.play("diaoyu_idle");
    },
    //等待动画开始 波纹动画播放，鱼漂动画播放
    dengDaiYuBegin(){

    },
    //大力拉，快速拉 开始
    laBegin(){
        this.yuPiaoAnima.stop("diaoyu_yupiao_idle");
        this.yuPiaoAnima.stop("diaoyu_yupiao_move");
        this.boWenAnimation.stop("diaoyu_bowen");
        this.boWenAnimation.stop("diaoyu_bowen2");
    },
    idelBegin(){
        cc.log("idelBegin");
        this.yuPiaoAnima.stop("diaoyu_yupiao_idle");
        this.yuPiaoAnima.stop("diaoyu_yupiao_move");
        this.boWenAnimation.stop("diaoyu_bowen");
        this.boWenAnimation.stop("diaoyu_bowen2");
    },
    yuPiaoMoveEnd(){
        this.yuPiaoAnima.play("diaoyu_yupiao_idle");
        this.boWenAnimation.play("diaoyu_bowen");
    }

});
