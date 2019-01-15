require(
  ['actor', 'grid', 'schema', 'actorModel', 'utils/gridHelpers', 'utils/mathHelpers', 'constants/index'],
  (Actor, Grid, {T, J, L}, ActorModel, GridHelpers, MathHelpers, {GAME_CONTAINER}) => 
{
  function run() {
    const grid = new Grid(30, 15);
    GAME_CONTAINER.append(grid.el);
    let gridCoords = GridHelpers.getCoords(grid.el);

    function gameStart(isGameOver) {
      if (isGameOver) {
        alert('gameOver');
        destroy();
      } else {
        let current = [T, J, L][MathHelpers.getRandomInt(0, 3)]
        let actor = new Actor(gridCoords, grid, new ActorModel(current));
      
        GAME_CONTAINER.append(actor.el);
      
        this.timerId = setInterval(() => {
          actor.updateActorPos({cb: gameStart, timerId: this.timerId});
        }, 150);
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