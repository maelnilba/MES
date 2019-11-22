// TODO -------------------
// LAYOUT SETTINGS -  DELETE MOVE FLIP X Y  AND VISUAL SETTINGS
// SOMES ISSUES WITH RESET POS MAKE A GAP -- DOESNT MATTER TOO MUCH
// MAKE THICKNESS APPLY WITH ZOOM -- SOMES ISSUES TRYING EDIT SELECT ONE WITH ZOOM
// FIND NICE ICONS.......................
//  DECLARE -------------------------------------------------------------------------------------------------------------------------------------
var layouts = [];
var SpaceNotAllowed = {
    left: 50,
    right: 0
};
let tfmbg_width = 800;
let tfmbg_height = 400;
let cardinal = {
    x: Math.round(window.innerWidth / 2 - 400),
    y: Math.round(window.innerHeight / 2 - 200)
};

const originalcardinal = {
    x: Math.round(window.innerWidth / 2 - 400),
    y: Math.round(window.innerHeight / 2 - 200)
}; // FOR SET BACK POSITION

// MAIN -------------------------------------------------------------------------------------------------------------------------------------

// SETUP -------------------------------------------------------------------------------------------------------------------------------------
function setup() {
    drawcanvas = createCanvas(windowWidth, windowHeight); // BG
    background(106, 116, 149); // BG COLOR
    bgcolor = color(106, 116, 149);
    current_layout = 0;
    layout_created = 0;
    createDivLayout(current_layout);
    // CREATE LAYOUT 


    locked = false;
    dragged = false; // VAR MOUSEACTIONS
    isDrawing = false; // VAR ACTIONS
    isEdit = {
        state: false,
        pnumber: 0,
        taked: false,
        p1pos: 0,
        p2pos: 0,
        pcenter: 0
    };
    Select = {
        state: false,
        p: 0
    }; // --
    DefaultColor = {
        r: 255,
        g: 255,
        b: 0
    };
    DefaultAlpha = 1;
    savealpha = {
        state: false,
        alpha: 1
    };
    DefaultE = 2; // DEFAULT VALUE
    Defaultfb = false; // BACKGROUND OR FOREGROUND
    showpoints = {
        p1: true,
        p2: true,
        pc: true
    };

    mspos = {
        x: 0,
        y: 0
    }; // CURSOS POSITION

    // SET COLOR PICKER AND HISTORY COLOR
    swatchescolor = [{
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }, {
        name: "?",
        color: ""
    }];
    swatchesindex = {
        z: 0,
        previous: 0,
        checking: false
    };
    $('#defaultcolor').minicolors({
        animationSpeed: 1,
        inline: true,
        opacity: true,
        theme: 'draw',
        format: 'hex',
        swatches: swatchescolor
    }); // CREATE COLOR SCHEME FOR DEFAULT
    $('#defaultcolor').minicolors('value', '324650');

    $('#selectcolor').minicolors({
        animationSpeed: 1,
        inline: true,
        opacity: true,
        theme: 'draw',
        format: 'hex',
        swatches: swatchescolor
    }); // CREATE COLOR SCHEME FOR DEFAULT
    $('#selectcolor').minicolors('value', '324650');

    dragspace = {
        key: false,
        lock: false,
        x: 0,
        y: 0,
        carx: 0,
        cary: 0
    };
    zoomvalue = 1;
    zoom = {
        step: 0,
        centerx: cardinal.x + ((tfmbg_width / 2) * zoomvalue),
        centery: cardinal.y + ((tfmbg_height / 2) * zoomvalue),
    };
    

    background(106, 116, 149); // 

}


// DRAW -------------------------------------------------------------------------------------------------------------------------------------

function draw() {

    for (let c = 0; c < layouts.length; c++) {

        if (document.getElementById("btn_on_off" + layouts[c].id).checked) {
            layouts[c].setvisible(false);
        } else {
            layouts[c].setvisible(true);
        }
        
        document.getElementById("layout"+layouts[c].id).ondblclick = () => current_layout = c;
        
        if (c === current_layout){
            document.getElementById("layout"+layouts[c].id).style.backgroundColor = '#4e7486';
        } else {
            document.getElementById("layout"+layouts[c].id).style.backgroundColor = '#324650';
        }
	
    }

    if (current_layout > layouts.length-1){
        current_layout--;
    }

    for (let c = layouts.length - 1; c >= 0; c--) { // DRAW LAYOUTS DIV IN REVERSE
        layouts[c].div.style.top = String(40 + (Math.abs(c - layouts.length)) * 40) + "px";
	}

    // MAIN
    if (document.getElementById('show-draw-settings').checked) { // IF USERS OPEN DRAW EDITOR
        DisplayJoints(); // DISPLAY ALL JOINTS
        SyncSettingsDOM(); // SYNCHRONIZE SETTINGS FOR DRAWING
        Cursoring(); // CURSOR FUNCTION
        Drawing(); // DRAWING FUNCTION 
        Editing(); // EDITING FUNCTION
        DragZoom(); // DRAG CAMERA AND ZOOM FUNCTION
    } else {
        DisplayJoints(false);
    }


	// console.log(); // FOR NOOB TESTING




}

// KEY FUNCTIONS -------------------------------------------------------------------------------------------------------------------------------------
function keyTyped() {
    if (isEdit.state === false && isDrawing === false) {
        if ((key === 'd') || (key === 'D')) {
            deletejoint();
        }
        if ((key === 'c') || (key === 'C')) {
            duplicatejoint();
        }
        if (key === ' ') {
            dragspace.key = true;
            cursor(CROSS);
        }
        if ((key === 'r') || (key === 'R')) {
            resetpos();
        }
        if ((key === '-')) {
            apply_zoom(-125);
        }

        if ((key === '+')) {
            apply_zoom(125);
        }
        if ((key === 't') || (key === 'T')) {
            resetzoom();
        }
        if ((key === '&')) {
            if (showpoints.p1 === true) {
                showpoints.p1 = false;
            } else {
                showpoints.p1 = true;
            }
        }
        if ((key === '"')) {
            if (showpoints.p2 === true) {
                showpoints.p2 = false;
            } else {
                showpoints.p2 = true;
            }
        }
        if ((key === 'é')) {
            if (showpoints.pc === true) {
                showpoints.pc = false;
            } else {
                showpoints.pc = true;
            }
        }
    }
}

function keyReleased() {
    if (dragspace.key === true) { // DRAG CAMERA
        dragspace.key = false;
        dragspace.lock = false;
        if (locked === false) {
            Select.state = false;
        }
        for (let c = 0; c < layouts.length; c++) {
            for (let i = 0; i < layouts[c].index; i++) {
                layouts[c].layout[i].endmoving();
            }
        }
        cursor(ARROW);
    }
}

function mouseWheel(event) { // ZOOM      - NEED FIX SOMES ISSUES
    apply_zoom(event.delta);
}




// MOUSE FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function mousePressed() {
    if (document.getElementById("show-draw-settings").checked) {
        SpaceNotAllowed.left = 250;
        SpaceNotAllowed.right = 200;
    } else {
        SpaceNotAllowed.left = 50;
        SpaceNotAllowed.right = 0;
    }
    if ((mouseX > SpaceNotAllowed.left) && (mouseX < (windowWidth - SpaceNotAllowed.right))) { // CANNOT DRAW IF MOUSE ON PARAMETERS
        locked = true;
    } else {
        locked = false;
    }
    mspos = {
        x: mouseX,
        y: mouseY
    }
}

function mouseDragged() {
    if (locked) {
        mspos = {
            x: mouseX,
            y: mouseY
        };
        dragged = true;
    }
}

function mouseReleased() {
    if (dragspace.lock === true) {
        dragspace.lock = false;
    }
    mspos = {
        x: mouseX,
        y: mouseY
    };
    locked = false;
    dragged = false;
}

// DRAW EDITOR FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function DragZoom() {
    if (dragspace.key === true && dragged === true && isDrawing === false) { // DRAG CAMERA
        Select.state = true;
        if (dragspace.lock === false) {
            dragspace.x = mouseX;
            dragspace.y = mouseY;
            dragspace.carx = cardinal.x;
            dragspace.cary = cardinal.y;
            dragspace.lock = true;
            for (let c = 0; c < layouts.length; c++) {
                for (let i = 0; i < layouts[c].index; i++) {
                    layouts[c].layout[i].endmoving();
                }
            }

        }
        for (let c = 0; c < layouts.length; c++) {
            for (let i = 0; i < layouts[c].index; i++) {
                layouts[c].layout[i].moving(dragspace.x, dragspace.y);
            }
        }
        cardinal.x = dragspace.carx - (dragspace.x - mspos.x);
        cardinal.y = dragspace.cary - (dragspace.y - mspos.y);
        zoom.centerx = cardinal.x + (tfmbg_width / 2) * zoomvalue;
        zoom.centery = cardinal.y + (tfmbg_height / 2) * zoomvalue;
    }
}

function apply_zoom(value) {
    if ((value < 0) && (zoom.step > -2)) { // -
        zoom_less();
        zoom.step--;
        zoomvalue /= 2;
        DefaultE = DefaultE / 2;
    } else if (value > 0 && zoom.step < 2) { // +
        zoom_more();
        zoom.step++;
        zoomvalue *= 2;
        DefaultE = DefaultE * 2;
    }

    if (zoom.step > 2) {
        zoom.step = 2;
    } else if (zoom.step < -2) {
        zoom.step = -2;
    }
}

function zoom_more() {
    cardinal.x += (cardinal.x - zoom.centerx);
    cardinal.y += (cardinal.y - zoom.centery);
    for (let c = 0; c < layouts.length; c++) {
        for (let i = 0; i < layouts[c].index; i++) {
            layouts[c].layout[i].zoom(1);
        }
    }
}

function zoom_less() {
    cardinal.x -= Math.round((cardinal.x - zoom.centerx) / 2);
    cardinal.y -= Math.round((cardinal.y - zoom.centery) / 2);
    for (let c = 0; c < layouts.length; c++) {
        for (let i = 0; i < layouts[c].index; i++) {
            layouts[c].layout[i].zoom(-1);
        }
    }
}

function resetzoom() {
    if (zoom.step < 0) {
        while (zoom.step < 0) {
            apply_zoom(1);
        }
    } else if (zoom.step > 0) {
        while (zoom.step > 0) {
            apply_zoom(-1);
        }
    }
}

function DisplayJoints(showpts = true) {
    background(106, 116, 149); // RESET BG EVERYTIME
    displaytfmbg(tfmbg_width, tfmbg_height); // MAP BG

    for (let c = 0; c < layouts.length; c++) {
        if (layouts[c].visible) {
            for (let i = 0; i < layouts[c].index; i++) {
                if (layouts[c].layout[i].foreground === false) {
                    layouts[c].layout[i].display();
                }

            }
        }
        for (let i = 0; i < layouts[c].index; i++) {
            if (layouts[c].visible) {
                if (layouts[c].layout[i].foreground === true) {
                    layouts[c].layout[i].display();
                }
            }
        }
    }
    if (showpts) {
        for (let c = 0; c < layouts.length; c++) {
            if (layouts[c].visible && c === current_layout) {
                for (let i = 0; i < layouts[c].index; i++) {

                    if (i === layouts[c].selectindex) {
                        layouts[c].layout[i].set_pointsalpha(1);
                    }
                    if ((layouts[c].layout[i].get_pointsalpha() === 1) && (i != layouts[c].selectindex)) {
                        layouts[c].layout[i].set_pointsalpha(0.75);
                    }
                    layouts[c].layout[i].displaypoints(showpoints.p1, showpoints.p2, showpoints.pc);
                }
            }
        }
    }   // DISPLAY ALL JOINTS CREATED
}


function SyncSettingsDOM() {
    // PROPERTIES SETTINGS  
    // DEFAULT
    if (($('#defaultcolorval').is(":hover")) || ($('#defaultcolorval').is(":focus"))) {
        $('#defaultcolor').minicolors('value', document.getElementById("defaultcolorval").value);
    } else {
        rgbvald = $('#defaultcolor').minicolors('rgbObject');
        DefaultColor = rgbvald;
        document.getElementById('directDcolor').style.backgroundColor = rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b);
        document.getElementById("defaultcolorval").value = rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b).toUpperCase();
    }
    if (($('#defaultalphaval').is(":hover")) || ($('#defaultalphaval').is(":focus"))) {
        $('#defaultcolor').minicolors('opacity', document.getElementById("defaultalphaval").value);

    } else {
        DefaultAlpha = $('#defaultcolor').minicolors('opacity');
        document.getElementById('directDcolor').style.opacity = $('#defaultcolor').minicolors('opacity');
        document.getElementById("defaultalphaval").value = $('#defaultcolor').minicolors('opacity');
    }
    // SELECT
    if (($('#selectcolorval').is(":hover")) || ($('#selectcolorval').is(":focus"))) {
        $('#selectcolor').minicolors('value', document.getElementById("selectcolorval").value);
    } else {
        rgbvals = $('#selectcolor').minicolors('rgbObject');
        SelectColor = rgbvals;
        if (!(rgbToHex(SelectColor.r, SelectColor.g, SelectColor.b).toUpperCase() === document.getElementById('selectcolorval').value)) {
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_color(SelectColor.r, SelectColor.g, SelectColor.b);
        }
        document.getElementById('directScolor').style.backgroundColor = rgbToHex(SelectColor.r, SelectColor.g, SelectColor.b);
        document.getElementById("selectcolorval").value = rgbToHex(SelectColor.r, SelectColor.g, SelectColor.b).toUpperCase();
    }
    if (($('#selectalphaval').is(":hover")) || ($('#selectalphaval').is(":focus"))) {
        $('#selectcolor').minicolors('opacity', document.getElementById("selectalphaval").value);
    } else {
        SelectAlpha = $('#selectcolor').minicolors('opacity');
        if (!(SelectAlpha === document.getElementById('selectalphaval').value)) {
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_alpha(SelectAlpha);
        }
        document.getElementById('directScolor').style.opacity = $('#selectcolor').minicolors('opacity');
        $('#selectcolor').minicolors({
            change: document.getElementById("selectalphaval").value = $('#selectcolor').minicolors('opacity')
        });
    }
    // P1 AND P2 SETTINGS
    if (!(($('#p1x').is(":hover")) || ($('#p1x').is(":focus")))) {
        document.getElementById('p1x').value = Math.round((layouts[current_layout].layout[layouts[current_layout].selectindex].get_p1().x - cardinal.x) / zoomvalue);
    }
    if (!(($('#p1x').is(":hover")) || ($('#p1y').is(":focus")))) {
        document.getElementById('p1y').value = Math.round((layouts[current_layout].layout[layouts[current_layout].selectindex].get_p1().y - cardinal.y) / zoomvalue);
    }
    if (!(($('#p1x').is(":hover")) || ($('#p2x').is(":focus")))) {
        document.getElementById('p2x').value = Math.round((layouts[current_layout].layout[layouts[current_layout].selectindex].get_p2().x - cardinal.x) / zoomvalue);
    }
    if (!(($('#p1x').is(":hover")) || ($('#p2y').is(":focus")))) {
        document.getElementById('p2y').value = Math.round((layouts[current_layout].layout[layouts[current_layout].selectindex].get_p2().y - cardinal.y) / zoomvalue);
    }
    document.getElementById('selectindex').value = Number(layouts[current_layout].selectindex); // SYNC INDEX
}

function Drawing() {
    if ((Select.state === false) && (dragspace.key === false)) {
        if (mouseIsPressed) {
            if (locked === true && dragged === false && isDrawing === false) {
                layouts[current_layout].selectindex = layouts[current_layout].index;
                layouts[current_layout].layout[layouts[current_layout].index].set_color(DefaultColor.r, DefaultColor.g, DefaultColor.b); // DEFAULT SETTER
                layouts[current_layout].layout[layouts[current_layout].index].set_alpha(DefaultAlpha);
                layouts[current_layout].layout[layouts[current_layout].index].set_e(DefaultE);
                layouts[current_layout].layout[layouts[current_layout].index].set_foreground(Defaultfb);

                layouts[current_layout].layout[layouts[current_layout].index].set_p1(mspos.x, mspos.y);
                layouts[current_layout].layout[layouts[current_layout].index].set_p2(mspos.x, mspos.y);
                isDrawing = true;
            }
            if (locked === true && dragged === true && isDrawing === true) {
                layouts[current_layout].layout[layouts[current_layout].index].set_p2(mspos.x, mspos.y);
                if (layouts[current_layout].visible) {
                    layouts[current_layout].layout[layouts[current_layout].index].display();
                    layouts[current_layout].layout[layouts[current_layout].index].displaypoints(); // DISPLAY THE DRAWING ONE , REQUIRED   
                }
            }
        }
        if (locked === false && dragged === false && isDrawing === true) {
            isDrawing = false;
            layouts[current_layout].up_index();
            // HISTORY COLORS SET
            updateSelecteSI(DefaultE); // SYNC PARAM
            if (swatchesindex.z === 0) {
                swatchesindex.previous = 6;
            } else {
                swatchesindex.previous = swatchesindex.z - 1;
            }
            if (swatchesindex.z > 6) {
                swatchesindex.z = 0;
            }
            for (i = 0; i < swatchescolor.length; i++) {
                if (!(i === swatchesindex.z)) {
                    if ((rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b) === swatchescolor[i].color)) {
                        swatchescolor.checking = false;
                        break;
                    } else {
                        swatchescolor.checking = true;
                    }
                }
            }
            if (swatchescolor.checking === true) {
                swatchescolor[swatchesindex.z] = {
                    name: rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b).toUpperCase(),
                    color: rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b)
                };
                $('#defaultcolor').minicolors('settings', {
                    swatches: swatchescolor
                });
                $('#selectcolor').minicolors('settings', {
                    swatches: swatchescolor
                });
                swatchesindex.z++;
            }
            // SYNC PARAM
            $('#selectcolor').minicolors('value', rgbToHex(DefaultColor.r, DefaultColor.g, DefaultColor.b));
            $('#selectcolor').minicolors('opacity', DefaultAlpha);
            if (document.getElementById('selectbf').checked === true && layouts[current_layout].layout[layouts[current_layout].selectindex].foreground === false) { // SYNC FB
                $("#selectbf").prop("checked", false);
                layouts[current_layout].layout[layouts[current_layout].selectindex].foreground = false;
            } else if (document.getElementById('selectbf').checked === false && layouts[current_layout].layout[layouts[current_layout].selectindex].foreground === true) {
                $("#selectbf").prop("checked", true);
                layouts[current_layout].layout[layouts[current_layout].selectindex].foreground = true;
            }
        }
    }
}

function Cursoring() {
    // DETECT IF CURSOR ON A POINT
    if (isDrawing === false && dragspace.key === false) {
        for (let i = 0; i < layouts[current_layout].index; i++) {
            if ((((mouseX > (layouts[current_layout].layout[i].get_p1().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_p1().x) + 10)) && (mouseY > (layouts[current_layout].layout[i].get_p1().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_p1().y) + 10)) && showpoints.p1) {
                Select.state = true;
                Select.p = 1; // P1 
                if ((locked === true) && (Select.state === true) && isEdit.state === false) {
                    isEdit.state = true;
                    layouts[current_layout].selectindex = i;
                    isEdit.pnumber = 1;
                }
                break;
            } else if ((((mouseX > (layouts[current_layout].layout[i].get_p2().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_p2().x) + 10)) && ((mouseY > (layouts[current_layout].layout[i].get_p2().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_p2().y) + 10))) && showpoints.p2) {
                Select.state = true;
                Select.p = 2 // P2
                if ((locked === true) && (Select.state === true) && isEdit.state === false) {
                    isEdit.state = true;
                    layouts[current_layout].selectindex = i;
                    isEdit.pnumber = 2;
                }
                break;
            } else if ((((mouseX > (layouts[current_layout].layout[i].get_pc().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_pc().x) + 10)) && ((mouseY > (layouts[current_layout].layout[i].get_pc().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_pc().y) + 10))) && showpoints.pc) {
                Select.state = true;
                Select.p = 12 // PCENTER
                if ((locked === true) && (Select.state === true) && isEdit.state === false) {
                    isEdit.state = true;
                    layouts[current_layout].selectindex = i;
                    isEdit.pnumber = 12;
                }
                break;
            } else {
                Select.state = false;
            }
        }
        // CHANGE CURSOR IF ON A POINT // SHOULD FIX WHEN MOUSE GO FAR AWAY
        if ((Select.state === true) && (Select.p === 1 || Select.p === 2)) {
            cursor(HAND);
        } else if ((Select.state === true) && (Select.p === 12)) {
            cursor(MOVE);
        } else {
            cursor(ARROW);
        }
    }
}

function Editing() {
    if (isEdit.state === true) {
        if (savealpha.state === false) { // SAUVEGARDE ALPHA INITIAL
            savealpha.alpha = layouts[current_layout].layout[layouts[current_layout].selectindex].c.a;
            savealpha.state = true;
        }
        if (isEdit.pnumber === 1) { // MOVE P1
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_alpha(0.5);
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_p1(mspos.x, mspos.y);
        } else if (isEdit.pnumber === 2) { // MOVE P2
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_alpha(0.5);
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_p2(mspos.x, mspos.y);
        } else if (isEdit.pnumber === 12) { // MOVE P1 AND P2
            if (isEdit.taked === false) { // SAVE THE ORIGINAL POSITION
                isEdit.p1pos = layouts[current_layout].layout[layouts[current_layout].selectindex].get_p1();
                isEdit.p2pos = layouts[current_layout].layout[layouts[current_layout].selectindex].get_p2();
                isEdit.pcenter = layouts[current_layout].layout[layouts[current_layout].selectindex].get_pc();
                isEdit.taked = true;
            } // CALC THE GAP BETWEEN THE MOUSEPOS AND THE ORIGINAL POSITION
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_alpha(0.5);
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_p1(Math.round(isEdit.p1pos.x - (isEdit.pcenter.x - mspos.x)), Math.round(isEdit.p1pos.y - (isEdit.pcenter.y - mspos.y)));
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_p2(Math.round(isEdit.p2pos.x - (isEdit.pcenter.x - mspos.x)), Math.round(isEdit.p2pos.y - (isEdit.pcenter.y - mspos.y)));
        }
        if (locked === false) {
            isEdit.state = false;
            isEdit.taked = false;
            layouts[current_layout].layout[layouts[current_layout].selectindex].set_alpha(savealpha.alpha);
            savealpha.state = false;
        }
        // SYNC PARAM
        $('#selectcolor').minicolors('value', rgbToHex(layouts[current_layout].layout[layouts[current_layout].selectindex].c.r, layouts[current_layout].layout[layouts[current_layout].selectindex].c.g, layouts[current_layout].layout[layouts[current_layout].selectindex].c.b).substring(1));
        $('#selectcolor').minicolors('opacity', savealpha.alpha);
        updateSelecteSI(layouts[current_layout].layout[layouts[current_layout].selectindex].e);
        if (document.getElementById('selectbf').checked === true && layouts[current_layout].layout[layouts[current_layout].selectindex].foreground === false) { // SYNC FB 
            $("#selectbf").prop("checked", false);
            layouts[current_layout].layout[layouts[current_layout].selectindex].foreground = false;
        } else if (document.getElementById('selectbf').checked === false && layouts[current_layout].layout[layouts[current_layout].selectindex].foreground === true) {
            $("#selectbf").prop("checked", true);
            layouts[current_layout].layout[layouts[current_layout].selectindex].foreground = true;
        }
    }
}


function deletejoint() {
    if (isDrawing === false) {
        let indexcompt = layouts[current_layout].selectindex;
        while (indexcompt < layouts[current_layout].index) {
            copyjoint(layouts[current_layout].layout[indexcompt], layouts[current_layout].layout[indexcompt + 1]);
            indexcompt++;
        }
        if (layouts[current_layout].index > 0) {
            layouts[current_layout].down_index();
        }
        if (layouts[current_layout].index >= 1) {
            layouts[current_layout].selectindex = layouts[current_layout].index - 1;
        }
        Select.state = false;
    }
}

function duplicatejoint() {
    if (isDrawing === false) {
        if (layouts[current_layout].index > 0) {
            copyjoint(layouts[current_layout].layout[layouts[current_layout].index], layouts[current_layout].layout[layouts[current_layout].selectindex], 40);
            layouts[current_layout].selectindex = layouts[current_layout].index;
            layouts[current_layout].up_index();
        }
        Select.state = false;
    }
}


function zplus() {
    if (isDrawing === false) {
        if ((layouts[current_layout].selectindex >= 0) && (layouts[current_layout].selectindex < layouts[current_layout].index - 1)) {
            let save = new Joints();
            copyjoint(save, layouts[current_layout].layout[layouts[current_layout].selectindex + 1]);
            copyjoint(layouts[current_layout].layout[layouts[current_layout].selectindex + 1], layouts[current_layout].layout[layouts[current_layout].selectindex]);
            copyjoint(layouts[current_layout].layout[layouts[current_layout].selectindex], save);
            layouts[current_layout].selectindex++;
        }
    }
}

function zminus() {
    if (isDrawing === false) {
        if ((layouts[current_layout].selectindex > 0) && (layouts[current_layout].selectindex < layouts[current_layout].index)) {
            let save = new Joints();
            copyjoint(save, layouts[current_layout].layout[layouts[current_layout].selectindex - 1]);
            copyjoint(layouts[current_layout].layout[layouts[current_layout].selectindex - 1], layouts[current_layout].layout[layouts[current_layout].selectindex]);
            copyjoint(layouts[current_layout].layout[layouts[current_layout].selectindex], save);
            layouts[current_layout].selectindex--;
        }
    }
}

function copyjoint(ele, ele2, move_x = 0, move_y = 0) {
    ele.set_p1(ele2.x1 + move_x * zoomvalue, ele2.y1 + move_y * zoomvalue);
    ele.set_p2(ele2.x2 + move_x * zoomvalue, ele2.y2 + move_y * zoomvalue);
    ele.set_color(ele2.c.r, ele2.c.g, ele2.c.b);
    ele.set_e(ele2.e);
    ele.set_alpha(ele2.c.a);
}

function resetpos() { // DETERMINE THE DISTANCE BETWEEN THE ACTUAL CARDINAL AND THE ORIGINAL AND APPLY THE DISTANCE TO COME BACK, should edit with resize canvas the original one
    let dist = {
        x: cardinal.x - originalcardinal.x,
        y: cardinal.y - originalcardinal.y
    };
    cardinal.x = cardinal.x - dist.x; // NEED TO FIX THE GAP WHEN YOU RESET WITH SCROLL, DOESNT MATTER TOO MUCH BUT NOT SATISFTYING
    cardinal.y = cardinal.y - dist.y;
    zoom.centerx = cardinal.x + (tfmbg_width / 2) * zoomvalue;
    zoom.centery = cardinal.y + (tfmbg_height / 2) * zoomvalue;
    for (let c = 0; c < layouts.length; c++) {
        for (let i = 0; i < layouts[c].index; i++) {
            layouts[c].layout[i].moveby(-dist.x, -dist.y);
        }
    }
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
    background(106, 116, 149); // 
    displaytfmbg(tfmbg_width, tfmbg_height); // MAP BG
}

function displaytfmbg(width, height, visible = true) {
    if (visible) {
        stroke('#878FAA');
        strokeWeight(5);
        fill(bgcolor);
        rect(zoom.centerx - (zoom.centerx - cardinal.x), zoom.centery - (zoom.centery - cardinal.y), width * zoomvalue, height * zoomvalue);
        fill('#878FAA');
        rect(zoom.centerx - (zoom.centerx - cardinal.x), zoom.centery - (zoom.centery - cardinal.y), width * zoomvalue, 20 * zoomvalue);
        fill('#878FAA');
        rect(zoom.centerx - (zoom.centerx - cardinal.x), zoom.centery - (zoom.centery - cardinal.y) + height * zoomvalue, width * zoomvalue, 200 * zoomvalue);

    }

}
// NAV DOM FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------


function opensettings(setchoose) { // CLOSE ALL OTHER EDITOR WHEN YOU OPEN ONE
    if (setchoose === "draw") {
        $("#show-xml-settings").prop("checked", false);
    } else if (setchoose === "xml") {
        $("#show-draw-settings").prop("checked", false);
    }

}

function changelayout() { // RESET SELECTED VALUE NOT ATTRIBUATE TO LAYOUTS CLASS
    isEdit = {
        state: false,
        pnumber: 0,
        taked: false,
        p1pos: 0,
        p2pos: 0,
        pcenter: 0
    };

    Select = {
        state: false,
        p: 0
    };
}

// DOM FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------

function createDivLayout(cur_l) {
    changelayout();
    // 
    layouts.push(new Layouts(layout_created));
    layouts[cur_l].create_layout();
    layouts[cur_l].createDiv();
    layout_created++;
}

function getLayoutPos(id) {
    for (let p = 0; p < layouts.length; p++) {
        if (layouts[p].id === Number(id)) {
            return p;
        }
    }
}

function LayoutDown(layout_id) {
    let layout_save = new Layouts(999);
    let id = getLayoutPos(layout_id);
	let min_id = Number(layouts[0].id);
	changelayout();
    if (!(Number(layouts[id].id) === min_id)) {
        layout_save = layouts[id];
        layouts[id] = layouts[Number(id) - 1];
        layouts[Number(id) - 1] = layout_save;
        if (id === current_layout){
                current_layout--;
        }

    }
}

function LayoutUp(layout_id) {
    let layout_save = new Layouts(999);
    let id = getLayoutPos(layout_id);
    let max_id = Number(layouts[layouts.length - 1].id);
	changelayout();
    if (!(Number(layouts[id].id) === max_id)) {
        layout_save = layouts[id];
        layouts[id] = layouts[Number(id) + 1];
        layouts[Number(id) + 1] = layout_save;
        
        if (id === current_layout){
                current_layout++;
        }

    } 
}

function LayoutDel(layout_id){
	let id = getLayoutPos(layout_id);
	changelayout();
	if (layouts.length > 1){
		document.getElementById("layout" + layouts[id].id).outerHTML = "";
		layouts.splice(id,1);
    }

    if (id < current_layout){
        current_layout--;
    }
}



// DEFAULT
function updateDefaulteSI(val) {
    document.getElementById('defaultevalin').value = val;
    document.getElementById('defaulteval').value = val;

}

function setDefaulteSI(val) {
    DefaultE = val;
}

// SELECT
function updateSelecteSI(val) {
    val = Number(val);
    document.getElementById('selectevalin').value = val;
    document.getElementById('selecteval').value = val;
}

function setSelecteSI(val) {
    layouts[current_layout].layout[layouts[current_layout].selectindex].set_e(val);
}


// P1 
function updateP1x(val) {
    layouts[current_layout].layout[layouts[current_layout].selectindex].x1 = (Number(val) + cardinal.x);
}

function updateP1y(val) {
    layouts[current_layout].layout[layouts[current_layout].selectindex].y1 = (Number(val) + cardinal.y);
}

function updateP2x(val) {
    layouts[current_layout].layout[layouts[current_layout].selectindex].x2 = (Number(val) + cardinal.x);
}

function updateP2y(val) {
    layouts[current_layout].layout[layouts[current_layout].selectindex].y2 = (Number(val) + cardinal.y);
}

function updatebf() {
    if (Defaultfb === false) {
        Defaultfb = true;
    } else if (Defaultfb === true) {
        Defaultfb = false;
    }
}

function updatesbf() {
    let state = document.getElementById('selectbf').checked;
    layouts[current_layout].layout[layouts[current_layout].selectindex].set_foreground(state);
}


// XML FUNCTIONS -----------------------------------------------------------------------------------------------------------------------------------
// <C><P /><Z><S /><D /><O /><L><JD P1="245,184"P2="479,82"c="ffffff,2,1,0"/></L></Z></C>
function savexml() {
	resetzoom();
    resetpos();
    let XML = "";
    XML += '<C><P /><Z><S /><D /><O /><L>';
    for (c = 0; c < layouts.length; c++) {
        for (i = 0; i < layouts[c].index; i++) {
            XML += `<JD P1="${layouts[c].layout[i].x1-cardinal.x},${layouts[c].layout[i].y1-cardinal.y}"P2="${layouts[c].layout[i].x2-cardinal.x},${layouts[c].layout[i].y2-cardinal.y}"c="`;
            XML += `${rgbToHex(layouts[c].layout[i].c.r,layouts[c].layout[i].c.g,layouts[c].layout[i].c.b).substring(1)},${layouts[c].layout[i].e}`;
            if (!(Number(layouts[c].layout[i].c.a) === 1)) {
                XML += `,${Number(layouts[c].layout[i].c.a).toFixed(2)}`;
            }
            if (layouts[c].layout[i].foreground === true) {
                XML += ",1";
            }
            XML += '"/>'
        }
    }
    XML += "</L></Z></C>";
    document.getElementById('save-xml').value = XML;
}

// <JD P1="245,184"P2="479,82"c="ffffff,2,1,0"/>
function loadxml() {
    resetzoom();
    resetpos();
    let XML = document.getElementById('load-xml').value;
    let JD;
    if (XML.startsWith('<C><P')) {
        XML = XML.substring(
            XML.lastIndexOf("<L>") + 3,
            XML.lastIndexOf("</L>")
        ); // FILTER THE JOINTS SECTION
        XML = XML.split("<");
        XML.splice(0, 1); // SPLIT ALL JD, also delete the first wrong value ""
        // ["JD P1=", "245,184", "P2=", "479,82", "c=", "ffffff,2,1,0", "/>"]
        //     0         1         2       3        4          5 
        for (i = 0; i < XML.length; i++) {
            JD = XML[i].split('"');
            let pt1 = {
                x: 0,
                y: 0,
                JD: ""
            };
            if (!(JD[0] == "JPL P1=")) { // SHOULD IMPLEMENT JPL 
                pt1.JD = JD[1].split(",");
                pt1.x = Number(pt1.JD[0]);
                pt1.y = Number(pt1.JD[1]);
                let pt2 = {
                    x: 0,
                    y: 0,
                    JD: ""
                };
                pt2.JD = JD[3].split(",");
                pt2.x = Number(pt2.JD[0]);
                pt2.y = Number(pt2.JD[1]);
                let ptparam = {
                    color: "",
                    e: 0,
                    a: 1,
                    foreground: false,
                    JD: ""
                };
                ptparam.JD = JD[5].split(",");
                let ptcolor = {
                    r: 0,
                    g: 0,
                    b: 0,
                    JD: ""
                };
                ptcolor.JD = ptparam.JD[0];
                ptcolor.r = hexToRgb(ptcolor.JD).r;
                ptcolor.g = hexToRgb(ptcolor.JD).g;
                ptcolor.b = hexToRgb(ptcolor.JD).b;
                ptparam.e = Number(ptparam.JD[1]);
                if (ptparam.JD.length <= 3) {
                    if ((Number(ptparam.JD[2]) < 1)) {
                        ptparam.a = Number(ptparam.JD[2]);
                    } else {
                        ptparam.a = 1;
                    }
                }
                if (ptparam.JD.length <= 4) {
                    ptparam.foreground = true;
                } else {
                    ptparam.foreground = false;
                }
                layouts[current_layout].layout[i + layouts[current_layout].index].set_p1(pt1.x + cardinal.x, pt1.y + cardinal.y);
                layouts[current_layout].layout[i + layouts[current_layout].index].set_p2(pt2.x + cardinal.x, pt2.y + cardinal.y);
                layouts[current_layout].layout[i + layouts[current_layout].index].set_color(ptcolor.r, ptcolor.g, ptcolor.b);
                layouts[current_layout].layout[i + layouts[current_layout].index].set_e(ptparam.e);
                layouts[current_layout].layout[i + layouts[current_layout].index].set_alpha(ptparam.a);
                layouts[current_layout].layout[i + layouts[current_layout].index].set_foreground(ptparam.foreground);
            } // END IF
        } // END FOR
        layouts[current_layout].selectindex = XML.length + layouts[current_layout].index - 1;
        layouts[current_layout].index = XML.length + layouts[current_layout].index;
        // DISPLAY EXCEPT POINTS
        DisplayJoints(false);
    } // END IF STARTSWITH
    else {
        alert("You can't load a wrong XML");
    }
}

function clearAll() {
    if (confirm("Are you sure to delete all ?")) {
        current_layout = 0;
        for (let c = layout_created-1; c > 0; c--) {
            LayoutDel(c);
        }
        for (let i = 0; i < layouts[0].index; i++) {
            layouts[0].layout[i] = new Joints();
        }

        layouts[0].index = 0;layouts[0].selectindex = 0;
    
        layout_created = 1;
    }
}


// CLASS -------------------------------------------------------------------------------------------------------------------------------------------

class Joints {
    constructor(x1 = 0, y1 = 0, x2 = 0, y2 = 0, c = {
        r: 0,
        g: 0,
        b: 0,
        a: 1
    }, e = 10, pointsalpha = 0.75, foreground = false) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.c = c;
        this.e = e;
        this.pointsalpha = pointsalpha;
        this.foreground = foreground;
        this.move = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0,
            cx: 0,
            cy: 0,
            lock: false
        };

    }

    set_p1(x, y) {
        this.x1 = x;
        this.y1 = y;
    }

    set_p2(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    get_p1() {
        return {
            x: this.x1,
            y: this.y1
        };
    }

    get_p2() {
        return {
            x: this.x2,
            y: this.y2
        };
    }

    get_pc() {
        return {
            x: (this.x1 + this.x2) / 2,
            y: (this.y1 + this.y2) / 2
        };
    }

    moveby(x, y) {
        this.x1 += x;
        this.x2 += x;
        this.y1 += y;
        this.y2 += y;
    }

    moving(drx = 0, dry = 0) {

        if (this.move.lock === false) {
            this.move.x1 = this.x1;
            this.move.x2 = this.x2;
            this.move.y1 = this.y1;
            this.move.y2 = this.y2;
            this.move.cx = this.get_pc().x;
            this.move.cy = this.get_pc().y;
            this.move.lock = true;
        }
        this.x1 = this.move.x1 - (drx - mouseX);
        this.x2 = this.move.x2 - (drx - mouseX);
        this.y1 = this.move.y1 - (dry - mouseY);
        this.y2 = this.move.y2 - (dry - mouseY);
    }

    endmoving() {
        this.move.lock = false;
    }

    set_pointsalpha(alpha) {
        this.pointsalpha = alpha;
    }

    get_pointsalpha() {
        return this.pointsalpha;
    }

    set_color(r, g, b) {
        this.c.r = r;
        this.c.g = g;
        this.c.b = b;
    }

    set_alpha(alpha) {
        this.c.a = alpha;
    }

    set_e(e) {
        this.e = e;
    }

    set_foreground(foreground) {
        this.foreground = foreground;
    }

    displaypoints(p1 = true, p2 = true, pc = true) {
        // DRAW POINTS P1 P2

        stroke(`rgba(255,255,0,${this.pointsalpha})`);
        strokeWeight(2);
        if (p1) {
            line(this.x1 - 5, this.y1, this.x1 + 5, this.y1);
            line(this.x1, this.y1 - 5, this.x1, this.y1 + 5);
        }

        if (p2) {
            line(this.x2 - 5, this.y2, this.x2 + 5, this.y2);
            line(this.x2, this.y2 - 5, this.x2, this.y2 + 5);
        }

        if (pc) {
            stroke(`rgba(0,191,255,${this.pointsalpha})`);
            strokeWeight(2);
            line(this.get_pc().x - 5, this.get_pc().y, this.get_pc().x + 5, this.get_pc().y);
            line(this.get_pc().x, this.get_pc().y - 5, this.get_pc().x, this.get_pc().y + 5);
        }
    }

    display() {
        // DRAW LINE
        stroke(`rgba(${this.c.r},${this.c.g},${this.c.b},${this.c.a})`);
        strokeWeight(this.e);
        line(this.x1, this.y1, this.x2, this.y2);
    }

    zoom(value) {
        // CALCUL LA DISTANCE ENTRE LE POINT CENTRALE ET LA MULTPILIE ??
        if (value > 0) { // +
            this.x1 += this.x1 - zoom.centerx;
            this.x2 += this.x2 - zoom.centerx;
            this.y1 += this.y1 - zoom.centery;
            this.y2 += this.y2 - zoom.centery;
            this.e *= 2;
        } else { // -
            this.x1 -= Math.round((this.x1 - zoom.centerx) / 2);
            this.x2 -= Math.round((this.x2 - zoom.centerx) / 2);
            this.y1 -= Math.round((this.y1 - zoom.centery) / 2);
            this.y2 -= Math.round((this.y2 - zoom.centery) / 2);
            this.e /= 2;
        }
    }
}

// LAYOUTS IS AN ARRAY OF LAYOUTS() AND LAYOUTS HAS AN ARRAY OF JOINTS() AS LAYOUT
class Layouts { // layouts[current_layout].layout[value]
    constructor(id) {
        this.layout = [];
        this.id = id;
        this.index = 0;
        this.z = 0;
        this.selectindex = 0;
        this.visible = true;
        this.div;
        this.label;
        this.btn_on_off;
        this.btn_up;
		this.btn_down;
        this.btn_del;
        this.set_z;
    }

    create_layout() { // TYPE SHOULD BE JTS FOR JOINTS TXT FOR TEXT ..
        for (let i = 0; i < 2000; i++) { // CREATE 2000 POSSIBLE LINE, MIGHT CHANGE THIS
            this.layout.push(new Joints());
        }
    }
    set_layout(array) {
        this.layout = array;
    }
    set_index(value) {
        this.index = value;
    }

    up_index() {
        this.index = this.index + 1;
    }

    down_index() {
        this.index = this.index - 1;
    }
    setvisible(bool) {
        this.visible = bool;
    }
    createDiv() {

        this.div = document.createElement("DIV");
        this.div.id = "layout" + this.id;
        this.div.className = "layouts";
        this.div.style.width = "200px";
        this.div.style.height = "40px";
        this.div.style.position = "absolute";
        document.getElementById("layout-settings").appendChild(this.div); //
        this.label = document.createElement('input');
        this.label.type = "text";
        this.label.value = "L"+(layouts.length-1);
        this.label.className = "layoutlabel";
        document.getElementById("layout" + this.id).appendChild(this.label);
        this.btn_on_off = document.createElement('input');
        this.btn_on_off.type = "checkbox";
        this.btn_on_off.value = "On";
        this.btn_on_off.id = "btn_on_off" + this.id;
        this.btn_on_off.className = "btn_on_off";
        document.getElementById("layout" + this.id).appendChild(this.btn_on_off); //
        this.btn_up = document.createElement('input');
        this.btn_up.type = "button";
        this.btn_up.value = "↑";
        this.btn_up.id = "btn_up" + this.id;
        this.btn_up.className = "btn_up";
        this.btn_up.onclick = function() {
            LayoutUp(this.id.replace("btn_up", ""));
        }
        document.getElementById("layout" + this.id).appendChild(this.btn_up); //
        this.btn_down = document.createElement('input');
        this.btn_down.type = "button";
        this.btn_down.value = "↓";
        this.btn_down.id = "btn_down" + this.id;
        this.btn_down.className = "btn_down";
        this.btn_down.onclick = function() {
            LayoutDown(this.id.replace("btn_down", ""));
        }
		document.getElementById("layout" + this.id).appendChild(this.btn_down); //
		this.btn_del = document.createElement('input');
        this.btn_del.type = "button";
        this.btn_del.value = "X";
        this.btn_del.id = "btn_down" + this.id;
        this.btn_del.className = "btn_del";
        this.btn_del.onclick = function() {
            LayoutDel(this.id.replace("btn_down", ""));
        }
        document.getElementById("layout" + this.id).appendChild(this.btn_del); //
        this.set_z = document.createElement('input');
        this.set_z.type = "text";
        this.set_z.value = "0";
        this.set_z.className = "layoutlabelz";
        this.set_z.oninput = () => this.z = this.value;
        document.getElementById("layout" + this.id).appendChild(this.set_z);
    }
}