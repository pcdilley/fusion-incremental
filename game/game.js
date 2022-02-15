var initId = 0;
var player = function(){
    this.object=null;
    this.canJump=false;
};
var world;
var ctx;
var canvasWidth;
var canvasHeight;
var keys=[];
var hydrogen = 0;
var heat=0;

Event.observe(window, 'load', function() {
    world = createWorld(); // box2DWorld 
    ctx = $('game').getContext('2d'); // 2
    var canvasElm = $('game');
    canvasWidth = parseInt(canvasElm.width);
    canvasHeight = parseInt(canvasElm.height);
    initGame(); // 3
    step(); // 4
    window.addEventListener('keydown',handleKeyDown,true); //5 
    window.addEventListener('keyup',handleKeyUp,true);
});

function incrementH() {
    hydrogen++;
    console.log(hydrogen);
 }

function raiseHeat() {
    heat++;
    console.log("heat is now", heat);
}

function initGame(){
    // create circle boundary
    createCore(world);
    
    // create player ball
    var ballSd = new b2CircleDef();
    ballSd.density = 0.1;
    ballSd.radius = 12;
    ballSd.restitution = 0;
    ballSd.friction = 0.001;
    ballSd.userData = 'player';
    var ballBd = new b2BodyDef();
    ballBd.linearDamping = 0;
    ballBd.allowSleep = false;
    ballBd.AddShape(ballSd);
    ballBd.position.Set(300,300);
    player.object = world.CreateBody(ballBd);
    
}
function step() {
    handleInteractions();
    
    var stepping = false;
    var timeStep = 1.0/60;
    var iteration = 1;
    // 1
    world.Step(timeStep, iteration);
    // 2
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawWorld(world, ctx);
    // 3
    setTimeout('step()', 10);
}

function handleInteractions(){
	// up arrow
	// 1
	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				
			}
		}
	}
	// 2
	var vel = player.object.GetLinearVelocity();
	// left/right arrows
	if (keys[37]){
		vel.x = -200;
	}
	else if (keys[39]){
		vel.x = 200;
	}
	
	// 5
	player.object.SetLinearVelocity(vel);
}


function handleKeyDown(evt){
    keys[evt.keyCode] = true;
}


function handleKeyUp(evt){
    keys[evt.keyCode] = false;
}

// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}
