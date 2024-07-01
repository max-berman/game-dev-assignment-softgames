import { Application, Graphics, DisplayObject, TextStyle, Text } from 'pixi.js';
import gsap from 'gsap';

const colors = [0xf48c06, 0xfaa307, 0xffba08]

export default class PhoenixFlame {
  private app: Application;
  private particles: Graphics[];
  private static readonly TOTAL_PARTICLES = 70;
  private static readonly PARTICLE_SIZE_MIN = 3;
  private static readonly PARTICLE_SIZE_MAX = 15;
  private static readonly DISTANCE_MIN = 70;
  private static readonly DISTANCE_MAX = 150;
  private static readonly EMIT_INTERVAL = 90;
  private static readonly ANIMATION_DURATION = 1.5;
  private emitIntervalId: number | undefined;
  private woodEmoji: Text;

  constructor(app: Application) {
    this.app = app;
    this.particles = [];
    this.woodEmoji = new Text('');
    this.app.stage.addChild(this.woodEmoji as unknown as DisplayObject);
    this.addWood();
    this.createParticleEmitter();
  }

  private addWood() {
    this.woodEmoji.text = `🪵`
    this.woodEmoji.style = new TextStyle({ fontSize: 128 });
    this.woodEmoji.x = this.app.renderer.width / 2 - 72;
    this.woodEmoji.y = this.app.renderer.height / 2;
  }


  private createParticleEmitter() {
    this.emitIntervalId = window.setInterval(() => {
      for (let i = 0; i < PhoenixFlame.TOTAL_PARTICLES; i++) {
        this.emitParticle();
      }
    }, PhoenixFlame.EMIT_INTERVAL);
  }

  private emitParticle() {
    const particle = new Graphics();
    const size = PhoenixFlame.PARTICLE_SIZE_MIN + Math.random() * (PhoenixFlame.PARTICLE_SIZE_MAX - PhoenixFlame.PARTICLE_SIZE_MIN);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const randomRangeX = Math.floor(Math.random() * 41) - 20
    const randomRangeY = Math.floor(Math.random() * 41) - 20
    particle.beginFill(color);
    particle.drawCircle(0, 0, Math.floor(Math.random() * size));
    particle.endFill();

    particle.position.set(this.app.renderer.width / 2 + randomRangeX, this.app.renderer.height / 2 + randomRangeY);
    this.app.stage.addChild(particle as unknown as DisplayObject);
    this.particles.push(particle);

    // Calculate a random angle between 45 and 135 degrees
    const angle = 45 + Math.random() * 90;
    const radians = (-angle * Math.PI) / 180;

    const distance = PhoenixFlame.DISTANCE_MAX + Math.random() * PhoenixFlame.DISTANCE_MIN; // Random distance between 150 and 220

    // Calculate target position based on angle
    const targetX = particle.position.x + Math.cos(radians) * distance;
    const targetY = particle.position.y + Math.sin(radians) * distance;

    gsap.to(particle.position, {
      x: targetX,
      y: targetY,
      duration: PhoenixFlame.ANIMATION_DURATION,
      onComplete: () => {
        this.app.stage.removeChild(particle as unknown as DisplayObject);
        this.particles = this.particles.filter(p => p !== particle);
      }
    });

    // Fade out the particle
    gsap.to(particle, {
      alpha: 0,
      duration: PhoenixFlame.ANIMATION_DURATION,
      onComplete: () => {
        this.app.stage.removeChild(particle as unknown as DisplayObject);
        this.particles = this.particles.filter(p => p !== particle);
      }
    });
  }

  public destroy() {
    // Clear all particles from the stage and stop their animations
    this.particles.forEach(particle => {
      gsap.killTweensOf(particle);
      this.app.stage.removeChild(particle as unknown as DisplayObject);
      particle.destroy();
    });
    this.particles = [];

    // Clear the interval to stop emitting new particles
    if (this.emitIntervalId !== undefined) {
      clearInterval(this.emitIntervalId);
    }

    // Remove text display from the stage and destroy it
    this.app.stage.removeChild(this.woodEmoji as unknown as DisplayObject);
    this.woodEmoji.destroy();

  }
}
