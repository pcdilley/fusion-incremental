var radius = 400;
var pi = 3.1415926535;
var heatvel = 100;
function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		drawJoint(j, context);
	}
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
    return world;
}

function createGround(world) {
    var step = pi/64;
    var posx = 0;
    var posy = 0;
    for(let angle = 0; angle <  pi*2+.1; angle = angle+step)
    {
	posy = radius+20 + Math.cos(angle)*radius;
	posx = radius+20 + Math.sin(angle)*radius;

	console.log(posx, posy, angle);
	createBox(world, posx, posy, step*radius/2, 2, -angle);
    }
    return true;    
}

function createBall(world, x, y) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = 20;
	ballSd.restitution = 1.0;
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
    var ballSd = new b2CircleDef();
    ballSd.density = 1.0;
    ballSd.radius = 5;
    ballSd.restitution = 1.0;
    ballSd.friction = 0;
    var ballBd = new b2BodyDef();
    ballBd.AddShape(ballSd);
    var xpos = radius;
    var ypos = radius;
    while (xpos*xpos+ypos*ypos > (radius-50)*(radius-50)) {
	xpos = Math.random()*radius*2 - radius + 20;
	ypos = Math.random()*radius*2 - radius + 20;
    }
    ballBd.position.Set(xpos+radius, ypos+radius);
    angle=Math.random()*pi;
    ballBd.linearVelocity.Set(heatvel*Math.sin(angle), heatvel*Math.cos(angle));
    return world.CreateBody(ballBd);
}
    
