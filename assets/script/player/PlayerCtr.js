var G = -0.6;
var GROUND = -200;
var NORMAL_ANIMATION_GROUP = "normal";
var ATTACK_ANIMATION_GROUP = "attack";
var NORMALIZE_MOVE_SPEED = 3.6;
var MAX_MOVE_SPEED_FRONT = NORMALIZE_MOVE_SPEED * 1.4;
var MAX_MOVE_SPEED_BACK = NORMALIZE_MOVE_SPEED * 1.0;

/**
 * 注释内部的 "骨架内坐标系" ，其实就是DisplayNode的坐标，但是注意y轴是相反的；
 */

cc.Class({
    extends: cc.Component,

    properties: {
        playerDisplay:dragonBones.ArmatureDisplay,
        playerHandCollider:cc.PolygonCollider,

        guaiwuDisplay:dragonBones.ArmatureDisplay,
        guaiwuCollider:cc.CircleCollider,

        particle:cc.ParticleSystem,

        camera:cc.Camera,
        _speedX : 0,//速度

        _faceDir : 1,//脸的方向

        _moveDir : 0,//移动方向

        testSp:cc.Sprite,
        colorSp:cc.Sprite,
    },
    onLoad () {
        this._armature = this.playerDisplay.armature();

        // keyboard events
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, function (event) {
            this._keyHandler(event.keyCode, true);
        }, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, function (event) {
            this._keyHandler(event.keyCode, false);
        }, this);

        cc.Canvas.instance.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            console.log('Mouse down',event._x,event._y);

            let handBoundingBoxSlot = this._armature.getSlot("hand_boundingBox");
            let worldPos = event.getLocation();
            let nodePos = this.playerDisplay.node.convertToNodeSpaceAR(worldPos);
            //这里取反y；进行碰撞检测
            let r = handBoundingBoxSlot.containsPoint(nodePos.x,-nodePos.y);//这里的y也要取反
            cc.log("Mouse down contain:"+r);


        }, this);

        cc.Canvas.instance.node.on(cc.Node.EventType.TOUCH_START, function (touch, event) {
            if (!this.playerHandCollider.enabled) return;
            // 返回世界坐标
            let touchLoc = touch.getLocation();
            //https://docs.cocos.com/creator/api/zh/classes/Intersection.html 检测辅助类
            if (cc.Intersection.pointInPolygon(touchLoc, this.playerHandCollider.world.points)) {
                console.log("Hit!");
            }
            else {
                console.log("No hit");
            }
        }, this);


        //必须是 调fadein才会有此回调。Play不会有。
        //this.playerDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this._animationEventHandler, this);
        //this.playerDisplay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this._animationEventHandler, this);
        this.playerDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, this._animationEventHandler, this);


        this.playerDisplay.addEventListener(dragonBones.EventObject.FRAME_EVENT, this._onFrameEvent, this);



        /**
         *
         * getBone,getSlot
         *
         * 以下很多关于y的坐标，都得取反。因为在龙骨中，我们将锚点置于角色的脚下；且龙骨中，向上y是 减少的；而在creator的坐标中，向上的加的；
         * 所以关于y轴的坐标，都得进行取反；
         */





        //开启碰撞体的检测
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //碰撞检测系统的 debug 绘制
        manager.enabledDebugDraw = true;
        //显示碰撞组件的包围盒
        manager.enabledDrawBoundingBox = true;

        this.playerHandCollider.enabled = false;

    },
    _onFrameEvent(event){
        if (event.name === "atk1"){
            this.playerHandCollider.enabled = true;
            //cc.log("帧事件触发攻击碰撞检测：");
        }else if (event.name === "atk1_check_end"){
            this.playerHandCollider.enabled = false;
        }

    },
    _keyHandler: function(keyCode, isDown) {
        if (this._attackState){
            return;
        }

        switch(keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._left = isDown;
                this._updateMove(-1);
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._right = isDown;
                this._updateMove(1);
                break;
            /*case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this._up = isDown;
                this._updateMove(1);
                break;
            case cc.macro.KEY.s:
            case cc.macro.KEY.down:
                this._down = isDown;
                this._updateMove(-1);
                break;*/
            case cc.macro.KEY.q:
                if (isDown) {
                    //this.switchWeaponR();
                }
                break;
            case cc.macro.KEY.e:
                if (isDown) {
                    //this.switchWeaponL();
                }
                break;
            case cc.macro.KEY.space:
                if (isDown) {
                    this.attack();
                }
                break;
            default:
                return;
        }
    },

    _updateMove : function (dir) {
        if (this._left && this._right) {
            this.move(dir);
        } else if (this._left) {
            this.move(-1);
        } else if (this._right) {
            this.move(1);
        }
        else {
            this.move(0);
        }
    },

    move : function(dir) {


        if (this._moveDir === dir) {
            return;
        }

        this._moveDir = dir;
        //this._updateAnimation();
        if (this._moveDir === 0) {
            this._speedX = 0;
            this._armature.animation.play("idle", -1, -1, 0, NORMAL_ANIMATION_GROUP);

        }else {

            if (this._moveDir * this._faceDir > 0) {
                this._speedX = MAX_MOVE_SPEED_FRONT * this._faceDir;
            } else {
                this._speedX = -MAX_MOVE_SPEED_BACK * this._faceDir;
            }
            this._walkState = this._armature.animation.play("walk", -1, -1, 0, NORMAL_ANIMATION_GROUP);

        }
    },
    attack(){

        if (this._attackState){
            return;
        }

        this._moveDir = 0;
        this._speedX = 0;

        this._attackState = this._armature.animation.play(
            "atk1", -1, -1,
            0, ATTACK_ANIMATION_GROUP, dragonBones.AnimationFadeOutMode.SameGroup
        );
    },
    _updatePosition : function() {

        if (this._moveDir === -1){
            this.node.scaleX = 1;
        }else if (this._moveDir === 1){
            this.node.scaleX = -1;
        }

        if (this._speedX !== 0) {
            this.node.x += this._speedX;
            // var minX = 0;
            // var maxX = cc.visibleRect.width;
            // if (this.node.x < minX) {
            //     this.node.x = minX;
            // } else if (this.node.x > maxX) {
            //     this.node.x = maxX;
            // }

            // -> 主摄像机跟随主角的X轴移动 <-
            let cameraX = this.node.x;
            //cameraX = cameraX < cc.visibleRect.width / 2 ?cc.visibleRect.width / 2:cameraX;
            this.camera.node.x = cameraX;
        }
/*
        if (this._speedY != 0) {
            if (this._speedY > 5 && this._speedY + G <= 5) {
                this._armature.animation.fadeIn("jump_3", -1, -1, 0, NORMAL_ANIMATION_GROUP);
            }

            this._speedY += G;

            this.node.y += this._speedY;
            if (this.node.y < GROUND) {
                this.node.y = GROUND;
                this._isJumpingA = false;
                this._isJumpingB = false;
                this._speedY = 0;
                this._speedX = 0;
                this._armature.animation.fadeIn("jump_4", -1, -1, 0, NORMAL_ANIMATION_GROUP);
                if (this._isSquating || this._moveDir) {
                    this._updateAnimation();
                }
            }
        }*/
    },
    start () {

    },
    _animationEventHandler: function (event) {
        if (event.type === dragonBones.EventObject.LOOP_COMPLETE) {
            if (event.animationState.name === "atk1") {
                this._attackState = null;
                this._armature.animation.play("idle", -1, -1, 0, NORMAL_ANIMATION_GROUP);
            }
        }
    },
    update : function (dt) {

        this._updatePosition();



        //this._updateAim();
        //this._enterFrameHandler(dt);
        let handBoundingBoxSlot = this._armature.getSlot("hand_boundingBox");
        let bone = handBoundingBoxSlot.parent.parent;

        //跟随骨头 -- 已验证，正确

        /*this.testSp.node.x  = bone.global.x;
        this.testSp.node.y  = -bone.global.y;
        //这里为何加90，是因为整个父骨骼是做了-90度的旋转的（人物站立90度）。
        this.testSp.node.angle = bone.global.rotation * 180/Math.PI+90;//angle == setRotation
        //1弧度=180/pai 度
        //1度=pai/180 弧度
        */

        //以下方式为手动计算当前slot的坐标  -- 已验证，正确
        /*
        let result = {x:0,y:0};
        handBoundingBoxSlot.updateTransformAndMatrix(); // 更新他的转化矩阵信息,这个是必须更新的；不更新的话，不会变化；
        handBoundingBoxSlot.globalTransformMatrix.transformPoint(0,0,result,false);  //这里传入 0，0，也就是本身了。
        this.testSp.node.x = result.x;
        this.testSp.node.y = (-result.y);//注意这里需要取反
        */

        //其实可以直接使用  -- 已验证，正确
        /*
        handBoundingBoxSlot.updateTransformAndMatrix();
        this.testSp.node.x = handBoundingBoxSlot.globalTransformMatrix.tx;
        this.testSp.node.y = (-handBoundingBoxSlot.globalTransformMatrix.ty);//注意这里需要取反
        */

        //若要使用global，那么要先更新 updateGlobalTransform  -- 已验证，正确
        /*
        handBoundingBoxSlot.updateGlobalTransform();
        this.testSp.node.setRotation(handBoundingBoxSlot.global.rotation * 180/Math.PI + 180);
        */

        //随着边界框移动 -- 已验证，正确
        /*
        handBoundingBoxSlot.updateTransformAndMatrix();
        handBoundingBoxSlot.updateGlobalTransform();
        this.testSp.node.x  = handBoundingBoxSlot.global.x;
        this.testSp.node.y  = -handBoundingBoxSlot.global.y;
        this.testSp.node.setRotation(handBoundingBoxSlot.global.rotation * 180/Math.PI + 180);
        */

        handBoundingBoxSlot.updateTransformAndMatrix();
        handBoundingBoxSlot.updateGlobalTransform();
        this.particle.node.x = handBoundingBoxSlot.global.x;
        this.particle.node.y = -handBoundingBoxSlot.global.y;

        //在外边框添加碰撞体
        this.paint();

        //检查某个点是否和边界框碰撞
        this.checkPoint();

        //换装
        this.changSlotDisplay();
    },

    changSlotDisplay(){
        //换装 index 从0开始；如果不想显示，例如拿掉帽子，可以设为-1
        let maoziSlot = this._armature.getSlot("maozi");
        //maoziSlot.displayIndex = Math.floor(Math.random()*(1-0+1)+0);
        maoziSlot.displayIndex = 1;
    },

    checkPoint(){
        //armature中一个卡曹slot和一个点碰撞检测
        let handBoundingBoxSlot = this._armature.getSlot("hand_boundingBox");
        //这里的坐标为display为坐标轴的坐标位置； 然0，49刚好是手的位置。  这里取反y；进行碰撞检测
        let r = handBoundingBoxSlot.containsPoint(-16,-49);//这里的y也要取反
        //cc.log("one to one contain:"+r);

        //armature中包含的所有碰撞框是否与点(x,y)发生碰撞
        let r1 = this._armature.containsPoint(-16,-49);//这里的y也要取反
        //返回的是那些发生了碰撞的 slot
        //cc.log("more to one contain:"+r1);

        //let r2 = handBoundingBoxSlot.intersectsSegment(-16,-49,50,-49);

        //坐标转换一下，先变成世界坐标，然后转乘 骨架坐标
        let worldPos = (this.colorSp.node.getParent()).convertToWorldSpaceAR(this.colorSp.node.getPosition());
        let nodePos = this.playerDisplay.node.convertToNodeSpaceAR(worldPos);

        //通过slot名xxx获取Slot, 检测是否与点A(xA,yA)和点B(xB, yB)组成的线段发生碰撞
        let r2 = handBoundingBoxSlot.intersectsSegment(nodePos.x,-nodePos.y,nodePos.x+50,-nodePos.y);
        //cc.log("one to oneline contain:"+r2);


        //Armature.intersectsSegment(xA:number,yA:number,xB:number,yB:number):Array
        // 检测armature中包含的所有碰撞框是否与点A(xA,yA)和点B(xB, yB)组成的线段发生碰撞

    },

    //在外边框添加碰撞体，外边框完全与编辑器的一致slot-- 已验证，正确
    paint(){
        if (!this.playerHandCollider.enabled) return;

        let slot = this._armature.getSlot("hand_boundingBox"); // 获取某一个Slot对象
        slot.updateTransformAndMatrix(); // 更新他的转化矩阵信息

        let boxData = slot.boundingBoxData.vertices; //取到该处碰撞框的各个定点坐标

        this.accNum = 0;
        //let collider;  // 为节点加上一个多边形碰撞框
        //collider = this.node.getComponent(cc.PolygonCollider);
        // if(!collider){
        //     collider = this.node.addComponent(cc.PolygonCollider);
        // }

        //collider.enabled = false;
        this.playerHandCollider.points = [];
        //boxData = [0,0,20,0,10,10,0,10]; test数据
        for(let i = 0; i<boxData.length ; i++){
            let vec;
            if( i % 2 === 0){
                let result = {x:0,y:0};
                //将基于slot的Pos 转换 成基于display.node的坐标（也就是global坐标）；
                slot.globalTransformMatrix.transformPoint(boxData[i],boxData[i+1],result,false);  // 使用矩阵转化各个顶点坐标（一开始是正常的，随后慢慢偏移，怀疑是转化矩阵计算错误？）
                vec = cc.v2(result.x-this.accNum,-result.y);
                this.playerHandCollider.points.push(vec);  // 根据顶点坐标绘制碰撞框
            }
        }
    },

    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;

        this.guaiwuDisplay.node.x -= 10;

        this.particle.enabled = true;

    },

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionStay: function (other, self) {
        console.log('on collision stay');
    },

    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
    }
});
