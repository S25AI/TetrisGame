require(
  ['actor', 'grid', 'schema', 'gameStats', 'actorModel', 'utils/gridHelpers',
  'utils/mathHelpers', 'constants/index', 'utils/domHelpers', 'utils/storage'],
  (Actor, Grid, {T, J, L, Z, S, Q, I}, Game, ActorModel, GridHelpers, MathHelpers,
  {GAME_CONTAINER, GRID_HEIGHT, GRID_WIDTH}, dom, Storage) => 
{
  function run() {
    const grid = new Grid(GRID_HEIGHT, GRID_WIDTH);
    const game = new Game();
    const board = dom.elt('div', 'board', '');
    const theBestScore = Storage.getItem();
    GAME_CONTAINER.append(grid.el);
    GAME_CONTAINER.append(board);
    let gridCoords = GridHelpers.getCoords(grid.el);

    function gameStart({gameOver = false, score = 0} = {}) {
      game.updateCounter(score);
      board.innerHTML = `The best score is : ${theBestScore}<br /><br />Your score is: ${game.score}`;

      if (gameOver) {
        Storage.setItem({value: game.score});
        alert('gameOver');
        destroy();
      } else {
        let current = [T, J, L, Z, S, Q, I][MathHelpers.getRandomInt(0, 7)];
        let actor = new Actor(gridCoords, grid, new ActorModel(current));
      
        GAME_CONTAINER.append(actor.el);

        this.timerId = setInterval(() => {
          actor.updateActorPos({cb: gameStart, timerId: this.timerId});
        }, 500 / game.speed);
      }
    }
  
    gameStart();
  }

  function destroy() {
    GAME_CONTAINER.innerHTML = '';
    run();
  }

  run();
});