import { Application, Text, DisplayObject, TextStyle } from 'pixi.js';

const moneySlang = ["BENJAMINS", "BILLS", "BRASS", "BUCKS", "CABBAGE", "DINERO", "DOUGH", "GRAND", "QUID", "SHEKELS"];
const moneyEmojis = ["💱", "💲", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "🪙"]
const colors = ["#03071e", "#370617", "#6a040f", "#9d0208", "#d00000", "#e85d04", "#faa307", "#ffba08", "#f1faee", "#000000"];


class VerbalMagic {
  private app: Application;
  private textDisplay: Text;
  private intervalId: number | undefined;

  constructor(app: Application) {
    this.app = app;
    this.textDisplay = new Text('');
    this.app.stage.addChild(this.textDisplay as unknown as DisplayObject);
    this.updateDisplay()
    this.intervalId = window.setInterval(() => this.updateDisplay(), 2000);
  }

  private updateDisplay() {
    const randomText = moneySlang[Math.floor(Math.random() * moneySlang.length)];
    const randomEmoji = moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)];
    const randomFontSize = Math.floor(Math.random() * (48 - 16 + 1)) + 16;
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    console.log(randomText, randomEmoji)

    this.textDisplay.text = `${randomText} ${randomEmoji}`
    this.textDisplay.style = new TextStyle({
      fontSize: randomFontSize,
      fill: `${randomColor}`,
      fontFamily: "Helvetica",
      strokeThickness: 1
    });
    this.textDisplay.x = Math.floor(Math.random() * (this.app.renderer.width - this.textDisplay.width));
    this.textDisplay.y = Math.floor(Math.random() * (this.app.renderer.height - this.textDisplay.height));
  }

  public destroy() {
    // Clear the interval to stop updating the display
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }

    // Remove text display from the stage and destroy it
    this.app.stage.removeChild(this.textDisplay as unknown as DisplayObject);
    this.textDisplay.destroy();
  }


}

export default VerbalMagic;
