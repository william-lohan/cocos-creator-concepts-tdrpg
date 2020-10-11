
const { ccclass, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.TiledLayer)
export default class CollisionLayer extends cc.Component {

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    const layer = this.node.getComponent(cc.TiledLayer);
    layer.enabled = true;
    const tileSize = layer.getMapTileSize();
    const { width, height } = layer.getLayerSize();
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const tile = layer.getTiledTileAt(x, y, true);
        if (tile && tile.gid != 0) {
          // add collider
          const collider = this.addComponent(cc.BoxCollider);
          collider.size = cc.size(tileSize);

          // Right Down to Right Up?
          const xOffset = (tile.x * tileSize.width) + (tileSize.width / 2);
          const yOffset = (height * tileSize.height) - ((tile.y * tileSize.height) + (tileSize.height / 2));
          collider.offset = cc.v2(xOffset, yOffset);
        }
      }
    }
  }

  //#endregion

}
