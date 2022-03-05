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
    ambientheat = ambientheat + 400 / totalmass;
    console.log("heat is now", ambientheat);
}

function initGame(){
    createCore(world);
    spawnH();
    
}

function step() {
    //Collision code "borrowed" from https://stackoverflow.com/questions/8982349/on-collision-event-handlers-in-box2djs by John Carter
    var aContact;
    for( aContact = world.m_contactList; aContact != null; aContact = aContact.m_next) {
	var cBody1 = aContact.m_shape1.m_body;
	var cBody2 = aContact.m_shape2.m_body;

	var udObj1 = cBody1.GetUserData();
	var udObj2 = cBody2.GetUserData();

	if( udObj2 == null || udObj1 == null )
	    continue;

	if( typeof(udObj1) == "object" && typeof(udObj2) == "object")
	    fuseParticles(cBody1, cBody2);
	    
    }
	

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
