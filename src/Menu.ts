import Game from './Game';

export default class Menu {
  private aceOfShadowsButton!: HTMLButtonElement;
  private verbalMagicButton!: HTMLButtonElement;
  private phoenixFlameButton!: HTMLButtonElement;


  constructor(private game: Game) {
    this.createMenu();
  }

  private createMenu() {
    const menuItems = ['Ace of Shadows 🂡', 'Verbal Magic 🔮', 'The Phoenix Flame 🔥'];
    const menu = document.createElement('div');
    menu.id = `game-menu`;

    menuItems.forEach((item, index) => {
      const button = document.createElement('button');
      button.textContent = item;
      button.id = `menu-item-${index}`;
      button.addEventListener('click', () => this.game.loadScene(index));
      menu.appendChild(button);
    });

    document.body.appendChild(menu);
  }
}


