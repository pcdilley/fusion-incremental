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

function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#00eeee';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// likely unnecessary for project
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}

function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
    switch (shape.m_type) {
	//draw code for shapes.  Could change to make circles appear tiny without affecting their collision size.
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 32.0;
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
    var worldAABB = new b2_AABB();
    worldAABB.minVertex.Set(-1000, -1000);
    worldAABB.maxVertex.Set(1000, 1000);
    var gravity = new b2Vec2(0, 0);
    var doSleep = true;
    var world = new b2World(worldAABB, gravity, doSleep);
    return world;
}


//create bounding circle for all reactants.  Will have to refactor in order to shrink core.  
function createCore(world) {
    var radius = 400; //radius of bounding circle
    var pi = 3.1415926535;
    var edges = 64;  //number of segments for the approximately circular polygon
    var step = pi/edges; //arc per edge segment, in radians
    var posx = 0;
    var posy = 0;
    for(let angle = 0; angle <  pi*2+.01; angle = angle+step) //until we get around the circle, keep drawing boxes
    {
	posy = radius+20 + Math.cos(angle)*radius; //find the x and y positions based on current angle and radius 
	posx = radius+20 + Math.sin(angle)*radius;
	createBox(world, posx, posy, step*radius/2, 2, -angle);
    }
    return true;    
}

//create a spherical physics object
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
//create a fixed rectangle
function createBox(world, x, y, width, height, angle, userData) {  
    var boxSd = new b2BoxDef();

    boxSd.userData = userData;
    boxSd.restitution = 1.0;
    boxSd.extents.Set(width, height);
    boxSd.localRotation = angle;
    var boxBd = new b2BodyDef();
    //TODO: install typescript version and test
    boxBd.type = b2_staticBody;
    boxBd.AddShape(boxSd);
    boxBd.position.Set(x,y);
    return world.CreateBody(boxBd);
}
