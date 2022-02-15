var initId = 0;
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
});


function raiseHeat() {
    heat++;
    console.log("heat is now", heat);
}

function initGame(){
    createGround(world);
    
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
	var collision = world.m_contactList;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				if (playerObj.y < groundObj.y){
					player.canJump = true;
				}
			}
		}
	}
}


function handleKeyDown(evt){
    keys[evt.keyCode] = true;
}


function handleKeyUp(evt){
    keys[evt.keyCode] = false;
}

// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}
