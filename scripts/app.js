require(
  ['actor', 'grid', 'schema', 'actorModel', 'utils/gridHelpers'],
  (Actor, Grid, schema, ActorModel, GridHelpers) => 
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
        let current = [schema.T, schema.L][Math.round(Math.random())];
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