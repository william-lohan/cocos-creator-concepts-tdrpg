
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
