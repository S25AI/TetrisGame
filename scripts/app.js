require(
  ['actor', 'grid', 'schema', 'actorModel', 'utils/gridHelpers', 'utils/mathHelpers'],
  (Actor, Grid, {T, J, L}, ActorModel, GridHelpers, MathHelpers) => 
{
  function run() {
    const grid = new Grid(30, 15);
    const app = document.querySelector("#app");
    app.append(grid.el);
    let gridCoords = GridHelpers.getCoords(grid.el);

    function gameStart(isGameOver) {
      if (isGameOver) {
        alert('gameOver');
        destroy();
      } else {
        let current = [T, J, L][MathHelpers.getRandomInt(0, 3)]
        let actor = new Actor(gridCoords, grid, new ActorModel(current));
      
        app.append(actor.el);
      
        this.timerId = setInterval(() => {
          actor.updateActorPos({cb: gameStart, timerId: this.timerId});
        }, 150);
      }
    }
  
    gameStart();
  }

  function destroy() {
    document.querySelector('#app').innerHTML = '';
    run();
  }

  run();
});