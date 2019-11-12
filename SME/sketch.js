
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
isEdit = {state: false, pnumber: 0, selectindex: 0};

Select = false; // --

mspos = {x:0,y:0}; // CURSOS POSITION


}


// DRAW -------------------------------------------------------------------------------------------------------------------------------------

function draw() {
    background(106,116,149); // RESET BG EVERYTIME
    for (let i = 0; i < index; i++){
             joints[i].display();
    } // DISPLAY ALL JOINTS CREATED
       
    Cursoring(); // CURSOR FUNCTION
        Drawing(); // DRAWING FUNCTION 
            Editing(); // EDITING FUNCTION
    
    // TODO -------------------
    // EDITING CENTER POINT : MAKE GET_CENTER AND EDIT CURSORING + EDITING functions
    // CHANGE COLOR TO RGBA MAKE SET COLOR GET COLOR GET OPACITY AND MAKE SELECT ITEM ARROW OPACITY 1 ELSE 0.5 
        
    

    
    
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
    if (Select === false){
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
                Select = true; // P1
                if ((locked === true) && (Select === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 1;
                }
                break;
            }
            else if (((mouseX > (joints[i].get_p2().x)-5) && (mouseX < (joints[i].get_p2().x)+5)) &&  ((mouseY > (joints[i].get_p2().y)-5) && (mouseY < (joints[i].get_p2().y)+5))) {
                Select = true; // P2
                if ((locked === true) && (Select === true) && isEdit.state === false){
                    isEdit.state = true;isEdit.selectindex = i;isEdit.pnumber = 2;
                }
                break;
            }
            else {
                Select = false;
            }
        }
        // CHANGE CURSOR IF ON A POINT
        if (Select === true){
            cursor(HAND);
        }
        else {
            cursor(ARROW);
        }  
    }
    
}

function Editing(){
    if (isEdit.state === true) {
        if (isEdit.pnumber === 1){
            joints[isEdit.selectindex].set_p1(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }
        else if (isEdit.pnumber === 2){
            joints[isEdit.selectindex].set_p2(mspos.x,mspos.y);
            joints[isEdit.selectindex].display();
        }

        if (locked === false){
            isEdit.state = false;
        }
    }
}
// CLASS -------------------------------------------------------------------------------------------------------------------------------------------

  class Joints{
    constructor(){
        this.x1 = 0; this.y1 = 0;
        this.x2 = 0; this.y2 = 0;
        this.c = '#000000';
        this.e = 10;
        this.z = -1;
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

    set_index(index){
        this.z = index;
    }

    get_index(){
        return this.z;
    }

    display(){
        // DRAW LINE
        stroke(this.c); 
        strokeWeight(this.e);
        line(this.x1,this.y1,this.x2,this.y2);
        // DRAW POINTS
        stroke('#FFFF00'); 
        strokeWeight(2);
        line(this.x1-5,this.y1,this.x1+5,this.y1);
        line(this.x1,this.y1-5,this.x1,this.y1+5);
        line(this.x2-5,this.y2,this.x2+5,this.y2);
        line(this.x2,this.y2-5,this.x2,this.y2+5);
    }


}