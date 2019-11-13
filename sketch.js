
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

mspos = {x:0,y:0}; // CURSOS POSITION


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
       
    Cursoring(); // CURSOR FUNCTION
        Drawing(); // DRAWING FUNCTION 
            Editing(); // EDITING FUNCTION

   // console.log(); // FOR NOOB TESTING
    // TODO -------------------
    // ADDING NAVBAR WITH PROPERTIES -- 50%
    // MAKE PROPERTIES WORK
        
    

    
    
}
     

// MOUSE FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function mousePressed() {
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
                    
                    joints[index].set_p1(mspos.x,mspos.y);
                    joints[index].set_p2(mspos.x,mspos.y);
                    joints[index].set_index(index)
                    isDrawing = true;
            }
            if (locked === true && dragged === true && isDrawing === true){
                    joints[index].set_p2(mspos.x,mspos.y);
                    joints[index].display(); // DISPLAY THE DRAWING ONE
                    
            }    
        }

        if (locked === false && dragged === false && isDrawing === true){
                    isEdit.selectindex = index;
                    isDrawing = false;
                    index += 1;
        } 
    }
    
}

function Cursoring() {
    // DETECT IF CURSOR ON A POINT
    if (isDrawing === false){
        for (let i = 0; i < index; i++){
            if (((mouseX > (joints[i].get_p1().x)-5) && (mouseX < (joints[i].get_p1().x)+5)) &&  (mouseY > (joints[i].get_p1().y)-5) && (mouseY < (joints[i].get_p1().y)+5)){
                Select.state = true;Select.p = 1;// P1 
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 1;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_p2().x)-5) && (mouseX < (joints[i].get_p2().x)+5)) &&  ((mouseY > (joints[i].get_p2().y)-5) && (mouseY < (joints[i].get_p2().y)+5))) {
                Select.state = true;Select.p = 2 // P2
                if ((locked === true) && (Select.state === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 2;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_pc().x)-5) && (mouseX < (joints[i].get_pc().x)+5)) &&  ((mouseY > (joints[i].get_pc().y)-5) && (mouseY < (joints[i].get_pc().y)+5))) {
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
        // CHANGE CURSOR IF ON A POINT
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
        if (isEdit.pnumber === 1){ // MOVE P1
            joints[isEdit.selectindex].set_p1(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }
        else if (isEdit.pnumber === 2){ // MOVE P2
            joints[isEdit.selectindex].set_p2(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }
        else if (isEdit.pnumber === 12){ // MOVE P1 AND P2

            if (isEdit.taked === false){ // SAVE THE ORIGINAL POSITION
            isEdit.p1pos = joints[isEdit.selectindex].get_p1();
            isEdit.p2pos = joints[isEdit.selectindex].get_p2();
            isEdit.pcenter = joints[isEdit.selectindex].get_pc();
            isEdit.taked = true;
            }   // CALC THE GAP BETWEEN THE MOUSEPOS AND THE ORIGINAL POSITION
            joints[isEdit.selectindex].set_p1(isEdit.p1pos.x-(isEdit.pcenter.x-+mspos.x),isEdit.p1pos.y-(isEdit.pcenter.y-mspos.y));
            joints[isEdit.selectindex].set_p2(isEdit.p2pos.x-(isEdit.pcenter.x-mspos.x),isEdit.p2pos.y-(isEdit.pcenter.y-mspos.y));
        }
        if (locked === false){
            isEdit.state = false;isEdit.taked = false;
        }
    }
}
// CLASS -------------------------------------------------------------------------------------------------------------------------------------------

  class Joints{
    constructor(){
        this.x1 = 0; this.y1 = 0;
        this.x2 = 0; this.y2 = 0;
        this.c = {r:0,g:0,b:0,a:1};
        this.e = 10;
        this.z = -1;
        this.pointsalpha = 0.75;
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
    
    set_index(index){
        this.z = index;
    }

    get_index(){
        return this.z;
    }

    set_pointsalpha(alpha){
        this.pointsalpha = alpha;
    }

    get_pointsalpha(){
        return this.pointsalpha;
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