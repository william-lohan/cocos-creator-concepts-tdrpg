
const { ccclass, property } = cc._decorator;

export enum InputButton {
  NONE = 0b00000000,
  UP = 0b00000001,
  DOWN = 0b00000010,
  LEFT = 0b00000100,
  RIGHT = 0b00001000,
  ACTION = 0b00010000
}

@ccclass
export class Input extends cc.Component {

  @property({
    min: 0,
    max: 1
  })
  public deadZone: number = 0.2;

  public currentInput: number = 0;

  public rawInputMap: Map<number, boolean> = new Map();

  private gamepad: Gamepad;

  private onGamepadConnected = ({ gamepad }: GamepadEvent) => {
    if (gamepad.index === 0) {
      this.gamepad = gamepad;
    }
  }

  private onGamepadDisconnected = ({ gamepad }: GamepadEvent) => {
    if (gamepad.index === 0) {
      this.gamepad = null;
    }
  }

  //#region LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
  }

  protected start(): void {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  // protected update(dt: number): void { }

  protected onDestroy(): void {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  //#endregion

  public getCurrentInput(): InputButton {
    if (this.gamepad) {
      let currentInput = InputButton.NONE;
      this.getGamepads()[0].buttons.forEach((button, index) => {
        if (button.value) {
          switch (index) {
            case 12:
              currentInput = currentInput | InputButton.UP;
              break;
            case 13:
              currentInput = currentInput | InputButton.DOWN;
              break;
            case 14:
              currentInput = currentInput | InputButton.LEFT;
              break;
            case 15:
              currentInput = currentInput | InputButton.RIGHT;
              break;
            case 0:
              currentInput = currentInput | InputButton.ACTION;
              this.feedBack();
              break;
          }
        }
      });
      return currentInput;
    } else {
      return this.currentInput;
    }
  }

  public feedBack(): Promise<void> {
    // Chrome/Edge
    if (this.gamepad && this.gamepad.vibrationActuator) {
      // https://gamepad-tester.com/for-developers
      // https://github.com/bwiklund/gamepad.js/blob/248364a1793571794f7043f97f24d4619b8a4f3d/src/component/GamepadItem.tsx#L57
      return this.gamepad.vibrationActuator.playEffect('dual-rumble', {
        startDelay: 0,
        duration: 500,
        weakMagnitude: 0.5,
        strongMagnitude: 0.5
      }).then();
    }
    // FireFox (untested)
    if (this.gamepad && this.gamepad.hapticActuators && this.gamepad.hapticActuators.length) {
      return this.gamepad.hapticActuators[0].pulse(0.5, 500).then();
    }
    return Promise.resolve();
  }

  private getGamepads(): Gamepad[] {
    if (typeof navigator.getGamepads === 'function') {
      return navigator.getGamepads();
    }
    if (typeof navigator.webkitGetGamepads === 'function') {
      return navigator.webkitGetGamepads();
    }
    return [];
  }

  private onKeyDown({ keyCode }: cc.Event.EventKeyboard): void {
    this.rawInputMap.set(keyCode, true);
    switch (keyCode) {
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.currentInput = this.currentInput | InputButton.UP;
        break;
      case cc.macro.KEY.s:
      case cc.macro.KEY.down:
        this.currentInput = this.currentInput | InputButton.DOWN;
        break;
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.currentInput = this.currentInput | InputButton.LEFT;
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.currentInput = this.currentInput | InputButton.RIGHT;
        break;
      case cc.macro.KEY.space:
        this.currentInput = this.currentInput | InputButton.ACTION;
        break;
    }
  }

  private onKeyUp({ keyCode }: cc.Event.EventKeyboard): void {
    this.rawInputMap.set(keyCode, false);
    switch (keyCode) {
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.currentInput = this.currentInput & (~InputButton.UP);
        break;
      case cc.macro.KEY.s:
      case cc.macro.KEY.down:
        this.currentInput = this.currentInput & (~InputButton.DOWN);
        break;
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.currentInput = this.currentInput & (~InputButton.LEFT);
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.currentInput = this.currentInput & (~InputButton.RIGHT);
        break;
      case cc.macro.KEY.space:
        this.currentInput = this.currentInput & (~InputButton.ACTION);
        break;
    }
  }

}

export default Input;
