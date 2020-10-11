import { Input, InputButton } from './input';
import { Player } from './player';

const { ccclass, property, requireComponent } = cc._decorator;

const minTilesCount = 2;
const mapMoveStep = 1;
const minMoveValue = 50;

@ccclass
@requireComponent(cc.TiledMap)
export default class Level extends cc.Component {

  @property(Input)
  public input: Input = null;

  private player: cc.Node;

  private tiledMap: cc.TiledMap;

  private markersObjectGroup: cc.TiledObjectGroup;

  private startMarker: cc.Rect;

  private endMarker: cc.Rect;

  private groundLayer: cc.TiledLayer;

  startTile: cc.Vec2;
  curTile: cc.Vec2;
  endTile: cc.Vec2;

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    this.player = this.node.getChildByName('player');
    this.tiledMap = this.node.getComponent(cc.TiledMap);

    this.markersObjectGroup = this.tiledMap.getObjectGroup('markers');
    const start = this.markersObjectGroup.getObject('start');
    const end = this.markersObjectGroup.getObject('end');
    this.startMarker = new cc.Rect(start.x, start.y, start.width, start.height);
    this.endMarker = new cc.Rect(end.x, end.y, end.width, end.height);

    this.groundLayer = this.tiledMap.getLayer('ground');


    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
    // manager.enabledDrawBoundingBox = true;

  }

  protected start(): void {
    // init the map position
    this.node.setPosition(cc.visibleRect.bottomLeft);

    // init the player position
    this.curTile = this.startTile = this.getTilePos(this.getCenter(this.startMarker));
    this.endTile = this.getTilePos(this.getCenter(this.endMarker));
    this.updatePlayerPos(this.groundLayer.getPositionAt(this.curTile));
  }

  /**
   * "Main" Loop
   * @param dt 
   */
  protected update(dt: number): void {

    // TODO move map
  }

  protected onDestroy(): void { }

  //#endregion

  private getTilePos(posInPixel: cc.Vec2): cc.Vec2 {
    const mapSize = this.node.getContentSize();
    const tileSize = this.tiledMap.getTileSize();
    const x = Math.floor(posInPixel.x / tileSize.width);
    const y = Math.floor((mapSize.height - posInPixel.y) / tileSize.height);
    return cc.v2(x, y);
  }

  private getCenter({ x, y, width, height }: cc.Rect): cc.Vec2 {
    return cc.v2(x + (width / 2), y + (height / 2));
  }

  private updatePlayerPos(position: cc.Vec2): void {
    this.player.getComponent(Player).updatePosition(position);
  }

  private tryMoveToNewTile(newTile: cc.Vec2, mapMoveDir: InputButton): void {
    const mapSize = this.tiledMap.getMapSize();
    if (newTile.x < 0 || newTile.x >= mapSize.width) return;
    if (newTile.y < 0 || newTile.y >= mapSize.height) return;

    // if (this._layerBarrier.getTileGIDAt(newTile)) {
    //     cc.log('This way is blocked!');
    //     return false;
    // }

    // update the player position
    this.curTile = newTile;
    this.updatePlayerPos(this.groundLayer.getPositionAt(this.curTile));

    // move the map if necessary
    this.tryMoveMap(mapMoveDir);

    // check the player is success or not
    if (this.curTile.equals(this.endTile)) {
      cc.log('succeed');
      // this._succeedLayer.active = true;
    }
  }

  private tryMoveMap(moveDir: InputButton): void {
    // get necessary data
    const mapContentSize = this.node.getContentSize();
    const mapPos = this.node.getPosition();
    const playerPos = this.player.getPosition();
    const viewSize = cc.size(cc.visibleRect.width, cc.visibleRect.height);
    const tileSize = this.tiledMap.getTileSize();
    const minDisX = minTilesCount * tileSize.width;
    const minDisY = minTilesCount * tileSize.height;

    const disX = playerPos.x + mapPos.x;
    const disY = playerPos.y + mapPos.y;
    let newPos: cc.Vec2;

    if (moveDir & InputButton.UP) newPos = cc.v2(mapPos.x, mapPos.y + tileSize.height * mapMoveStep);
    if (moveDir & InputButton.DOWN) newPos = cc.v2(mapPos.x, mapPos.y - tileSize.height * mapMoveStep);
    if (moveDir & InputButton.LEFT) newPos = cc.v2(mapPos.x - tileSize.width * mapMoveStep, mapPos.y);
    if (moveDir & InputButton.RIGHT) newPos = cc.v2(mapPos.x + tileSize.width * mapMoveStep, mapPos.y);

    if (newPos) {
      // calculate the position range of map
      const minX = viewSize.width - mapContentSize.width - (cc.visibleRect.left as any);
      const maxX = cc.visibleRect.left.x;
      const minY = viewSize.height - mapContentSize.height - (cc.visibleRect.bottom as any);
      const maxY = cc.visibleRect.bottom.y;

      if (newPos.x < minX) newPos.x = minX;
      if (newPos.x > maxX) newPos.x = maxX;
      if (newPos.y < minY) newPos.y = minY;
      if (newPos.y > maxY) newPos.y = maxY;

      if (!newPos.equals(mapPos)) {
        cc.log('Move the map to new position: ', newPos);
        this.node.setPosition(newPos);
      }
    }
  }

}
