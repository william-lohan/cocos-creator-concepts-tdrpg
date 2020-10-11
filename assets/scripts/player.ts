import { Collider, isBoxCollider, isCircleCollider, isPolygonCollider } from './collider-utils';
import { Input, InputButton } from './input';

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.BoxCollider)
export class Player extends cc.Component {

  /**
   * Pixels per second
   */
  @property({
    type: cc.Integer,
    min: 0
  })
  public speed: number = 4;

  @property(Input)
  public input: Input = null;

  private isColliding: boolean = false;

  //#region LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {

  }

  protected onEnable(): void {
    cc.director.getCollisionManager().enabled = true;
  }

  protected update(dt: number): void {
    const moveAmount = this.speed * (dt * 60);
    const currentPos = cc.v2(this.node.position);
    const input = this.input.getCurrentInput();
    // console.log(input.toString(2));
    if (input != InputButton.NONE) {
      if (input & InputButton.UP) currentPos.y += moveAmount;
      if (input & InputButton.DOWN) currentPos.y -= moveAmount;
      if (input & InputButton.LEFT) currentPos.x -= moveAmount;
      if (input & InputButton.RIGHT) currentPos.x += moveAmount;
      this.updatePosition(currentPos);
    }
  }

  //#endregion

  //#region Collision Manager Callback

  public onCollisionEnter(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = true;
    this.onCollisionEnterH(other, self);
  }

  public onCollisionEnterH(other: Collider, self: cc.BoxCollider): void {

    const playerAabb = self.world.aabb;
    const playerPreAabb = self.world.preAabb.clone();

    if (isBoxCollider(other)) {
      const otherAabb = other.world.aabb;
      const otherPreAabb = other.world.preAabb.clone();
      const intersection = new cc.Rect();
      playerAabb.intersection(intersection, otherAabb);
      if (intersection.width <= intersection.height) {
        // x clip
        if (playerPreAabb.x < otherPreAabb.x) {
          this.node.x -= intersection.width;
        } else {
          this.node.x += intersection.width;
        }
      } else {
        // y clip
        if (playerPreAabb.y < otherPreAabb.y) {
          this.node.y -= intersection.height;
        } else {
          this.node.y += intersection.height;
        }
      }
    }

    if (isCircleCollider(other)) {
      throw Error('CircleCollider not handled');
    }

    if (isPolygonCollider(other)) {
      throw Error('CircleCollider not handled');
    }

  }

  public onCollisionStay(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = true;
    this.onCollisionEnterH(other, self);
  }

  public onCollisionExit(other: Collider, self: cc.BoxCollider): void {
    this.isColliding = false;
  }

  //#endregion

  public updatePosition(position: cc.Vec2): void {
    this.node.setPosition(position);
  }

}

export default Player;
