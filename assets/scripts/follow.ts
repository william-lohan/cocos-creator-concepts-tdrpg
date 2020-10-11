
const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Camera)
export default class Follow extends cc.Component {

  @property(cc.Node)
  public player: cc.Node = null;

  //#region LIFE-CYCLE CALLBACKS:

  protected start(): void {
    // const action = cc.follow(this.player, undefined as any);
    // this.node.runAction(action);
  }

  protected update(dt: number): void {
    if (this.player) {
      const position = cc.v2(
        this.player.position.x - this.player.parent.position.x - this.node.parent.width / 2,
        this.player.position.y - this.player.parent.position.y - this.node.parent.height / 2
      );
      this.node.setPosition(position);
    }
  }

  //#endregion

}
