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
        let actor = new Actor(gridCoords, grid, new ActorModel(generateNewFigure()));
        GAME_CONTAINER.append(actor.el);
        runNextStep(game, actor, gameStart);
      }
    }
  
    gameStart();
  }

  function generateNewFigure() {
    return [T, J, L, Z, S, Q, I][MathHelpers.getRandomInt(0, 7)];
  }

  function runNextStep(game, actor, gameStart) {
    let currentDate = Date.now();
    let timerId = null;

    const step = () => {
      let date = Date.now();

      if ((date - currentDate) >= 500 / game.speed) {
        actor.updateActorPos({cb: gameStart, timerId});
        currentDate = date;
      }
      
      timerId = requestAnimationFrame(step);
    };

    timerId = requestAnimationFrame(step);
  }

  function destroy() {
    GAME_CONTAINER.innerHTML = '';
    run();
  }

  run();
});