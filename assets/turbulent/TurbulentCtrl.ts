// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    private targetSprite: cc.Sprite = null;

    private material: cc.Material;

    private propMap: { [key: string]: number } = {};

    protected onLoad(): void {
        this.material = this.targetSprite.getMaterial(0);
    }

    onSlider(slider: cc.Slider, ev: string) {
        const res = this.material.getProperty(ev, 0);
        if (res == undefined) {
            console.log(res);
            return;
        }
        const val = this.getPropNum(ev, slider.progress);
        if (this.propMap[ev] && this.propMap[ev] === val) return;
        if (!this.propMap[ev]) {
            this.propMap[ev] = res;
        }
        else if (this.propMap[ev] !== val) {
            this.propMap[ev] = val;
        }
        this.material.setProperty(ev, val);
    }

    private getPropNum(prop: string, sliderVal: number) {
        let min = 0;
        let max = 0;
        let res = 0;
        switch (prop) {
            case 'turbulenceSpeed': {
                min = 0.0;
                max = 2.0;
            }
            break;
            case 'turbulenceAmplitude': {
                min = 0.0;
                max = 2.0;
            }
            break;
            case 'turbulenceFrequency': {
                min = 0.1;
                max = 10.0;
            }
            break;
            case 'turbulenceOctaves': {
                min = 1.0;
                max = 20.0;
            }
            break;
            case 'turbulenceExp': {
                min = 1.0;
                max = 3.0;
            }
            break;
            case 'turbulenceIntensity': {
                min = 0.0;
                max = 2.0;
            }
            break;
            case 'colorIntensity': {
                min = 0.0;
                max = 3.0;
            }
            break;
        }
        res = min + (max - min) * sliderVal;
        return Number(res.toFixed(1));
    }
}
