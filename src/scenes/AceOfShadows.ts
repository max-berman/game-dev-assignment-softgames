import { Application, Container, DisplayObject, Sprite } from 'pixi.js';
import { Assets } from '@pixi/assets';
import { gsap } from "gsap";

export default class AceOfShadows {
  private app: Application;
  private stack: Container[];
  private assets: Record<string, any> = {};
  private static readonly CARD_ASSET_PATH = 'assets/sprites/cardBack.png';
  private static readonly TOTAL_CARDS: number = 144;
  private static readonly CARDS_SHIFTER: number = 3;
  private intervalId: number | undefined;

  constructor(app: Application) {
    this.app = app;
    this.stack = [];
    this.start();
  }

  private async start() {
    try {
      await this.loadAssets();
      this.createStacks();
      this.moveCard();
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  }

  private async loadAssets() {
    const manifest = {
      bundles: [{
        name: 'bundle',
        assets: [
          {
            name: 'card',
            src: AceOfShadows.CARD_ASSET_PATH
          }
        ]
      }]
    };

    await Assets.init({ manifest });
    this.assets = await Assets.loadBundle('bundle');
  }

  private getStackCenter() {
    return {
      x: this.app.renderer.width / 2,
      y: this.app.renderer.height / 2
    };
  }

  private createCard(x: number, y: number, index: number) {
    const card = Sprite.from(this.assets.card);
    card.anchor.set(0.5);
    card.position.set(x, y + index * AceOfShadows.CARDS_SHIFTER);
    return card as unknown as DisplayObject;
  }

  private createStacks() {
    const { x: centerX, y: centerY } = this.getStackCenter();
    const stack = new Container();

    for (let i = 0; i < AceOfShadows.TOTAL_CARDS; i++) {
      stack.addChild(this.createCard(centerX * 0.5, centerY * 0.5, i));
    }

    this.app.stage.addChild(stack as unknown as DisplayObject);
    this.stack.push(stack);
  }

  private moveCard() {
    let counter = 0;
    const { x: centerX, y: centerY } = this.getStackCenter();

    this.intervalId = window.setInterval(() => {
      if (!this.stack[0].children.length) {
        clearInterval(this.intervalId);
        return;
      }

      const topCard = this.stack[0].children.pop() as Sprite;

      gsap.to(topCard.position, {
        x: centerX + centerX * 0.5,
        y: centerY * 0.5 + counter * AceOfShadows.CARDS_SHIFTER,
        duration: 1,
        ease: "power3.inOut"
      });

      this.app.stage.addChild(topCard as unknown as DisplayObject);
      counter++;
    }, 2000);
  }

  public destroy() {
    // Clear all intervals
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }

    // Remove all cards from the stage and destroy them
    this.stack.forEach(container => {
      container.children.forEach(child => {
        this.app.stage.removeChild(child as DisplayObject);
        (child as Sprite).destroy();
      });
      container.destroy({ children: true });
    });

    this.stack = [];
  }
}