import { Application, DisplayObject, Text, TextStyle, BaseTexture, SCALE_MODES } from 'pixi.js';
import AceOfShadows from './scenes/AceOfShadows';
import VerbalMagic from './scenes/VerbalMagic';
import PhoenixFlame from './scenes/PhoenixFlame';

BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST

export default class Game {
  public app: Application;
  private fpsText: Text;
  private currentScene: { destroy: () => void } | null = null;

  constructor() {
    this.app = new Application({
      width: 720,
      height: 1280,
      autoDensity: true,
      resolution: 1,
      antialias: true,
      backgroundColor: 0x1099bb,
      // resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(this.app.view as HTMLCanvasElement);

    const style = new TextStyle({
      fontFamily: "\"Lucida Console\", Monaco, monospace",
      fontSize: 18
    });

    this.fpsText = new Text('', style);

    this.fpsText.position.set(10, 10);

    this.app.ticker.add((delta) => {
      this.updateFPS();
    });

    this.handleResize();

    window.addEventListener('resize', this.handleResize.bind(this));

  }

  private updateFPS() {
    this.fpsText.text = `FPS: ${(this.app.ticker.FPS).toFixed(2)}`;
  }


  public loadScene(index: number) {
    if (this.currentScene) {
      this.currentScene.destroy();
    }

    // Clear all children except the fpsText
    this.app.stage.removeChildren();
    this.app.stage.addChild(this.fpsText as unknown as DisplayObject);

    const scenes = [
      AceOfShadows,
      VerbalMagic,
      PhoenixFlame
    ];

    if (index >= 0 && index < scenes.length) {
      this.currentScene = new scenes[index](this.app);
    }
  }

  private handleResize() {
    const ratio = 720 / 1280;
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (width / height >= ratio) {
      width = height * ratio;
    } else {
      height = width / ratio;
    }

    this.app.renderer.resize(width, height);
  }

  public callFunction(): void {
    console.log('gotcha!')
  }
}
