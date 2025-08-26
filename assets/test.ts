// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Camera)
    catchCamera: cc.Camera = null;

    @property(cc.Sprite)
    originSprite: cc.Sprite = null;

    @property(cc.Sprite)
    targetSprite: cc.Sprite = null;

    protected start(): void {
        
        const rt = new cc.RenderTexture();
        const { width, height } = cc.winSize;

        rt.initWithSize(width, height);
        let nodeX = cc.winSize.width / 2 + this.originSprite.node.x - this.originSprite.node.width / 2;
        let nodeY = cc.winSize.height / 2 + this.originSprite.node.y - this.originSprite.node.height / 2;
        let nodeWidth = this.originSprite.node.width;
        let nodeHeight = this.originSprite.node.height;
        const spf = new cc.SpriteFrame();
        spf.setTexture(rt, new cc.Rect(nodeX, nodeY, nodeWidth, nodeHeight));
        this.catchCamera.targetTexture = rt;
        this.targetSprite.spriteFrame = spf;

    }
}
