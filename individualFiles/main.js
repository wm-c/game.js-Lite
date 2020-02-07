// create globals
var canvases={cvs:null,ctx:null,buffer1cvs:null,buffer1ctx:null,buffer2cvs:null,buffer2ctx:null}, // visable and hidden canvases
cw, // canvas width
ch, // canvas height
camera={zoom:1,angle:0,x:0,y:0}, // affects how everything is drawn
updateFPS=60,
gameStarted=false,
drawMode=0, // 0=normal, 1=zoomed, 2=zoomed/rotated, set automatically depending on camera
absDraw=false,
curCtx, // what canvas to draw to
maxCvsSize, // used by second buffer
canvasScale=1,
difx=0, // offsets for drawing
dify=0,
seperateInputLoop=true,
edge={top:null,bottom:null,left:null,right:null}, // used by if___OnEdgeBounce, set to canvas size at setup, can be changed whenever
drawLimitLeft,
drawLimitRight,
drawLimitTop,
drawLimitBottom,
sizeDif,
bug="\uD83D\uDC1B",
loadingCircle,
loadAng=0,
optionsHover=0,
pauseHover=0,
optionsMenu=false,
optionsButtons={},
clickSound,
paused=false,
screenSize="1:1",
autoScale=1,

images=[], // put image paths here
imagePaths=[],
imgs=[],
sprites={}, // loaded images

audio=[], // put audio paths here
audioPaths=[],
sounds={}, // loaded sounds
abuffer = [], // audio nodes shoved here
volumeList = [], // gain nodes shoved here
audioLoadedLength=0,
volume={sfx:1,bgm:1};
/* options
    future:
        modefileable checklist
        key bindings
*/

cursor = {sprite:null,alignment:1,show:true}, // 0=topleft, 1=centered
mouseOnCanvas=false;

const acceptableChars="qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_-. ";//for image names

const AudioContext = window.AudioContext||window.webkitAudioContext;
var context;
var sfxVolumeNode;
var bmgVolumeNode;

document.getElementById("game").onmouseout = function()   {mouseOnCanvas = false;}
document.getElementById("game").onmouseover = function()   {mouseOnCanvas = true;}

//setup canvases and input
function setup(physicsFPS) {
    updateFPS = physicsFPS;
    
    canvases.cvs = document.getElementById("game");
    canvases.ctx = canvases.cvs.getContext("2d", { alpha: false });

    canvases.cvs.onmousedown = function () {if(!gameStarted){loadImagesAndSounds();gameStarted=true;}}

    createCanvas("buffer1");
    createCanvas("buffer2");

    canvases.ctx.imageSmoothingEnabled = false;
    canvases.buffer1ctx.imageSmoothingEnabled = false;
    canvases.buffer2ctx.imageSmoothingEnabled = false;

    maxCvsSize=Math.max(canvases.cvs.width,canvases.cvs.height);
    sizeDif=maxCvsSize-Math.min(canvases.cvs.width,canvases.cvs.height);
    cw=canvases.cvs.width;
    ch=canvases.cvs.height;
    
    edge={top:0,bottom:ch,left:0,right:cw};

    addFont();
    addStyle();

    addListenersTo(canvases.cvs);

    curCtx = canvases.ctx;
    requestAnimationFrame(startButton);
    function startButton() {
        curCtx.fillStyle="#2d2d2d";
        curCtx.fillRect(0,0,cw,ch);//debugger;
        circle(cw/2,ch/2,27,"#066312");
        circle(cw/2,ch/2,23,"#149124");
        shape(cw/2,ch/2,[{x:-7,y:-15},{x:-7,y:15},{x:15,y:0}],"#47f55d");
        if(!gameStarted) {requestAnimationFrame(startButton);}
    }
}

function drawLoop() {
    cw=canvases.cvs.width;
    ch=canvases.cvs.height;
    scaleCanvases();

    switchDrawMode();
    
    resizeBuffers();

    clearCanvases();

    var limitModifyer = 0;
    if(drawMode==2) {limitModifyer=canvases.buffer2cvs.width-maxCvsSize;}
    drawLimitLeft   = -camera.x - (drawMode==2?sizeDif:0) - limitModifyer;
    drawLimitRight  = -camera.x + maxCvsSize + (drawMode==2?sizeDif:0) + limitModifyer;
    drawLimitTop    = -camera.y -(drawMode==2?sizeDif:0) - limitModifyer;
    drawLimitBottom = -camera.y + maxCvsSize + (drawMode==2?sizeDif:0) + limitModifyer; 

    draw();
    
    render();

    curCtx=canvases.ctx;
    difx=0;dify=0;
    var camCache = {x:camera.x,y:camera.y};
    camera.x=0;camera.y=0;
    drawMode=0;
    absDraw=true;
    try{absoluteDraw();} catch (err){}
    absDraw=false;

    drawButtons();
    drawOptionsMenu();
    drawCursor();

    camera.x = camCache.x;
    camera.y = camCache.y;

    requestAnimationFrame(drawLoop);
}

function updateLoop() {
    if(seperateInputLoop==false) {
        handleOptionsInput();
    }
    sfxVolumeNode = volume.sfx;
    bmgVolumeNode = volume.bmg;
    if(!paused) {
        update();
    }

    if(seperateInputLoop==false) {
        resetInput();
    }
}


function inputLoop() {
    handleOptionsInput();
    if(!paused) {
        input();
    }

    resetInput();
}