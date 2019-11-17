// TODO -------------------


//  DECLARE -------------------------------------------------------------------------------------------------------------------------------------
var layouts = [];
var SpaceNotAllowed = 50;
let tfmbg_width = 800;
let tfmbg_height = 400;
let cardinal = {
	x: Math.round(window.innerWidth / 2 - 400),
	y: Math.round(window.innerHeight / 2 - 200)
};

// MAIN -------------------------------------------------------------------------------------------------------------------------------------

// SETUP -------------------------------------------------------------------------------------------------------------------------------------
function setup() {
	createCanvas(window.innerWidth, window.innerHeight); // BG
	background(106, 116, 149); // BG COLOR
	bgcolor = color(106, 116, 149);
	current_layout = 0;
	// CREATE LAYOUT 
	// layouts[current_layout].layout[value] = joint
	layouts.push(new Layouts());
	layouts[current_layout].create_layout();

	/* for (let i = 0; i < 2000; i++) { // CREATE 2000 POSSIBLE LINE, MIGHT CHANGE THIS
	    joints.push(new Joints());
	          } */
	// avant : joints[] -- layouts[current_layout].layout[]


	background(106, 116, 149); // 
	displaytfmbg(tfmbg_width, tfmbg_height); // MAP BG

	index = 0; // Z VALUE
	locked = false;
	dragged = false; // VAR MOUSEACTIONS
	isDrawing = false; // VAR ACTIONS
	isEdit = {
		state: false,
		pnumber: 0,
		selectindex: 0,
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

}


// DRAW -------------------------------------------------------------------------------------------------------------------------------------

function draw() {


	// MAIN
	if (document.getElementById('show-draw-settings').checked) { // IF USERS OPEN DRAW EDITOR
		DisplayJoints(); // DISPLAY ALL JOINTS
		SyncSettingsDOM(); // SYNCHRONIZE SETTINGS FOR DRAWING
		Cursoring(); // CURSOR FUNCTION
		Drawing(); // DRAWING FUNCTION 
		Editing(); // EDITING FUNCTION
	} else {
		DisplayJoints(false);
	}


	// console.log(); // FOR NOOB TESTING


}

// KEY FUNCTIONS -------------------------------------------------------------------------------------------------------------------------------------


function keyTyped() {
	if (isEdit.state === false) {
		if ((key === 'd') || (key === 'D')) {
			deletejoint();
		}

		if ((key === 'c') || (key === 'C')) {
			duplicatejoint();
		}
	}


}

// MOUSE FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------

function mousePressed() {

	if (document.getElementById("show-draw-settings").checked) {
		SpaceNotAllowed = 250;
	} else {
		SpaceNotAllowed = 50;
	}

	if (mouseX > SpaceNotAllowed) { // CANNOT DRAW IF MOUSE ON PARAMETERS
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

	mspos = {
		x: mouseX,
		y: mouseY
	};
	locked = false;
	dragged = false;
}

// DRAW EDITOR FUNCTIONS --------------------------------------------------------------------------------------------------------------------------------
function DisplayJoints(showpts = true) {
	background(106, 116, 149); // RESET BG EVERYTIME
	displaytfmbg(tfmbg_width, tfmbg_height); // MAP BG

    for (let c = 0; c < layouts.length; c++){
        for (let i = 0; i < index; i++) {
            if (layouts[c].layout[i].foreground === false) {
                layouts[c].layout[i].display();
            }

        }

        for (let i = 0; i < index; i++) {
            if (layouts[c].layout[i].foreground === true) {
                layouts[c].layout[i].display();
            }

        }
    }
	

	if (showpts) {
        for (let c = 0; c < layouts.length; c++){
            for (let i = 0; i < index; i++) {

                if (i === isEdit.selectindex) {
                    layouts[c].layout[i].set_pointsalpha(1);
                }
                if ((layouts[c].layout[i].get_pointsalpha() === 1) && (i != isEdit.selectindex)) {
                    layouts[c].layout[i].set_pointsalpha(0.75);
                }
                layouts[c].layout[i].displaypoints(showpoints.p1, showpoints.p2, showpoints.pc);
            } 
        }
		
	}

	// DISPLAY ALL JOINTS CREATED
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
			layouts[current_layout].layout[isEdit.selectindex].set_color(SelectColor.r, SelectColor.g, SelectColor.b);
		}

		document.getElementById('directScolor').style.backgroundColor = rgbToHex(SelectColor.r, SelectColor.g, SelectColor.b);
		document.getElementById("selectcolorval").value = rgbToHex(SelectColor.r, SelectColor.g, SelectColor.b).toUpperCase();


	}

	if (($('#selectalphaval').is(":hover")) || ($('#selectalphaval').is(":focus"))) {
		$('#selectcolor').minicolors('opacity', document.getElementById("selectalphaval").value);

	} else {
		SelectAlpha = $('#selectcolor').minicolors('opacity');

		if (!(SelectAlpha === document.getElementById('selectalphaval').value)) {
			layouts[current_layout].layout[isEdit.selectindex].set_alpha(SelectAlpha);
		}

		document.getElementById('directScolor').style.opacity = $('#selectcolor').minicolors('opacity');
		$('#selectcolor').minicolors({
			change: document.getElementById("selectalphaval").value = $('#selectcolor').minicolors('opacity')
		});

	}

	// P1 AND P2 SETTINGS

	if (!(($('#p1x').is(":hover")) || ($('#p1x').is(":focus")))) {
		document.getElementById('p1x').value = layouts[current_layout].layout[isEdit.selectindex].get_p1().x - cardinal.x;
	}

	if (!(($('#p1x').is(":hover")) || ($('#p1y').is(":focus")))) {
		document.getElementById('p1y').value = layouts[current_layout].layout[isEdit.selectindex].get_p1().y - cardinal.y;
	}

	if (!(($('#p1x').is(":hover")) || ($('#p2x').is(":focus")))) {
		document.getElementById('p2x').value = layouts[current_layout].layout[isEdit.selectindex].get_p2().x - cardinal.x;
	}

	if (!(($('#p1x').is(":hover")) || ($('#p2y').is(":focus")))) {
		document.getElementById('p2y').value = layouts[current_layout].layout[isEdit.selectindex].get_p2().y - cardinal.y;
	}

	document.getElementById('selectindex').value = Number(isEdit.selectindex); // SYNC INDEX


}

function Drawing() {
	if (Select.state === false) {
		if (mouseIsPressed) {

			if (locked === true && dragged === false && isDrawing === false) {
				isEdit.selectindex = index;
				layouts[current_layout].layout[index].set_color(DefaultColor.r, DefaultColor.g, DefaultColor.b); // DEFAULT SETTER
				layouts[current_layout].layout[index].set_alpha(DefaultAlpha);
				layouts[current_layout].layout[index].set_e(DefaultE);
				layouts[current_layout].layout[index].set_foreground(Defaultfb);

				layouts[current_layout].layout[index].set_p1(mspos.x, mspos.y);
				layouts[current_layout].layout[index].set_p2(mspos.x, mspos.y);
				isDrawing = true;
			}
			if (locked === true && dragged === true && isDrawing === true) {
				layouts[current_layout].layout[index].set_p2(mspos.x, mspos.y);
				layouts[current_layout].layout[index].display();
				layouts[current_layout].layout[index].displaypoints(); // DISPLAY THE DRAWING ONE , REQUIRED                    
			}
		}

		if (locked === false && dragged === false && isDrawing === true) {
			isDrawing = false;
			index += 1;

			// HISTORY COLORS SET
			updateSelecteInput(DefaultE); // SYNC PARAM
			updateSelecteSlider(DefaultE);

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

			if (document.getElementById('selectbf').checked === true && layouts[current_layout].layout[isEdit.selectindex].foreground === false) { // SYNC FB
				$("#selectbf").prop("checked", false);
				layouts[current_layout].layout[isEdit.selectindex].foreground = false;
			} else if (document.getElementById('selectbf').checked === false && layouts[current_layout].layout[isEdit.selectindex].foreground === true) {
				$("#selectbf").prop("checked", true);
				layouts[current_layout].layout[isEdit.selectindex].foreground = true;
			}
		}
	}

}

function Cursoring() {
	// DETECT IF CURSOR ON A POINT
	if (isDrawing === false) {
		for (let i = 0; i < index; i++) {
			if (((mouseX > (layouts[current_layout].layout[i].get_p1().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_p1().x) + 10)) && (mouseY > (layouts[current_layout].layout[i].get_p1().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_p1().y) + 10)) {
				Select.state = true;
				Select.p = 1; // P1 
				if ((locked === true) && (Select.state === true) && isEdit.state === false) {
					isEdit.state = true;
					isEdit.selectindex = i;
					isEdit.pnumber = 1;
				}
				break;
			} else if (((mouseX > (layouts[current_layout].layout[i].get_p2().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_p2().x) + 10)) && ((mouseY > (layouts[current_layout].layout[i].get_p2().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_p2().y) + 10))) {
				Select.state = true;
				Select.p = 2 // P2
				if ((locked === true) && (Select.state === true) && isEdit.state === false) {
					isEdit.state = true;
					isEdit.selectindex = i;
					isEdit.pnumber = 2;
				}
				break;
			} else if (((mouseX > (layouts[current_layout].layout[i].get_pc().x) - 10) && (mouseX < (layouts[current_layout].layout[i].get_pc().x) + 10)) && ((mouseY > (layouts[current_layout].layout[i].get_pc().y) - 10) && (mouseY < (layouts[current_layout].layout[i].get_pc().y) + 10))) {
				Select.state = true;
				Select.p = 12 // PCENTER
				if ((locked === true) && (Select.state === true) && isEdit.state === false) {
					isEdit.state = true;
					isEdit.selectindex = i;
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
			savealpha.alpha = layouts[current_layout].layout[isEdit.selectindex].c.a;
			savealpha.state = true;
		}


		if (isEdit.pnumber === 1) { // MOVE P1
			layouts[current_layout].layout[isEdit.selectindex].set_alpha(0.5);
			layouts[current_layout].layout[isEdit.selectindex].set_p1(mspos.x, mspos.y);

		} else if (isEdit.pnumber === 2) { // MOVE P2
			layouts[current_layout].layout[isEdit.selectindex].set_alpha(0.5);
			layouts[current_layout].layout[isEdit.selectindex].set_p2(mspos.x, mspos.y);

		} else if (isEdit.pnumber === 12) { // MOVE P1 AND P2

			if (isEdit.taked === false) { // SAVE THE ORIGINAL POSITION
				isEdit.p1pos = layouts[current_layout].layout[isEdit.selectindex].get_p1();
				isEdit.p2pos = layouts[current_layout].layout[isEdit.selectindex].get_p2();
				isEdit.pcenter = layouts[current_layout].layout[isEdit.selectindex].get_pc();
				isEdit.taked = true;
			} // CALC THE GAP BETWEEN THE MOUSEPOS AND THE ORIGINAL POSITION
			layouts[current_layout].layout[isEdit.selectindex].set_alpha(0.5);
			layouts[current_layout].layout[isEdit.selectindex].set_p1(Math.round(isEdit.p1pos.x - (isEdit.pcenter.x - mspos.x)), Math.round(isEdit.p1pos.y - (isEdit.pcenter.y - mspos.y)));
			layouts[current_layout].layout[isEdit.selectindex].set_p2(Math.round(isEdit.p2pos.x - (isEdit.pcenter.x - mspos.x)), Math.round(isEdit.p2pos.y - (isEdit.pcenter.y - mspos.y)));

		}
		if (locked === false) {
			isEdit.state = false;
			isEdit.taked = false;
			layouts[current_layout].layout[isEdit.selectindex].set_alpha(savealpha.alpha);
			savealpha.state = false;
		}

		// SYNC PARAM
		$('#selectcolor').minicolors('value', rgbToHex(layouts[current_layout].layout[isEdit.selectindex].c.r, layouts[current_layout].layout[isEdit.selectindex].c.g, layouts[current_layout].layout[isEdit.selectindex].c.b).substring(1));
		$('#selectcolor').minicolors('opacity', savealpha.alpha);

		updateSelecteInput(layouts[current_layout].layout[isEdit.selectindex].e);
		updateSelecteSlider(layouts[current_layout].layout[isEdit.selectindex].e);

		if (document.getElementById('selectbf').checked === true && layouts[current_layout].layout[isEdit.selectindex].foreground === false) { // SYNC FB 
			$("#selectbf").prop("checked", false);
			layouts[current_layout].layout[isEdit.selectindex].foreground = false;
		} else if (document.getElementById('selectbf').checked === false && layouts[current_layout].layout[isEdit.selectindex].foreground === true) {
			$("#selectbf").prop("checked", true);
			layouts[current_layout].layout[isEdit.selectindex].foreground = true;
		}
	}
}


function deletejoint() {
	if (isDrawing === false) {

		let indexcompt = isEdit.selectindex;
		while (indexcompt < index) {
			copyjoint(layouts[current_layout].layout[indexcompt], layouts[current_layout].layout[indexcompt + 1]);
			indexcompt++;
		}
		if (index > 0) {
			index--;
		}
		if (index >= 1) {
			isEdit.selectindex = index - 1;
		}

		Select.state = false;
	}
}

function duplicatejoint() {
	if (isDrawing === false) {
		if (index > 0) {
			copyjoint(layouts[current_layout].layout[index], layouts[current_layout].layout[isEdit.selectindex], 40);
			isEdit.selectindex = index;
			index++;
		}

		Select.state = false;

	}
}


function zplus() {
	if (isDrawing === false) {
		if ((isEdit.selectindex >= 0) && (isEdit.selectindex < index - 1)) {
			let save = new Joints();
			copyjoint(save, layouts[current_layout].layout[isEdit.selectindex + 1]);
			copyjoint(layouts[current_layout].layout[isEdit.selectindex + 1], layouts[current_layout].layout[isEdit.selectindex]);
			copyjoint(layouts[current_layout].layout[isEdit.selectindex], save);
			isEdit.selectindex++;
		}

	}
}

function zminus() {
	if (isDrawing === false) {
		if ((isEdit.selectindex > 0) && (isEdit.selectindex < index)) {
			let save = new Joints();
			copyjoint(save, layouts[current_layout].layout[isEdit.selectindex - 1]);
			copyjoint(layouts[current_layout].layout[isEdit.selectindex - 1], layouts[current_layout].layout[isEdit.selectindex]);
			copyjoint(layouts[current_layout].layout[isEdit.selectindex], save);
			isEdit.selectindex--;
		}
	}
}

function copyjoint(ele, ele2, move_x = 0, move_y = 0) {
	ele.set_p1(ele2.x1 + move_x, ele2.y1 + move_y);
	ele.set_p2(ele2.x2 + move_x, ele2.y2 + move_y);
	ele.set_color(ele2.c.r, ele2.c.g, ele2.c.b);
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
	background(106, 116, 149); // 
	displaytfmbg(tfmbg_width, tfmbg_height); // MAP BG
}

function displaytfmbg(width, height, visible = true) {
	if (visible) {
		stroke('#878FAA');
		strokeWeight(5);
		fill(bgcolor);
		rect(window.innerWidth / 2 - 400, window.innerHeight / 2 - height / 2, width, height);
		fill('#878FAA');
		rect(window.innerWidth / 2 - 400, window.innerHeight / 2 - height / 2, width, 20)
		fill('#878FAA');
		rect(window.innerWidth / 2 - 400, window.innerHeight / 2 + height / 2, width, 200)
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


// DOM FUNCTIONS ---------------------------------------------------------------------------------------------------------------------------------


// DEFAULT
function updateDefaulteInput(val) {
	document.getElementById('defaultevalin').value = val;
	DefaultE = val;
}

function updateDefaulteSlider(val) {
	val = Number(val);
	if (!(Number.isInteger(val))) {
		val = 2;
	}
	if (val > 260) {
		val = 260;
	} else if (val < 1) {
		val = 1;
	}
	document.getElementById('defaulteval').value = val;
	DefaultE = val;
}


// SELECT
function updateSelecteInput(val) {
	document.getElementById('selectevalin').value = val;
	layouts[current_layout].layout[isEdit.selectindex].set_e(val);
}

function updateSelecteSlider(val) {
	val = Number(val);
	if (!(Number.isInteger(val))) {
		val = 2;
	}
	if (val > 260) {
		val = 260;
	} else if (val < 1) {
		val = 1;
	}
	document.getElementById('selecteval').value = val;
	layouts[current_layout].layout[isEdit.selectindex].set_e(val);
}

// P1 
function updateP1x(val) {
	layouts[current_layout].layout[isEdit.selectindex].x1 = Number(val) + cardinal.x;
}

function updateP1y(val) {
	layouts[current_layout].layout[isEdit.selectindex].y1 = Number(val) + cardinal.y;
}

function updateP2x(val) {
	layouts[current_layout].layout[isEdit.selectindex].x2 = Number(val) + cardinal.x;
}

function updateP2y(val) {
	layouts[current_layout].layout[isEdit.selectindex].y2 = Number(val) + cardinal.y;
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
	layouts[current_layout].layout[isEdit.selectindex].set_foreground(state);
}


// XML FUNCTIONS -----------------------------------------------------------------------------------------------------------------------------------
// <C><P /><Z><S /><D /><O /><L><JD P1="245,184"P2="479,82"c="ffffff,2,1,0"/></L></Z></C>
// layouts[current_layout].layout
function savexml() {
	let XML = "";
	XML += '<C><P /><Z><S /><D /><O /><L>';

	for (c = 0; c < layouts.length; c++) {
		for (i = 0; i < index; i++) {
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
	let XML = document.getElementById('load-xml').value;
	let JD;
	if (XML.startsWith('<C><P')) {

		/* 
		for (i = 0; i <= index;i++){ // CLEAR THE CURRENT ARRAY
		    joints[i] = new Joints();
		} 
		index = 0; */ // GONNA ADD A CLEAR FUNCTION


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

				layouts[current_layout].layout[i+index].set_p1(pt1.x + cardinal.x, pt1.y + cardinal.y);
				layouts[current_layout].layout[i+index].set_p2(pt2.x + cardinal.x, pt2.y + cardinal.y);
				layouts[current_layout].layout[i+index].set_color(ptcolor.r, ptcolor.g, ptcolor.b);
				layouts[current_layout].layout[i+index].set_e(ptparam.e);
				layouts[current_layout].layout[i+index].set_alpha(ptparam.a);
				layouts[current_layout].layout[i+index].set_foreground(ptparam.foreground);

			} // END IF

		} // END FOR

		index = XML.length+index;
		isEdit.selectindex = XML.length+index;


		// DISPLAY EXCEPT POINTS
		DisplayJoints(false);

	} // END IF STARTSWITH
	else {
		alert("You can't load a wrong XML");
	}


}

function clearAll(){
    if (confirm("Are you sure to delete all ?")){
        index = 0;

        for (let c = 0; c < layouts.length; c++){
            for (let i = 0; i < layouts[c].length; i++){
                layouts[c].layout[i] = new Joints();
            }

            while (layouts.lenght > 1){
                layouts.pop();
            }
        } 
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


}

class Layouts {
	constructor() {
		this.layout = [];
		this.type;
		this.name;

	}

	create_layout(type = "jts") {
		for (let i = 0; i < 2000; i++) { // CREATE 2000 POSSIBLE LINE, MIGHT CHANGE THIS
			this.layout.push(new Joints());
		}
		this.type = type
		this.name = type + String(current_layout);
	}

	set_layout(array) {
		this.layout = array;
	}

	set_type(type) {
		this.type = type;
	}

	set_name(name) {
		this.name = name;
	}

}