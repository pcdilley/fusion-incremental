var radius = 400;
var ambientheat = 15000000;
var totalmass = 30;

let kb = 8.617333e-5
let pi = 3.1415926535;

//Collision code "borrowed" from https://stackoverflow.com/questions/8982349/on-collision-event-handlers-in-box2djs by John Carter
var FusionCollisionCallback = function() {
    this.ShouldCollide = function(shape1, shape2)
    {
	var bd1 = shape1.m_body;
	var bd2 = shape2.m_body;
	if(bd1.UserData) { //check if it's an atom
	    if(bd2.UserData) {
	    }
	}

	console.log("yeah we got contact");
	if (shape1.m_groupIndex == shape2.m_groupIndex && shape1.m_groupIndex != 0)
            {
            return shape1.m_groupIndex > 0;
            }

        var collide = (shape1.m_maskBits & shape2.m_categoryBits) != 0 && (shape1.m_categoryBits & shape2.m_maskBits) != 0;

        return collide;
    }
    return this;
}


function drawWorld(world, context) {
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}

function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 8.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		break;
	}
	context.stroke();
}

function createWorld() {
    
    var worldAABB = new b2AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 0);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    myCollisionCallback = new FusionCollisionCallback(); //sets up a collision filter so we can achieve fusion
    world.SetFilter(myCollisionCallback);
    return world;
}

function createCore(world) {
    var step = pi/64;
    var posx = 0;
    var posy = 0;
    for(let angle = 0; angle <=  pi*2+.1; angle = angle+step)
    {
	posy = radius+20 + Math.cos(angle)*radius;
	posx = radius+20 + Math.sin(angle)*radius;
	createBox(world, posx, posy, step*radius/2, 5, -angle);
    }
    return true;    
}

function createBall(world, x, y) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 20;
	ballSd.restitution = 1;
	ballSd.friction = 0;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, angle, userData) {
    var boxSd = new b2BoxDef();
    
    boxSd.userData = userData;
    boxSd.friction = 0;
    boxSd.extents.Set(width, height);
    boxSd.localRotation = angle;
    var boxBd = new b2BodyDef();
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    return world.CreateBody(boxBd);
}


function spawnH() {
    //TODO: need to evaluate balance of this formula
    //ambientheat = (ambientheat)*(totalmass/(totalmass+1))
    totalmass++;
    var ballSd = new b2CircleDef();
    ballSd.density = 1.0;
    ballSd.radius = 5;
    ballSd.restitution = .95;
    ballSd.friction = 0;
    var ballBd = new b2BodyDef();
    ballBd.AddShape(ballSd);
    ballBd.userData = [1, 0, Math.sqrt(ambientheat)]; //adds initial values for H
    var xpos = radius;
    var ypos = radius;
    while (xpos*xpos+ypos*ypos > (radius-50)*(radius-50)) {
	xpos = Math.random()*radius*2 - radius + 20;
	ypos = Math.random()*radius*2 - radius + 20;
    }
    ballBd.position.Set(xpos+radius, ypos+radius);
    angle=Math.random()*pi;
    ballBd.linearVelocity.Set(Math.sqrt(ballBd.userData[2])*Math.sin(angle), Math.sqrt(ballBd.userData[2])*Math.cos(angle));
    return world.CreateBody(ballBd);
}

function fuseParticles(par1, par2) {

    //fusion code should result in CNO cycle: https://en.wikipedia.org/wiki/CNO_cycle
    //TODO fuse code
    var ud1=par1.GetUserData();
    var ud2=par2.GetUserData();
    //track momentum
    xbudget = par1.m_linearVelocity.x * (ud1[0]+ud1[1]) + par2.m_linearVelocity.x * (ud2[0]+ud2[1]);
    ybudget = par1.m_linearVelocity.y * (ud1[0]+ud1[1]) + par2.m_linearVelocity.y * (ud2[0]+ud2[1]);
    console.log("total momentum is ", xbudget, ybudget);
    
    //thermal energy is kb * 3/2 * T per particle (eV)
    var te = (ud1[2]**2 + ud2[2]**2) *1.5 * kb
    //calculate mass energy of particle pairings
    //atoms contains atom objects: {z, nm, nx, me:[KeV],hl:[s]}
    var atom1 = atoms[ud1[0]];
    var atom2 = atoms[ud2[0]];
    console.log("thermal energy is ", te, " eV and atomic mass excesses are ", atom1.me[ud1[1]], " and ", atom2.me[ud2[1]], "KeV");
    te = te + atom1.me[ud1[1]]*1000 + atom2.me[ud2[1]]*1000;
    console.log("houston, we have ignition, temp is", te);
    var newz=ud1[0]+ud2[0];
    var newn=ud1[1]+ud2[1];
    console.log("next we attempt to FUSE into ", newz, newn);

    var newatom = atoms[newz];
    if (newatom != null) {  //make sure there's a valid particle to fuse into
	console.log("wow!  it's happening!");

	//adjust neutron count
	while(newatom.nm > newn || newatom.nx < newn) {
	    if(newatom.nm > newn){ //if there aren't enough neutrons
		//positron decay (or proton, but not now)
		//electron neutrino has .42 MeV for p-p, maybe percentage of excess energy, at least .42 MeV?  Determined by the wavefunction of the reaction.
		//this method is mediated by the weak nuclear force, so it will be uncommon to occur.  A neutron conversion needs to happen before a proton fisses off, which will be different for different atoms
		newz--;
		newn++;
		te = te - 510998*2; //- 420000; //ev: -e+, -ve, -e-: nm = pm + e- to adjust to the correct neutron mass without excess
	    }
	    if(newatom.nx < newn){ //if there are too many neutrons
		//beta decay or n decay, depending on energy
		//use neutron (939.56542 MeV) to turn into proton (938.27209 MeV)
		//emit electron (0.510998 MeV mass) and electron neutrino (.42 MeV for p-p)
		//net would be -e-, -ve, +e- (neutron mass difference), but is defined in nucleotide data
		//neutron decay is based on neutron binding energy
		newz++;
		newn--;
		te = te; //- 420000;
	    }
	    newatom = atoms[newz];
	}
	//new atom has valid number of neutrons now
	console.log("well actually we're trying to fuse into", newz, newn);
	te = te - newatom.me[newn]*1000;
	console.log("new atom would have thermal energy of ", te);
    }
    
}


