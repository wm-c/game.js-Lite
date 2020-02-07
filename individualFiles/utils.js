function createCanvas(id) {
    var tempCanvas = document.createElement("canvas");
    tempCanvas.id = id;
    tempCanvas.width = canvases.cvs.width;
    tempCanvas.height = canvases.cvs.height;
    tempCanvas.style = "image-rendering:pixelated;image-rendering: crisp-edges;display:none;";//

    document.body.appendChild(tempCanvas);

    canvases[`${id}cvs`] = document.getElementById(id);
    canvases[`${id}ctx`] = canvases[`${id}cvs`].getContext("2d");
}

function startLoops() {
    try {draw} catch (err){console.warn(bug+" no draw function found");return null;}
    try {update} catch (err){console.warn(bug+" no update function found");return null;}
    try {input} catch (err){seperateInputLoop=false;}
    try {onAssetsLoaded()} catch (err) {}

    requestAnimationFrame(drawLoop);
    setInterval(updateLoop,1000/updateFPS);

    if(seperateInputLoop) {
        setInterval(inputLoop,4);
    }
}

function mousePosition() {
    if(drawMode===0) {
        return {x:(mousePos.x)-camera.x,y:(mousePos.y)-camera.y};
    } else if(drawMode===1) {
        var xoff = canvases.cvs.width/2;
        var yoff = canvases.cvs.height/2;
        return {x:((mousePos.x-xoff)/camera.zoom+xoff)-camera.x,y:((mousePos.y-yoff)/camera.zoom+yoff)-camera.y};
    } else {
        var xoff = canvases.cvs.width/2;
        var yoff = canvases.cvs.height/2;
        var tempPos = {x:((mousePos.x-xoff)/camera.zoom+xoff)-camera.x,y:((mousePos.y-yoff)/camera.zoom+yoff)-camera.y};

        var center = {x:-camera.x + cw/2, y:-camera.y + ch/2};
        var tempAngle = pointTo(center,tempPos) - camera.angle; 
        var tempDist = dist(center,tempPos);

        return {x:center.x + (Math.cos(tempAngle) * tempDist),y:center.y + (Math.sin(tempAngle) * tempDist)}
    }
}

function addStyle() {
    var tempStyle = document.createElement("style");
    tempStyle.id="gamejsstyle";
    document.head.appendChild(tempStyle);
    var tempMeta = document.createElement("meta");
    tempMeta.setAttribute("charset","utf-8");
    document.head.appendChild(tempMeta);
}

function rand(min,max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function radToDeg(rad) {return rad / Math.PI * 180;}
function degToRad(deg) {return deg * Math.PI / 180;}

function velocity(angle) {
    return {x:Math.sin(angle),y:Math.cos(angle)};
}

function pointTo(point,targetPoint) {
    var adjacent = (targetPoint.x - point.x);
    var opposite = (targetPoint.y - point.y);
    var h = Math.atan2(opposite, adjacent);
    return h;
}

function loadImagesAndSounds() {
    var curpath="";
    context = new AudioContext();
    sfxVolumeNode = context.createGain();
    sfxVolumeNode.connect(context.destination);
    bmgVolumeNode = context.createGain();
    bmgVolumeNode.connect(context.destination);
    deeper(images,"image");
    deeper(audio,"sound");
    function deeper(curpos,type) {
        let addedPath="";
        for(let j=0;j<curpos.length;j++) {
            if(typeof curpos[j]=="string") {
                if(j==0) {
                    curpath+=curpos[j];
                    addedPath = curpos[j];
                } else {
                    if(type=="image") {
                        let name = curpath + curpos[j];
                        imagePaths.push(name);
                        let temp = new Image();
                        temp.src = name;
                        temp.onerror = function () {
                            console.warn(bug+" "+this.src + " was not found");
                        };
                        temp.onload = function() {spriteLoad(name,temp);}
                        imgs.push(temp);
                    } else if(type=="sound") {
                        audioPaths.push(curpath + curpos[j]);
                        newSound(curpath + curpos[j]);
                    }
                }
            }
            if(typeof curpos[j]=="object") {
               deeper(curpos[j],type);
            }
        }
        curpath = curpath.slice(0,curpath.length-addedPath.length);
    }
    
    loadingCircle = new Image();
    loadingCircle.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAf0lEQVQ4jc2SuxHAIAxDbY4pMpHmyJSeKGuQKpyj2Hy6qETPQvhQCWRmDRfeZ4cJAGW28mAUyL4Pqmx2nfK+zaR59glRHo5qZi0BaPHmbDhiyuzdsza9wcrtEVtG4Ip+FLCzTM+WneWxPv9gpQUzmhncLPOHUCYfHr4/C4r2dQPfhkeIbjeYWgAAAABJRU5ErkJggg==";
    clickSound = new Audio("data:audio/x-wav;base64,UklGRowBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YWgBAADa/6T/2/+S/x//pP769Xr4fPh5+H34evh7+Pv6gf18/QIAhQcIDxUZFR4VHhgeEx6TFgkPCgqAAnz49/X18HLu7ubo4eXc5dzj3Gjf5+Fr5G7pce759YECiwwRFBQZlxuXG5cbFRmTFo8RCAoAAPz69/X08G7udO5s7vz1dvj++nv9gP3+/wEAgwKBAogHkBEpLUNG1lzqcPV683r4eu51ZmnVV7w+qypy88fDoKAXlAqKBoUAgIeHlpYsrTu87Ot9/ZIRGxkoKDEtqionIxgZiwfj5lnaz9JN0E3QV9pd3+Tm9fUBAAQFBwWNDBEPFxSYFpsWEA9+/fP1dfNt83bz8fX9+gQFkAwPDxQPEQ+IBwIAdfjv8OLm2+HX3Nrh4+bm63n4BAUUDx0ZqyCrJSkelBGEAnb4a+5a5Njcztxc31jkZunx9QgFGhQfGa0gqCCuIKkgpRsaFIsHdfhj6dfh0NzM19Th6es=");
    let pos = {x:cw/2-100,y:ch/2-100};
    optionsButtons.screenSize = {x:pos.x+160,y:pos.y+12,w:50,h:20};
    optionsButtons.sfx = {x:pos.x+125,y:pos.y+40,w:120,h:20};
    optionsButtons.bmg = {x:pos.x+125,y:pos.y+70,w:120,h:20};
    loadLoop();
}

function loadLoop() {
    if(Object.keys(sprites).length == imagePaths.length && audioPaths.length == audioLoadedLength) {
        startLoops();
        imagePaths=[];
        audioPaths=[];
        imgs=[];
    } else {
        curCtx.fillStyle="#2d2d2d";
        curCtx.fillRect(0,0,cw,ch);
        text(`audio:   ${audioLoadedLength}/${audioPaths.length}`,10,30,"white",2);
        text(`sprites: ${Object.keys(sprites).length}/${imagePaths.length}`,10,10,"white",2);
        curCtx.setTransform(1, 0, 0, 1, Math.round(cw/2), Math.round(ch/2));
        curCtx.rotate(loadAng);
        loadAng+=0.1;
        curCtx.drawImage(loadingCircle,Math.round(-8),Math.round(-8));
        curCtx.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(loadLoop);
    }
}

function spriteLoad(path,image) {
    let startpos;
    let endpos = path.lastIndexOf(".");
    for(let j=endpos-1;acceptableChars.includes(path[j]);j--) {startpos=j;}
    let spriteName = path.slice(startpos,endpos)
    let dsize=Math.max(image.width,image.height)/2;
    sprites[spriteName] = {spr:image,drawLimitSize:dsize};
    
}

function newSound(src) {
    let startpos;
    let endpos = src.lastIndexOf(".");
    for(let j=endpos-1;acceptableChars.includes(src[j]);j--) {startpos=j;}
    let soundName = src.slice(startpos,endpos); 
    sounds[soundName] = {nodes:[],volNodes:[],src:src,type:"sfx",volume:1};
    sounds[soundName].nodes = [1];

    let loadingSound = new Audio();
    loadingSound.onerror = function () {
        console.warn(bug+" "+ src + " was not found");
    };
    loadingSound.src = src;
    loadingSound.preload='auto';
    loadingSound.addEventListener('canplaythrough', function() { 
        audioLoadedLength++;
     }, false);
    sounds[soundName].nodes.push(loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();

    soundNode.connect(gainNode);
    gainNode.connect(sfxVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sounds[soundName].volNodes.push(volumeList.length-1);
}

function addSound(sound) {
    let loadingSound = new Audio();
    loadingSound.src = sound.src;
    loadingSound.preload='auto';
    sound.nodes.splice(sound.nodes[0],0,loadingSound);

    let soundNode = context.createMediaElementSource(loadingSound);
    let gainNode = context.createGain();
    gainNode.gain.value=sound.volume;

    soundNode.connect(gainNode);
    gainNode.connect(sound.type=="sfx"?sfxVolumeNode:bmgVolumeNode);

    abuffer.push(soundNode);
    volumeList.push(gainNode);
    sound.volNodes.push(volumeList.length-1);
}



function play(sound) {
    s=sound.nodes;
    if(s[s[0]].ended || !(s[s[0]].played.length)) {
        s[s[0]].play();
        s[0]++;
        if(s[0]==s.length) {
            s[0]=1;
        }
    } else {
        addSound(sound);
        s[s[0]].play();
        s[0]++;
        if(s[0]==s.length) {
            s[0]=1;
        }
    }
}

function setVolume(sound,volume) {
    for(let i=0,l=sound.volNodes.length;i<l;i++) {
        volumeList[sound.volNodes[i]].gain.value = volume;
    }
}

function setType(sound,newType) {
    for(let i=0,l=sound.volNodes.length;i<l;i++) {
        volumeList[sound.volNodes[i]].disconnect(sound.type=="sfx"?sfxVolumeNode:bmgVolumeNode);
        volumeList[sound.volNodes[i]].connect(newType=="sfx"?sfxVolumeNode:bmgVolumeNode);
    }
    sound.type = newType;
}

function stop(sound) {
    s=sound.nodes;
    for(let i=1;i<s.length;i++) {
        s[i].pause();
        s[i].currentTime = 123456789; // this will not end the sound if it is longer than 3.9 years
    }
}

function handleOptionsInput() {
    let ImTierdMakemenuwork=true;
    if(optionsMenu) {
        if(mousePress[0]) {
            if(rectpoint(optionsButtons.screenSize,mousePos)) {
                if(screenSize=="1:1") {
                    screenSize = "fit";
                    canvasScale=0;
                } else {
                    screenSize = "1:1";
                    canvasScale=1;
                }
            }
            if(!rectpoint({x:cw/2,y:ch/2,w:200,h:200},mousePos)) {
                optionsMenu=false;
                ImTierdMakemenuwork=false;
            }
        }
        if(mouseDown[0]) {
            if(rectpoint(optionsButtons.sfx,mousePos)) {
                volume.sfx = (mousePos.x-(optionsButtons.sfx.x-60))/120;
            }
            if(rectpoint(optionsButtons.bmg,mousePos)) {
                volume.bgm = (mousePos.x-(optionsButtons.bmg.x-60))/120;
            }
        }
    }
    if(mousePos.x>cw-32&&mousePos.y<32) {
        if(mousePress[0]&&ImTierdMakemenuwork) {
            clickSound.play();
            paused=true;
            optionsMenu=!optionsMenu;
        }
        optionsHover = 25;
    } else {
        optionsHover = 0;
    }
    if(mousePos.x<cw-32&&mousePos.x>cw-64&&mousePos.y<32) {
        pauseHover = 25;
        if(mousePress[0]) {
            clickSound.play();
            paused=!paused;
        }
    } else {
        pauseHover = 0;
    }
    
}