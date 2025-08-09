// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollBall extends cc.Component {
    
    private scrollAxis = cc.v3(1, 0, 0);
    private scrollSpeed = 1;
    
    private mat = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ]

    private material: cc.Material;
    private totalRotation = 0;
    
    // 新增纹理控制参数
    public textureScale: number = 0.5;
    public textureOffsetX: number = 0.0;
    public textureOffsetY: number = 0.0;

    protected start(): void {
        this.init();
    }

    init() {
        this.setRandomAxis();
        this.material = (this.getComponent(cc.Sprite) || this.node.getComponentInChildren(cc.Sprite)).getMaterial(0);
    }

    setRandomAxis() {
        this.scrollAxis.x = Math.random() * 2 - 1;
        this.scrollAxis.y = Math.random() * 2 - 1;
        this.scrollAxis.z = Math.random() * 2 - 1;
        this.scrollAxis.normalizeSelf();
    }

    calculateAbsolutionRotation(totalRad: number, x: number, y: number, z: number) {
        const s = Math.sin(totalRad);
        const c = Math.cos(totalRad);
        const t = 1 - c;

        // 罗德里格旋转公式：R = I + sin(θ)[k]× + (1-cos(θ))[k]×²
        // 直接计算绝对旋转矩阵，无累积误差
        this.mat[0] = x * x * t + c;        // R11
        this.mat[1] = y * x * t + z * s;    // R12  
        this.mat[2] = z * x * t - y * s;    // R13
        
        this.mat[3] = x * y * t - z * s;    // R21
        this.mat[4] = y * y * t + c;        // R22
        this.mat[5] = z * y * t + x * s;    // R23
        
        this.mat[6] = x * z * t + y * s;    // R31
        this.mat[7] = y * z * t - x * s;    // R32
        this.mat[8] = z * z * t + c;        // R33
    }

    update(dt) {
        if (!this.material) return;

        this.totalRotation += dt * this.scrollSpeed;
        this.calculateAbsolutionRotation(this.totalRotation, this.scrollAxis.x, this.scrollAxis.y, this.scrollAxis.z);

        // 更新旋转矩阵
        this.material.setProperty("matrixRow0", [this.mat[0], this.mat[1], this.mat[2], 0]);
        this.material.setProperty("matrixRow1", [this.mat[3], this.mat[4], this.mat[5], 0]);
        this.material.setProperty("matrixRow2", [this.mat[6], this.mat[7], this.mat[8], 0]);
        this.material.setProperty("matrixRow3", [0, 0, 0, 1]);
        
        // 更新纹理参数
        this.material.setProperty("textureScale", this.textureScale);
        this.material.setProperty("textureOffset", [this.textureOffsetX, this.textureOffsetY]);
    }
    
    // 动态设置纹理大小
    setTextureScale(scale: number) {
        this.textureScale = Math.max(0.1, scale); // 防止过小
    }
    
    // 动态设置纹理偏移
    setTextureOffset(x: number, y: number) {
        this.textureOffsetX = x;
        this.textureOffsetY = y;
    }
    
    // 组合设置方法
    setTextureTransform(scale: number, offsetX: number = 0, offsetY: number = 0) {
        this.setTextureScale(scale);
        this.setTextureOffset(offsetX, offsetY);
    }
}
