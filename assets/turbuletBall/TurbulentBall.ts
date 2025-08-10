// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TurbulentBall extends cc.Component {
    
    @property(cc.Sprite)
    private targetSprite: cc.Sprite = null;

    @property(cc.Node)
    private sliders: cc.Node = null;

    private scrollAxis = cc.v3(1, 0, 0);
    private scrollSpeed = 0.5;
    private propMap: { [key: string]: number } = {};
    
    private mat = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
    ];

    private limitMap: { [key: string]: [number, number] } = {
        'turbulenceSpeed': [0.0, 2.0],
        'turbulenceAmplitude': [0.0, 2.0],
        'turbulenceFrequency': [0.1, 10.0],
        'turbulenceOctaves': [1.0, 20.0],
        'turbulenceExp': [1.0, 3.0],
        'turbulenceIntensity': [0.0, 2.0],
        'colorIntensity': [0.4, 1.5],
    };

    private material: cc.Material;
    private totalRotation = 0;
    
    // 新增纹理控制参数
    public textureScale: number = 0.5;
    public textureOffsetX: number = 0.0;
    public textureOffsetY: number = 0.0;

    protected start(): void {
        this.init();

        window['logProp'] = () => {
            console.log(JSON.stringify(this.propMap));
        };
        window['setSpeed'] = (val) => {
            this.scrollSpeed = val;
        }
    }

    init() {
        this.setRandomAxis();
        this.material = this.targetSprite.getMaterial(0);
        this.initSlider();
    }

    initSlider() {
        for (let i = 0; i < this.sliders.children.length; i++) {
            const slider = this.sliders.children[i];
            const sliderComp = slider.getComponent(cc.Slider);
            const val = this.material.getProperty(slider.name, 0);
            if (val == undefined) {
                console.log('can not find prop', slider.name);
                continue;
            }
            const limitData = this.limitMap[slider.name];
            const oriVal = (val - limitData[0]) / (limitData[1] - limitData[0]);
            sliderComp.progress = oriVal;
        }
    }

    setRandomAxis() {
        this.scrollAxis.x = Math.random() * 2 - 1;
        this.scrollAxis.y = Math.random() * 2 - 1;
        this.scrollAxis.z = Math.random() * 2 - 1;
        this.scrollAxis.normalizeSelf();
    }

    onSlider(slider: cc.Slider, ev: string) {
        const propName = slider.node.name;
        const res = this.material.getProperty(propName, 0);
        if (res == undefined) {
            console.log(res);
            return;
        }
        const val = this.getPropNum(propName, slider.progress);
        if (this.propMap[propName] && this.propMap[propName] === val) return;
        if (!this.propMap[propName]) {
            this.propMap[propName] = res;
        }
        else if (this.propMap[propName] !== val) {
            this.propMap[propName] = val;
        }
        console.log(val);
        this.material.setProperty(propName, val);
    }



    private getPropNum(prop: string, sliderVal: number) {
        const data = this.limitMap[prop];
        if (!data) return 0;
        const min = data[0];
        const max = data[1];
        const res = min + (max - min) * sliderVal;
        return Number(res.toFixed(2));
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
    }
}
