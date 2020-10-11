
interface Navigator {
  webkitGetGamepads(): (Gamepad | null)[];
}

interface GamepadHapticActuator {
  playEffect(type: string, options: any): Promise<string>;
  reset(): Promise<string>;
}

interface Gamepad {
  vibrationActuator: GamepadHapticActuator;
}

/**
 * Contains functions and properties related to game inventory.
 * @beta
 */
interface FBBetaInventory {
  unlockItemAsync(unlockableItemConfig: any): Promise<any>;
}
