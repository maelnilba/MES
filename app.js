// TODO -------------------
// ADDING NAVBAR WITH PROPERTIES -- 90%
// MAKE PROPERTIES WORK -- 80%
// MAKE NAVBAR AND SETTINGS PRETTY -- 90%


// CREATE Z VALUE MINUS AND PLUS


// CREATE FUNCTION WITH WIDTH AND HEIGHT FOR CREATE THE TFM BACKGROUND
// MAKE P1 AND P2 POINTS VALUE CORDINATE WITH CARNIDAL 0,0 FROM TFM BACKGROUND

// CREATE FOREGROUND AND BACKGROUND AND MAKE POINTS ALWAYS FOREGROUND



//  DECLARE -------------------------------------------------------------------------------------------------------------------------------------
let joints = []
let SpaceNotAllowed = 50;

// MAIN -------------------------------------------------------------------------------------------------------------------------------------

// SETUP -------------------------------------------------------------------------------------------------------------------------------------
function setup(){
    createCanvas(window.innerWidth, window.innerHeight); // BG
    background(106,116,149); // BG COLOR
    for (let i = 0; i < 1000; i++) { // CREATE 1000 POSSIBLE LINE, MIGHT CHANGE THIS
        joints.push(new Joints());
              }

index = 0; // Z VALUE
locked = false;dragged = false; // VAR MOUSEACTIONS
isDrawing = false; // VAR ACTIONS
isEdit = {state: false, pnumber: 0, selectindex: 0, taked: false, p1pos:0, p2pos:0, pcenter:0};
Select = {state:false,p:0}; // --
DefaultColor = {r:255,g:255,b:0};
DefaultAlpha = 1;
savealpha = {state: false,alpha: 1};
DefaultE = 2; // DEFAULT VALUE

mspos = {x:0,y:0}; // CURSOS POSITION

// SET COLOR PICKER AND HISTORY COLOR
swatchescolor = [{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""},{name:"?",color:""}];
swatchesindex = {z:0, previous:0, checking: false};
$('#defaultcolor').minicolors({animationSpeed: 1,inline:true, opacity: true, theme:'draw',format: 'hex',swatches: swatchescolor}); // CREATE COLOR SCHEME FOR DEFAULT
$('#defaultcolor').minicolors('value','324650');

$('#selectcolor').minicolors({animationSpeed: 1,inline:true, opacity: true, theme:'draw',format: 'hex',swatches: swatchescolor}); // CREATE COLOR SCHEME FOR DEFAULT
$('#selectcolor').minicolors('value','324650');

}


// DRAW -------------------------------------------------------------------------------------------------------------------------------------

function draw() {
    background(106,116,149); // RESET BG EVERYTIME
    for (let i = 0; i < index; i++){
        if (i === isEdit.selectindex){
            joints[i].set_pointsalpha(1);
            }
        if ((joints[i].get_pointsalpha() === 1) && (i != isEdit.selectindex)){
             joints[i].set_pointsalpha(0.75);
            }
             joints[i].display();
    } // DISPLAY ALL JOINTS CREATED
       
    // PROPERTIES SETTINGS  

    // DEFAULT

    if (($('#defaultcolorval').is(":hover")) || ($('#defaultcolorval').is(":focus"))) { 
        $('#defaultcolor').minicolors('value',document.getElementById("defaultcolorval").value);
        
       
    }
    else {
        rgbvald = $('#defaultcolor').minicolors('rgbObject');
        DefaultColor = rgbvald;
        document.getElementById('directDcolor').style.backgroundColor = rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b);
        document.getElementById("defaultcolorval").value = rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b).toUpperCase();
        
    }

    if (($('#defaultalphaval').is(":hover")) || ($('#defaultalphaval').is(":focus"))) { 
        $('#defaultcolor').minicolors('opacity',document.getElementById("defaultalphaval").value);
        
    }
    else {
        DefaultAlpha = $('#defaultcolor').minicolors('opacity');
        document.getElementById('directDcolor').style.opacity = $('#defaultcolor').minicolors('opacity');
        document.getElementById("defaultalphaval").value = $('#defaultcolor').minicolors('opacity');
         
    }

    // SELECT

    if (($('#selectcolorval').is(":hover")) || ($('#selectcolorval').is(":focus"))) { 
        $('#selectcolor').minicolors('value',document.getElementById("selectcolorval").value);

       
    }
    else {
        rgbvals = $('#selectcolor').minicolors('rgbObject');
        SelectColor = rgbvals;

        if (!(rgbToHex(SelectColor.r,SelectColor.g,SelectColor.b).toUpperCase() === document.getElementById('selectcolorval').value)){
            joints[isEdit.selectindex].set_color(SelectColor.r,SelectColor.g,SelectColor.b);
        }

        document.getElementById('directScolor').style.backgroundColor = rgbToHex(SelectColor.r,SelectColor.g,SelectColor.b);
        document.getElementById("selectcolorval").value = rgbToHex(SelectColor.r,SelectColor.g,SelectColor.b).toUpperCase();
        
        
          
    }

    if (($('#selectalphaval').is(":hover")) || ($('#selectalphaval').is(":focus"))) { 
        $('#selectcolor').minicolors('opacity',document.getElementById("selectalphaval").value);
        
    }
    else {
        SelectAlpha = $('#selectcolor').minicolors('opacity');

        if (!(SelectAlpha === document.getElementById('selectalphaval').value)){
            joints[isEdit.selectindex].set_alpha(SelectAlpha);          
        }

        document.getElementById('directScolor').style.opacity = $('#selectcolor').minicolors('opacity');
        $('#selectcolor').minicolors({        
            change: document.getElementById("selectalphaval").value = $('#selectcolor').minicolors('opacity')
          });
          
    }

    // P1 AND P2 SETTINGS

    if (!(($('#p1x').is(":hover")) || ($('#p1x').is(":focus")))) { 
        document.getElementById('p1x').value = joints[isEdit.selectindex].get_p1().x;
    }
    
    if (!(($('#p1x').is(":hover")) || ($('#p1y').is(":focus")))) { 
        document.getElementById('p1y').value = joints[isEdit.selectindex].get_p1().y;
    }

    if (!(($('#p1x').is(":hover")) || ($('#p2x').is(":focus")))) { 
        document.getElementById('p2x').value = joints[isEdit.selectindex].get_p2().x;
    }

    if (!(($('#p1x').is(":hover")) || ($('#p2y').is(":focus")))) { 
        document.getElementById('p2y').value = joints[isEdit.selectindex].get_p2().y;
    }

    document.getElementById('selectindex').value = Number(isEdit.selectindex);  

    
    

    


    // MAIN

    Cursoring(); // CURSOR FUNCTION
        Drawing(); // DRAWING FUNCTION 
            Editing(); // EDITING FUNCTION

   // console.log(); // FOR NOOB TESTING
        

}
     

// MOUSE FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function mousePressed() {

    if (document.getElementById("show-draw-settings").checked) {
        SpaceNotAllowed = 250;
    }
    else {
        SpaceNotAllowed = 50;
    }

    if (mouseX > SpaceNotAllowed) { // CANNOT DRAW IF MOUSE ON PARAMETERS
        locked = true;
    }
    else {
        locked = false;
    }
        mspos = {x:mouseX,y:mouseY}   
  } 

function mouseDragged(){
        if (locked){         
          
            mspos = {x:mouseX,y:mouseY};
            dragged = true;
            
        }
}
function mouseReleased() {     
    
        mspos = {x:mouseX,y:mouseY};
        locked = false;
        dragged = false;
  }

// FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function Drawing(){
    if (Select.state === false){
        if (mouseIsPressed){
            
            if (locked === true && dragged === false && isDrawing === false){
                    isEdit.selectindex = index;
                    joints[index].set_color(DefaultColor.r,DefaultColor.g,DefaultColor.b); // DEFAULT SETTER
                    joints[index].set_alpha(DefaultAlpha);
                    joints[index].set_e(DefaultE);

                    joints[index].set_p1(mspos.x,mspos.y);
                    joints[index].set_p2(mspos.x,mspos.y);
                    isDrawing = true;
            }
            if (locked === true && dragged === true && isDrawing === true){
                    joints[index].set_p2(mspos.x,mspos.y);
                    joints[index].display(); // DISPLAY THE DRAWING ONE , REQUIRED                    
            }    
        }

        if (locked === false && dragged === false && isDrawing === true){
                    isDrawing = false;
                    index += 1;

                    // HISTORY COLORS SET
                    updateSelecteInput(DefaultE); // SYNC PARAM
                    updateSelecteSlider(DefaultE);

                    if (swatchesindex.z === 0){
                        swatchesindex.previous = 6;
                    }
                    else {
                        swatchesindex.previous = swatchesindex.z-1;
                    }
                
                    if (swatchesindex.z > 6){
                        swatchesindex.z = 0;
                    }

                    for (i = 0; i < swatchescolor.length; i++) {
                        if (!(i === swatchesindex.z)){
                            if ((rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b) === swatchescolor[i].color)) {
                                swatchescolor.checking = false;
                                break;
                             }
                             else {
                                swatchescolor.checking = true;
                             }
                        }
                        
                    }

                    if (swatchescolor.checking === true) {
                        swatchescolor[swatchesindex.z] = {name: rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b).toUpperCase(), color: rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b)};
                        $('#defaultcolor').minicolors('settings',{swatches: swatchescolor});
                        $('#selectcolor').minicolors('settings',{swatches: swatchescolor});
                            swatchesindex.z++;

                    }

                    // SYNC PARAM

                    $('#selectcolor').minicolors('value',rgbToHex(DefaultColor.r,DefaultColor.g,DefaultColor.b));
                    $('#selectcolor').minicolors('opacity',DefaultAlpha);                               
        } 
    }

}

function Cursoring() {
    // DETECT IF CURSOR ON A POINT
    if (isDrawing === false){
        for (let i = 0; i < index; i++){
            if (((mouseX > (joints[i].get_p1().x)-10) && (mouseX < (joints[i].get_p1().x)+10)) &&  (mouseY > (joints[i].get_p1().y)-10) && (mouseY < (joints[i].get_p1().y)+10)){
                Select.state = true;Select.p = 1;// P1 
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 1;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_p2().x)-10) && (mouseX < (joints[i].get_p2().x)+10)) &&  ((mouseY > (joints[i].get_p2().y)-10) && (mouseY < (joints[i].get_p2().y)+10))) {
                Select.state = true;Select.p = 2 // P2
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 2;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_pc().x)-10) && (mouseX < (joints[i].get_pc().x)+10)) &&  ((mouseY > (joints[i].get_pc().y)-10) && (mouseY < (joints[i].get_pc().y)+10))) {
                Select.state = true;Select.p = 12 // PCENTER
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 12;
                }
                break;
            }
            else {
                Select.state = false;
            }
        }
        // CHANGE CURSOR IF ON A POINT // SHOULD FIX WHEN MOUSE GO FAR AWAY
        if ((Select.state === true) && (Select.p === 1 || Select.p === 2)){
            cursor(HAND);
        }
        else if ((Select.state === true) && (Select.p === 12)){
            cursor(MOVE);
        }
        else {
            cursor(ARROW);
        }  
    }
    
}

function Editing(){
    if (isEdit.state === true) {


        if (savealpha.state === false){ // SAUVEGARDE ALPHA INITIAL
            savealpha.alpha = joints[isEdit.selectindex].c.a;
            savealpha.state = true;
        }
        

        if (isEdit.pnumber === 1){ // MOVE P1
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p1(mspos.x,mspos.y);
           
        }
        else if (isEdit.pnumber === 2){ // MOVE P2
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p2(mspos.x,mspos.y);
            
        }
        else if (isEdit.pnumber === 12){ // MOVE P1 AND P2

            if (isEdit.taked === false){ // SAVE THE ORIGINAL POSITION
            isEdit.p1pos = joints[isEdit.selectindex].get_p1();
            isEdit.p2pos = joints[isEdit.selectindex].get_p2();
            isEdit.pcenter = joints[isEdit.selectindex].get_pc();
            isEdit.taked = true;
            }   // CALC THE GAP BETWEEN THE MOUSEPOS AND THE ORIGINAL POSITION
            joints[isEdit.selectindex].set_alpha(0.5);
            joints[isEdit.selectindex].set_p1(Math.round(isEdit.p1pos.x-(isEdit.pcenter.x-mspos.x)),Math.round(isEdit.p1pos.y-(isEdit.pcenter.y-mspos.y)));
            joints[isEdit.selectindex].set_p2(Math.round(isEdit.p2pos.x-(isEdit.pcenter.x-mspos.x)),Math.round(isEdit.p2pos.y-(isEdit.pcenter.y-mspos.y)));
            
        }
        if (locked === false){
            isEdit.state = false;isEdit.taked = false;
            joints[isEdit.selectindex].set_alpha(savealpha.alpha);
            savealpha.state = false;
        }

                    // SYNC PARAM
                    $('#selectcolor').minicolors('value',rgbToHex(joints[isEdit.selectindex].c.r,joints[isEdit.selectindex].c.g,joints[isEdit.selectindex].c.b).substring(1));
                    $('#selectcolor').minicolors('opacity',savealpha.alpha); 

                    updateSelecteInput(joints[isEdit.selectindex].e);
                    updateSelecteSlider(joints[isEdit.selectindex].e);
    }
}


function deletejoint() {
    if (isDrawing === false){

        let indexcompt = isEdit.selectindex;
            while (indexcompt < index) {
                copyjoint(joints[indexcompt],joints[indexcompt+1]);
                indexcompt++;
            }
        if (index > 0){
           index--; 
        }
        if (index > 1){
           isEdit.selectindex = index - 1; 
        }   
    }  
}

function duplicatejoint() {
    if (isDrawing === false){
        if (index > 0){
          copyjoint(joints[index],joints[isEdit.selectindex],40);
        index++;  
        }
        
    }
}


function zplus() {
    if (isDrawing === false){
        if ((isEdit.selectindex >= 0) && (isEdit.selectindex < index - 1)){
            let save = new Joints();
            copyjoint(save,joints[isEdit.selectindex+1]);
            copyjoint(joints[isEdit.selectindex+1],joints[isEdit.selectindex]);
            copyjoint(joints[isEdit.selectindex],save);
            isEdit.selectindex++;
        }
        
    }
}

function zminus(){
    if (isDrawing === false){
        if ((isEdit.selectindex > 0) && (isEdit.selectindex < index )){
            let save = new Joints();
            copyjoint(save,joints[isEdit.selectindex-1]);
            copyjoint(joints[isEdit.selectindex-1],joints[isEdit.selectindex]);
            copyjoint(joints[isEdit.selectindex],save);
            isEdit.selectindex--;
        }
    }
}

function copyjoint(ele, ele2,move_x = 0,move_y = 0){
        ele.set_p1(ele2.x1+move_x,ele2.y1+move_y);
        ele.set_p2(ele2.x2+move_x,ele2.y2+move_y);
        ele.set_color(ele2.c.r,ele2.c.g,ele2.c.b);
        ele.set_e(ele2.e);
        ele.set_alpha(ele2.c.a);
}


// COLOR FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

function rgbToHex(r, g, b) {
    return ("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
  }

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// CANVAS FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


// DOM FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------


  // DEFAULT
  function updateDefaulteInput(val) {
    document.getElementById('defaultevalin').value=val; 
    DefaultE = val;
  }

  function updateDefaulteSlider(val) {
    val = Number(val);
    if (!(Number.isInteger(val))){
        val = 2;
    }
      if (val > 260){
          val = 260;
      }
      else if (val < 1){
          val = 1;
      }
    document.getElementById('defaulteval').value = val; 
    DefaultE = val;
  }


  // SELECT
  function updateSelecteInput(val) {
    document.getElementById('selectevalin').value=val; 
    joints[isEdit.selectindex].set_e(val);
  }

  function updateSelecteSlider(val) {
    val = Number(val);
    if (!(Number.isInteger(val))){
        val = 2;
    }
      if (val > 260){
          val = 260;
      }
      else if (val < 1){
          val = 1;
      }
    document.getElementById('selecteval').value=val; 
    joints[isEdit.selectindex].set_e(val);
  }

  // P1 
function updateP1x(val){
    joints[isEdit.selectindex].x1 = Number(val);
}

function updateP1y(val){
    joints[isEdit.selectindex].y1 = Number(val);
}

function updateP2x(val){
    joints[isEdit.selectindex].x2 = Number(val);
}

function updateP2y(val){
    joints[isEdit.selectindex].y2 = Number(val);
}
  // P2




// CLASS -------------------------------------------------------------------------------------------------------------------------------------------

  class Joints{
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, c = {r:0,g:0,b:0,a:1}, e = 10, pointsalpha = 0.75){
        this.x1 = x1; this.y1 = y1;
        this.x2 = x2; this.y2 = y2;
        this.c = c;
        this.e = e;
        this.pointsalpha = pointsalpha;
    }

    set_p1(x,y){
        this.x1 = x; this.y1 = y;
    }

    set_p2(x,y){
        this.x2 = x; this.y2 = y;
    }

    get_p1(){
        return {x:this.x1,y:this.y1};
    }

    get_p2(){
        return {x:this.x2,y:this.y2};
    }

    get_pc(){
        return {x:(this.x1+this.x2)/2,y:(this.y1+this.y2)/2};
    }

    set_pointsalpha(alpha){
        this.pointsalpha = alpha;
    }

    get_pointsalpha(){
        return this.pointsalpha;
    }

    set_color(r,g,b){
        this.c.r = r;        
        this.c.g = g;        
        this.c.b = b;        
    }

    set_alpha(alpha){
        this.c.a = alpha;
    }

    set_e(e){
        this.e = e;
    }
    display(){
        // DRAW LINE
        stroke(`rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`); 
        strokeWeight(this.e);
        line(this.x1,this.y1,this.x2,this.y2);
        // DRAW POINTS P1 P2
        stroke(`rgba(255,255,0,${this.pointsalpha})`); 
        strokeWeight(2);
        line(this.x1-5,this.y1,this.x1+5,this.y1);
        line(this.x1,this.y1-5,this.x1,this.y1+5);
        line(this.x2-5,this.y2,this.x2+5,this.y2);
        line(this.x2,this.y2-5,this.x2,this.y2+5);
        // DRAW POINTS PC
        stroke(`rgba(0,191,255,${this.pointsalpha})`); 
        strokeWeight(2);
        line(this.get_pc().x-5,this.get_pc().y,this.get_pc().x+5,this.get_pc().y);
        line(this.get_pc().x,this.get_pc().y-5,this.get_pc().x,this.get_pc().y+5);

    }


}