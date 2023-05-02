// Get libraries.
var 
    Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    Events = Matter.Events,
    Body = Matter.Body
  
  // Create the engine.
  const engine = Engine.create(),
    world = engine.world;
  
  engine.world.gravity.scale = 0;
  engine.positionIterations = 100;
  engine.velocityIterations = 100;
  
  // Create the renderer.
  const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 400,
      height: 700,
      showIds: true,
      showMousePosition: true,
      showPositions: true,
      showBounds: true
    }
  });
  
  var leftHalf = Bodies.fromVertices(
    92.12746482280461,
    2148.229407607523,
    [
      [
        { x: -1000, y: -1000 },
        { x: 1600, y: -1000 },
        { x: 1600, y: 333 },
        { x: 493, y: 333 },
        { x: 333, y: 173 },
        { x: 173, y: 333 },
        { x: 333, y: 493 },
        { x: 333, y: 1952 },
        { x: 105, y: 1952 },
        { x: 105, y: 2180 },
        { x: 333, y: 2180 },
        { x: 333, y: 3640 },
        { x: 173, y: 3800 },
        { x: 333, y: 3960 },
        { x: 493, y: 3800 },
        { x: 1600, y: 3800 },
        { x: 1600, y: 5133 },
        { x: -1000, y: 5133 },
        { x: -1000, y: 5133 }
      ]
    ],
    { isStatic: true }
  );
  var rightHalf = Bodies.fromVertices(
    2307.8725351771955,
    1984.7705923924768,
    [
      [
        { x: -1000, y: -1000 },
        { x: 1600, y: -1000 },
        { x: 1600, y: 333 },
        { x: 493, y: 333 },
        { x: 333, y: 173 },
        { x: 173, y: 333 },
        { x: 333, y: 493 },
        { x: 333, y: 1952 },
        { x: 105, y: 1952 },
        { x: 105, y: 2180 },
        { x: 333, y: 2180 },
        { x: 333, y: 3640 },
        { x: 173, y: 3800 },
        { x: 333, y: 3960 },
        { x: 493, y: 3800 },
        { x: 1600, y: 3800 },
        { x: 1600, y: 5133 },
        { x: -1000, y: 5133 },
        { x: -1000, y: 5133 }
      ]
    ],
    { isStatic: true }
  );
  Body.scale(rightHalf, -1, -1);
  
  var ballOptions = { restitution: 0.75, frictionAir: 0.015 },
    cue = Bodies.circle(1200, 2400, 50, ballOptions);
  var anchor = { x: 1700, y: 4500 },
    elastic = Constraint.create({
      pointA: anchor,
      bodyB: cue,
      stiffness: 0.005
    });
  
  var pyramid = Composites.pyramid(600, 1000, 5, 4, 0, 0, function (x, y) {
    return Bodies.circle(x, y, 50, ballOptions);
  });
  
  Composite.add(world, [leftHalf, rightHalf, pyramid, cue]);
  Composite.add(world, [elastic]);
  
  Events.on(engine, "afterUpdate", function () {
    if (mouseConstraint.mouse.button !== 0) {
      elastic.bodyB = null;
      anchor.x = cue.position.x;
      anchor.y = cue.position.y;
      elastic.pointA = anchor;
    } else {
      elastic.bodyB = cue;
    }
  });
  
  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 1,
        render: {
          visible: true
        }
      }
    });
  
  Composite.add(world, mouseConstraint);
  
  // keep the mouse in sync with rendering
  render.mouse = mouse;
  
  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 2400, y: 4133 }
  });
  
  // Run the renderer.
  Render.run(render);
  
  // Create runner.
  const runner = Runner.create();
  
  // Run the engine.
  Runner.run(runner, engine);