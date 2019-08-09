function dist(point1,point2) {
    let one = (point2.x - point1.x);
    let two = (point2.y - point1.y);
    return Math.sqrt((one*one)+(two*two));
}

function circlecircle(circle1,circle2) {
    if( dist(circle1,circle2) < (circle1.r + circle2.r)) {
		return true;
	} else {
        return false;
    }
}

function circlepoint(circle,point) {
    if( dist(circle,point) < circle.r) {
		return true;
	} else {
        return false;
    }
}

function rectrect(rect1,rect2) {
    if(rect1.x + rect1.w/2 >= rect2.x - rect2.w/2 &&
       rect1.x - rect1.w/2 <= rect2.x + rect2.w/2 &&
       rect1.y + rect1.h/2 >= rect2.y - rect2.h/2 &&
       rect1.y - rect1.h/2 <= rect2.y + rect2.h/2) {
        return true;
    } else {
        return false;
    }
}

function rectpoint(rect,point) {
    if(rect.x + rect.w/2 >= point.x &&
       rect.x - rect.w/2 <= point.x &&
       rect.y + rect.h/2 >= point.y &&
       rect.y - rect.h/2 <= point.y ) {
        return true;
    } else {
        return false;
    }
}

function circlerect(circle,rect) { //credit: https://yal.cc/rectangle-circle-intersection-test/
    let rectHalfWidth  = rect.w/2;
    let rectHalfHeight = rect.h/2;
    let deltaX = circle.x - Math.max(rect.x - rectHalfWidth, Math.min(circle.x, rect.x + rectHalfWidth));
    let deltaY = circle.y - Math.max(rect.y - rectHalfHeight, Math.min(circle.y, rect.y + rectHalfHeight));
    return (deltaX * deltaX + deltaY * deltaY) < (circle.r * circle.r);
}

function circleOnSideRect(circle,rect) {
    let rectHalfWidth  = rect.w/2;
    let rectHalfHeight = rect.h/2;
    let left   = rect.x - rectHalfWidth;
    let right  = rect.x + rectHalfWidth;
    let top    = rect.y - rectHalfHeight;
    let bottom = rect.y + rectHalfHeight;
    let cx = circle.x;
    let cy = circle.y;
    if(cy < top && cx > left && cx < right) { // top side
        return 0;
    } else if(cy > bottom && cx > left && cx < right) { // bottom side
        return 2;
    } else if (cx < left && cy > top && cy < bottom) { // left side
        return 3;
    } else if (cx > right && cy > top && cy < bottom) { // right side
        return 1;
    } else {
        let returnValue=0; // 0 = top, 1 = right, 2 = bottom, 3 = left
        let topleft = dist (circle,{x:left,y:top});
        let topright = dist (circle,{x:right,y:top});
        let bottomleft = dist (circle,{x:left,y:bottom});
        let bottomright = dist (circle,{x:right,y:bottom});
        switch(Math.min(topleft,topright,bottomleft,bottomright)) { // find what corner the cricle is closer to, then determine what side it is closer to
            case topleft:
                var m = slope(rect,{x:left,y:top});
                var mperp = -(1/m);
                var b = yIntercept(rect,m);
                var bperp = yIntercept(circle,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 3;} else {returnValue = 0;}
                break;
            case topright:
                var m = slope(rect,{x:right,y:top});
                var mperp = -(1/m);
                var b = yIntercept(rect,m);
                var bperp = yIntercept(circle,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 0;} else {returnValue = 1;}
                break;
            case bottomleft:
                var m = slope(rect,{x:left,y:bottom});
                var mperp = -(1/m);
                var b = yIntercept(rect,m);
                var bperp = yIntercept(circle,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 3;} else {returnValue = 2;}
                break;
            case bottomright:
                var m = slope(rect,{x:right,y:bottom});
                var mperp = -(1/m);
                var b = yIntercept(rect,m);
                var bperp = yIntercept(circle,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 2;} else {returnValue = 1;}
                break;
        }
        return returnValue;
    }
}

function rectOnSideRect(rect1,rect2) {
    let rectHalfWidth2  = rect2.w/2;
    let rectHalfHeight2 = rect2.h/2;
    let left2   = rect2.x - rectHalfWidth2;
    let right2 = rect2.x + rectHalfWidth2;
    let top2   = rect2.y - rectHalfHeight2;
    let bottom2 = rect2.y + rectHalfHeight2;

    let rectHalfWidth1  = rect1.w/2;
    let rectHalfHeight1 = rect1.h/2;
    let rx1 = rect1.x;
    let ry1 = rect1.y;
    let left1   = rx1 - rectHalfWidth1;
    let right1 = rx1 + rectHalfWidth1;
    let top1   = ry1 - rectHalfHeight1;
    let bottom1 = ry1 + rectHalfHeight1;
    // find what point is closer to the rectangle 
    let topleft1 = dist (rect2,{x:left1,y:top1});
    let topright1 = dist (rect2,{x:right1,y:top1});
    let bottomleft1 = dist (rect2,{x:left1,y:bottom1});
    let bottomright1 = dist (rect2,{x:right1,y:bottom1});
    let topmiddle1 = dist (rect2,{x:rx1,y:top1});
    let rightmiddle1 = dist (rect2,{x:right1,y:ry1});
    let bottommiddle1 = dist (rect2,{x:rx1,y:bottom1});
    let leftmiddle1 = dist (rect2,{x:left1,y:ry1});
    let cx = rx1;
    let cy = ry1;
    switch(Math.min(topleft1,topright1,bottomleft1,bottomright1,topmiddle1,rightmiddle1,bottommiddle1,leftmiddle1)) {
        //set the point we are testing to the closest point to the rectangle
        case topleft1:
            cx -= rect1.w/2;
            cy -= rect1.h/2;
            break;
        case topright1:
            cx += rect1.w/2;
            cy -= rect1.h/2;
            break;
        case bottomleft1:
            cx -= rect1.w/2;
            cy += rect1.h/2;
            break;
        case bottomright1:
            cx += rect1.w/2;
            cy += rect1.h/2;
            break;
        case topmiddle1:
            cy -= rect1.h/2;
            break;
        case rightmiddle1:
            cx += rect1.w/2;
            break;
        case bottommiddle1:
            cy += rect1.h/2;
            break;
        case leftmiddle1:
            cx -= rect1.w/2;
            break;
    }
    if(cy < top2 && cx > left2 && cx < right2) { // top side
        return 0;
    } else if(cy > bottom2 && cx > left2 && cx < right2) { // bottom side
        return 2;
    } else if (cx < left2 && cy > top2 && cy < bottom2) { // left side
        return 3;
    } else if (cx > right2 && cy > top2 && cy < bottom2) { // right side
        return 1;
    } else {
        let returnValue=0; // 0 = top, 1 = right, 2 = bottom, 3 = left
        let determiningPoint = {x:cx,y:cy};
        let topleft = dist (determiningPoint,{x:left2,y:top2});
        let topright = dist (determiningPoint,{x:right2,y:top2});
        let bottomleft = dist (determiningPoint,{x:left2,y:bottom2});
        let bottomright = dist (determiningPoint,{x:right2,y:bottom2});
        switch(Math.min(topleft,topright,bottomleft,bottomright)) { // find what corner the point is closer to, then determine what side it is closer to
            case topleft:
                var m = slope(rect2,{x:left2,y:top2});
                var mperp = -(1/m);
                var b = yIntercept(rect2,m);
                var bperp = yIntercept(determiningPoint,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 3;} else {returnValue = 0;}
                break;
            case topright:
                var m = slope(rect2,{x:right2,y:top2});
                var mperp = -(1/m);
                var b = yIntercept(rect2,m);
                var bperp = yIntercept(determiningPoint,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 0;} else {returnValue = 1;}
                break;
            case bottomleft:
                var m = slope(rect2,{x:left2,y:bottom2});
                var mperp = -(1/m);
                var b = yIntercept(rect2,m);
                var bperp = yIntercept(determiningPoint,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 3;} else {returnValue = 2;}
                break;
            case bottomright:
                var m = slope(rect2,{x:right2,y:bottom2});
                var mperp = -(1/m);
                var b = yIntercept(rect2,m);
                var bperp = yIntercept(determiningPoint,mperp);
                var mid = POI(m,b,mperp,bperp);
                if(cx<mid) {returnValue = 2;} else {returnValue = 1;}
                break;
        }
        return returnValue;
    }
}

function slope(point1,point2) {
    return ((point2.y-point1.y)/(point2.x-point1.x));
}

function yIntercept(point,slope) {
    return point.y - (slope * point.x);
}

function POI(m1,b1,m2,b2) {
    x = (b2 - b1) / (m1 - m2);
    return x;
    //y = m1 * x + b1;
}

function ifRectOnEdgeBounce(rect) {
    let rx = rect.x;
    let ry = rect.y;
    let rw = rect.w/2;
    let rh = rect.h/2;
    if(rx+rw>edge.right) {
        rect.v.x *= -1;
        rect.x = edge.right-rw;
    }
    if(rx-rw<edge.left) {
        rect.v.x *= -1;
        rect.x = edge.left+rw;
    }
    if(ry+rh>edge.bottom) {
        rect.v.y *= -1;
        rect.y = edge.bottom-rh;
    }
    if(ry-rh<edge.top) {
        rect.v.y *= -1;
        rect.y = edge.top+rh;
    }
}

function ifCircleOnEdgeBounce(circle) {
    let cx = circle.x;
    let cy = circle.y;
    let cr = circle.r;
    if(cx+cr>edge.right) {
        circle.v.x *= -1;
        circle.x = edge.right-cr;
    }
    if(cx-cr<edge.left) {
        circle.v.x *= -1;
        circle.x = edge.left+cr;
    }
    if(cy+cr>edge.bottom) {
        circle.v.y *= -1;
        circle.y = edge.bottom-cr;
    }
    if(cy-cr<edge.top) {
        circle.v.y *= -1;
        circle.y = edge.top+cr;
    }
}

