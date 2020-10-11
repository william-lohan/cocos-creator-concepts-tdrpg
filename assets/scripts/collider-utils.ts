
export type Collider = cc.Collider & (cc.BoxCollider | cc.CircleCollider | cc.PolygonCollider);

export function isBoxCollider(collider: cc.Collider): collider is cc.BoxCollider {
  return collider instanceof cc.BoxCollider || collider.hasOwnProperty('size');
}

export function isCircleCollider(collider: cc.Collider): collider is cc.CircleCollider {
  return collider instanceof cc.CircleCollider || collider.hasOwnProperty('radius');
}

export function isPolygonCollider(collider: cc.Collider): collider is cc.PolygonCollider {
  return collider instanceof cc.PolygonCollider || collider.hasOwnProperty('points');
}
