function img(img,x,y,angle=0,sx=1,sy=1) {
    var half = img.drawLimitSize;
    if((x+half>drawLimitLeft&&x-half<drawLimitRight&&y+half>drawLimitTop&&y-half<drawLimitBottom)||absDraw) {
        var spr = img.spr;
        if(angle===0&&sx===1&&sy===1) {
            curCtx.drawImage(spr,Math.round(x+camera.x+difx-(spr.width/2)),Math.round(y+camera.y+dify-(spr.height/2)));
        } else {
            curCtx.setTransform(sx, 0, 0, sy, Math.round(x+camera.x+difx), Math.round(y+camera.y+dify));
            curCtx.rotate(angle);
            curCtx.drawImage(spr,Math.round(-spr.width/2),Math.round(-spr.height/2));
            curCtx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
}

function imgIgnoreCutoff(img,x,y,angle=0,sx=1,sy=1) {
    var spr = img.spr;
    if(angle===0&&sx===1&&sy===1) {
        curCtx.drawImage(spr,Math.round(x+camera.x+difx-(spr.width/2)),Math.round(y+camera.y+dify-(spr.height/2)));
    } else {
        curCtx.setTransform(sx, 0, 0, sy, Math.round(x+camera.x+difx), Math.round(y+camera.y+dify));
        curCtx.rotate(angle);
        curCtx.drawImage(spr,Math.round(-spr.width/2),Math.round(-spr.height/2));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

function rect(x,y,w,h,color) {
    curCtx.fillStyle = color;
    curCtx.fillRect(x-(w/2)+camera.x+difx,y-(h/2)+camera.y+dify,w,h);
}

function circle(x,y,r,color) {
    curCtx.beginPath();
    curCtx.arc(x+camera.x+difx, y+camera.y+dify, r, 0, 2 * Math.PI, false);
    curCtx.fillStyle = color;
    curCtx.fill();
}

function shape(x,y,relitivePoints,color) {
    x+=camera.x+difx;
    y+=camera.y+dify;
    curCtx.fillStyle = color;
    curCtx.beginPath();
    curCtx.moveTo(x+relitivePoints[0].x, y+relitivePoints[0].y);
    for(let i=1,l=relitivePoints.length;i<l;i++) {
        curCtx.lineTo(x+relitivePoints[i].x, y+relitivePoints[i].y);
    }
    curCtx.fill();
}

function text(txt,x,y,color="black",size=1,maxWidth=cw) {
    txt = txt.toString();
    curCtx.fillStyle = color;
    curCtx.font = `${Math.round(size)*8}px PixelArial11`;
                                                                                        //I hate text wrapping now 
    var txtList = txt.split("\n");                                                      //split string on enters
    for(let i=0;i<txtList.length;i++) {                                                 //go through array of strings
        if(curCtx.measureText(txtList[i]).width>maxWidth) {                             //if the string is too big, divide up into smaller strings
            var tempTxt = txtList[i].split(" ");                                        //split into individual words
            var tempStr="";                                                             //string for measuring size
            var addAmount=0;                                                            //track where in the txtList we are
            txtList.splice(i,1);                                                        //remove the too long string
            for(let j=0;j<tempTxt.length;j++) {                                         //go through the split up string
                if(curCtx.measureText(tempStr + tempTxt[j] + " ").width<maxWidth) {     //if adding a word doesn't make tempStr too long, add it, other wise, add tempStr to txtList;
                    tempStr += tempTxt[j] + " ";
                } else {
                    if(j==0) {tempStr+=tempTxt[j];}                                     //if we are here when j is 0, we have one word that is longer then the maxWidth, so we just draw it
                    txtList.splice(i+addAmount,0,tempStr);                              //put tempStr in txtList
                    addAmount++;                                                        //move the position we put the tempStr in
                    tempStr="";                                                         //reset tempStr
                    tempTxt.splice(0,(j==0?1:j));                                       //delete words that have been used
                    j=-1;                                                               //make it so in the next loop, j starts at 0
                }
            }
            if(tempStr.length!=0) {
                txtList.splice(i+addAmount,0,tempStr);                                  //add any leftover text
            }
        }
    }

    for(let i=0;i<txtList.length;i++) {
        curCtx.fillText(txtList[i],x+camera.x+difx,y+camera.y+dify+((i+(drawMode?1:0))*8*size+(size*i)));
    }
}

function textWidth(txt,size=1) {
    txt = txt.toString();
    curCtx.font = `${Math.round(size)*8}px PixelArial11`;
    return curCtx.measureText(txt).width;
}

function centerCameraOn(x,y) {
    camera.x = -x+canvases.cvs.width/2;
    camera.y = -y+canvases.cvs.height/2;
}

function moveCamera(x,y) {
    camera.x -= y * Math.sin(camera.angle);
    camera.y -= y * Math.cos(camera.angle);
    camera.x -= x * Math.sin(camera.angle + 1.57079632);
    camera.y -= x * Math.cos(camera.angle + 1.57079632);
}

function imgRotScale(x,y,angle,scale,pic,ctx) { //used for camera movement
    ctx.setTransform(scale, 0, 0, scale, x, y);
    ctx.rotate(angle);
    ctx.drawImage(pic,-pic.width/2,-pic.height/2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawCursor() {
    if(cursor.sprite&&mouseOnCanvas) {
        if(cursor.alignment) {
            canvases.ctx.drawImage(cursor.sprite,mousePos.x-Math.round(cursor.sprite.width/2),mousePos.y-Math.round(cursor.sprite.height/2));
        } else {
            canvases.ctx.drawImage(cursor.sprite,mousePos.x,mousePos.y);
        }
        cursor.show = false;
    } else {
        cursor.show = true;
    }
}

function render() {
    if(drawMode===1) {
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,0,camera.zoom,canvases.buffer1cvs,canvases.ctx);
    }
    if(drawMode===2) {
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,camera.angle,1,canvases.buffer2cvs,canvases.buffer1ctx);
        imgRotScale(canvases.cvs.width/2,canvases.cvs.height/2,0,camera.zoom,canvases.buffer1cvs,canvases.ctx);
    }
}

function clearCanvases() {
    canvases.ctx.clearRect(0,0,canvases.cvs.width,canvases.cvs.height);
    canvases.buffer1ctx.clearRect(0,0,canvases.buffer1cvs.width,canvases.buffer1cvs.height);
    canvases.buffer2ctx.clearRect(0,0,canvases.buffer2cvs.width,canvases.buffer2cvs.height);
}

function switchDrawMode() {
    if(camera.zoom<1) {camera.zoom=1;}
    if(camera.angle!=0) {
        drawMode=2;
    } else if(camera.zoom!=1) {
        drawMode=1;
    } else {
        drawMode=0;
    }
    switch (drawMode) {
        case 0: curCtx = canvases.ctx; break;
        case 1: curCtx = canvases.buffer1ctx; break;
        case 2: curCtx = canvases.buffer2ctx; break;
    }
}

function resizeBuffers() {
    var tempSize = maxCvsSize/camera.zoom;
    var tempSizeAndPadding = tempSize + (tempSize/2)

    canvases.buffer2cvs.width = tempSizeAndPadding;
    canvases.buffer2cvs.height = tempSizeAndPadding;
    
    if(drawMode===2) {
        difx = (canvases.buffer2cvs.width - canvases.cvs.width)/2;
        dify = (canvases.buffer2cvs.height - canvases.cvs.height)/2;
    } else {
        difx=0;
        dify=0;
    }
    canvases.buffer2ctx.imageSmoothingEnabled = false;
}

function scaleCanvases() { //scales canvas by canvas scale, if scale is 0, canvas will try to fit screen
    var style = document.getElementById("gamejsstyle");
    if(canvasScale==0) {
        var tempScale = Math.min(Math.floor(window.innerWidth/canvases.cvs.width),Math.floor(window.innerHeight/canvases.cvs.height));
        tempScale=tempScale<1?1:tempScale;
        autoScale=tempScale;
        style.innerHTML = `#game {image-rendering:pixelated;image-rendering: crisp-edges;width:${tempScale*canvases.cvs.width}px;cursor: ${cursor.show?"crosshair":"none"};}`;
    } else {
        style.innerHTML = `#game {image-rendering:pixelated;image-rendering: crisp-edges;width:${Math.floor(canvasScale*canvases.cvs.width)}px;cursor: ${cursor.show?"crosshair":"none"};}`;
    }
}

function drawButtons() {
    let pos = {x:cw-16,y:16}; 
    //options
    rect(pos.x,pos.y,34,34,"#9c9c9c");
    let c = optionsHover+45;
    rect(pos.x,pos.y,32,32,`rgb(${c},${c},${c})`);
    c = optionsHover + 69;
    let cc = `rgb(${c},${c},${c})`;
    rect(pos.x,pos.y-6,26,4,cc);
        rect(pos.x-6,pos.y-6,4,8,cc);
    rect(pos.x,pos.y+6,26,4,cc);
        rect(pos.x+11,pos.y+6,4,8,cc);
    //pause
    pos.x-=33;
    rect(pos.x,pos.y,34,34,"#9c9c9c");
    c = pauseHover+45;
    rect(pos.x,pos.y,32,32,`rgb(${c},${c},${c})`);
    c = pauseHover + 69;
    cc = `rgb(${c},${c},${c})`;
    if(paused) {
        shape(pos.x,pos.y,[{x:-7,y:-10},{x:-7,y:10},{x:10,y:0}],cc);
    } else {
        rect(pos.x+6,pos.y,6,20,cc);
        rect(pos.x-6,pos.y,6,20,cc);
    }
}

function drawOptionsMenu() {
    if(optionsMenu) {
        let pos = {x:cw/2-100,y:ch/2-100};
        rect(cw/2,ch/2,200,200,"#242424");
        text("Screen Size:",pos.x+2,pos.y+2,"white",2);
            let b = optionsButtons.screenSize;
            rect(b.x,b.y,b.w,b.h,"#444444");
            text(screenSize,pos.x+145,pos.y+4,"white",2);
        text("sfx",pos.x+2,pos.y+30,"white",2);
            b = optionsButtons.sfx;
            rect(b.x,b.y,b.w,b.h-10,"#444444");
            rect((b.x-60)+(volume.sfx*120),b.y,8,20,"#444444");
        text("bmg",pos.x+2,pos.y+60,"white",2);
            b = optionsButtons.bmg;
            rect(b.x,b.y,b.w,b.h-10,"#444444");
            rect((b.x-60)+(volume.bgm*120),b.y,8,20,"#444444");
    }
}