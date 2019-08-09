var k={a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,BACKTICK:192,MINUS:189,EQUALS:187,OPENSQUARE:219,ENDSQUARE:221,SEMICOLON:186,SINGLEQUOTE:222,BACKSLASH:220,COMMA:188,PERIOD:190,SLASH:191,ENTER:13,BACKSPACE:8,TAB:9,CAPSLOCK:20,SHIFT:16,CONTROL:17,ALT:18,META:91,LEFTBACKSLASH:226,ESCAPE:27,HOME:36,END:35,PAGEUP:33,PAGEDOWN:34,DELETE:46,INSERT:45,PAUSE:19,UP:38,DOWN:40,LEFT:37,RIGHT:39,CONTEXT:93,SPACE:32,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123};
var keyPress = [];
var keyDown = [];
var mousePress = [];
var mouseDown = [];
var scroll = 0;
var mousePos = {
    x:0,
    y:0
}
var preventedEvents = [false,true,true];

function addListenersTo(elementToListenTo) {
    window.addEventListener("keydown",kdown);
    window.addEventListener("keyup",kup);
    elementToListenTo.addEventListener("mousedown",mdown);
    elementToListenTo.addEventListener("mouseup",mup);
    elementToListenTo.addEventListener("mousemove",mmove);
    elementToListenTo.addEventListener("contextmenu",cmenu);
    elementToListenTo.addEventListener("wheel",scrl);
}
function removeListenersFrom(elementToListenTo) {
    window.removeEventListener("keydown",kdown);
    window.removeEventListener("keyup",kup);
    elementToListenTo.removeEventListener("mousedown",mdown);
    elementToListenTo.removeEventListener("mouseup",mup);
    elementToListenTo.removeEventListener("mousemove",mmove);
    elementToListenTo.removeEventListener("contextmenu",cmenu);
    elementToListenTo.removeEventListener("wheel",scrl);
}
function resetInput() {
    for(var i=0;i<keyPress.length;i++){if(keyPress[i]){keyPress[i]=0}}
    for(var i=0;i<mousePress.length;i++){if(mousePress[i]){mousePress[i]=0}}
    scroll=0;
}
function kdown(e) {
    var h=e.keyCode;
    keyPress[h]=keyPress[h]==[][[]]?1:0;
    keyDown[h]=1;
    if(preventedEvents[0]) {e.preventDefault()}
}
function kup(e) {
    var h=e.keyCode;
    delete keyPress[h];
    delete keyDown[h];
}
function mdown(e) {
    var h=e.button;
    mousePress[h]=mousePress[h]==[][[]]?1:0;
    mouseDown[h]=1;
    if(preventedEvents[1]) {e.preventDefault()}
}
function mup(e) {
    var h=e.button;
    delete mousePress[h];
    delete mouseDown[h];
}
function mmove(e) {
    mousePos.x=e.offsetX/(!canvasScale?autoScale:canvasScale);
    mousePos.y=e.offsetY/(!canvasScale?autoScale:canvasScale);    
}
function cmenu(e) {
    if(preventedEvents[1]) {e.preventDefault()}
}
function scrl(e) {
    scroll+=-1*(e.deltaY/100);
    if(preventedEvents[2]) {e.preventDefault()}
}