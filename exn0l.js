/* 
	Tehnyt: Ville Kauranen 0371363 2018-9-30
*/
var r0 = [0,0,0], r1 = [0,0,0], r2 = [0,0,0];
var board = [r0, r1, r2];
var turn = 1; // pelaajan vuoro, 0 = ei kukaan, 1 = X, 2 = 0

// Jatkoa ristinolla.js:stä ...

/*
	funktio joka tarkastaa pelin lopputuleman
	jotta funktio palauttaa järkevää oletetaan että:
		Peli on aina pelattu LAILLISESTI loppuun eli suoria voi olla vain yksi
		tyhjät pelilaudan solut eivät voi muodostaa suoraa
	palauttaa
	1 = jos pelaaja X voitti (sai suoran)
	2 = jos pelaaja 0 voitti (sai suoran)
	0 = jos tasapeli
*/
function getWinner(game){
	var test, i, result;
	result = 0;
	test = new Array;
	/* 
		otetaan testattava peli sisään muodostetaan kiinnostavat testirivit (suorat)
		ja katsotaan onko kummallekkaan pelaajalle suoraa, jos on looppi
		keskeytetään ja funktio palauttaa voittajaa osoittavan numeron
		0 = ei voittoa (ei suoraa)
	*/
	test[0] = [game[0][0],game[1][1],game[2][2]]; // poikittaisrivi 1
	test[1] = [game[0][2],game[1][1],game[2][0]]; // poikittaisrivi 2
	test[2] = game[0]; // vaakarivi 1
	test[3] = game[1]; // vaakarivi 2
	test[4] = game[2]; // vaakarivi 3
	test[5] = [game[0][0],game[1][0],game[2][0]]; // pystyrivi 1
	test[6] = [game[0][1],game[1][1],game[2][1]]; // pystyrivi 2
	test[7] = [game[0][2],game[1][2],game[2][2]]; // pystyrivi 3
	
	result = 0; // oletusarvo mikäli suoraa ei löydy
	// eli siis mikäli pelilauta on täytetty laillisesti pitäisi tällä ratketa voittaja
	for (i = 0; i < test.length; i++) { 
		if (test[i].every(onRisti)){ result = 1; }
		if (test[i].every(onNolla)){ result = 2; }
	}
	return result;
}


function getWinningLine(game,winner){
	var test, i, line;
	line = new Array;
	test = new Array;
	/* 
		vähän samalla tapaa kuin getWinner- mutta palautetaan
		voittavan rivin solujen tiedot
	*/
	test[0] = [game[0][0],game[1][1],game[2][2]]; // poikittaisrivi 1
	test[1] = [game[0][2],game[1][1],game[2][0]]; // poikittaisrivi 2
	test[2] = game[0]; // vaakarivi 1
	test[3] = game[1]; // vaakarivi 2
	test[4] = game[2]; // vaakarivi 3
	test[5] = [game[0][0],game[1][0],game[2][0]]; // pystyrivi 1
	test[6] = [game[0][1],game[1][1],game[2][1]]; // pystyrivi 2
	test[7] = [game[0][2],game[1][2],game[2][2]]; // pystyrivi 3
	
	// erittäin köppäinen toteutus, mutta olkoon nyt tän kerran
	var tFun;
	if (winner === 1){ tFun = onRisti; }
	if (winner === 2){ tFun = onNolla; }
	
	if (test[0].every(tFun)){ line = [0,4,8]; }
	if (test[1].every(tFun)){ line = [2,4,6]; }
	if (test[2].every(tFun)){ line = [0,1,2]; }
	if (test[3].every(tFun)){ line = [3,4,5]; }
	if (test[4].every(tFun)){ line = [6,7,8]; }
	if (test[5].every(tFun)){ line = [0,3,6]; }
	if (test[6].every(tFun)){ line = [1,4,7]; }
	if (test[7].every(tFun)){ line = [2,5,8]; }
	
	return line;
}
// Tarkistaa onko elementti pelaajan X-merkki eli 1
function onRisti(a){
	if (a === 1){
		return true;
	}
	else {
		return false;
	}
}
// Tarkistaa onko elementti pelaajan 0-merkki eli 2
function onNolla(a){
	if (a === 2){
		return true;
	}
	else {
		return false;
	}
}
function refreshInfo(player, end){
	var infoContent, pStr, col;
	col = '#eee' // default
	if (player === 1){
		pStr = '<span class="bold red">X</span>';
	}
	if (player === 2){
		pStr = '<span class="bold blue">0</span>';
	}
	
	if (end){
		if (player == 0){
			infoContent = 'Tasapeli!';
		}
		else {
			infoContent = 'Pelaaja '+pStr+' voitti!';
			col = '#ffff66';
		}
	}
	else {
		infoContent = 'Pelaajan '+pStr+' vuoro!';
	}
	
	document.getElementById('info_container').innerHTML = infoContent;
	document.getElementById('info_area').style.backgroundColor = col;
}

function play(x,y){
	if (turn != 0){ // ei tehdä mitään, jollei jompikumpi pelaaja ole vuorossa
		// tarkistetaan onko ruutu vapaa ja pelataan vain jos näin on
		if (board[x][y]===0){
			board[x][y] = turn; // vuorossa olevan pelaajan merkintä pelattuun ruutuun
			refreshBoard(); // päivitetään lauta
			
			// tarkistetaan selviääkö voittaja tällä siirrolla
			var winner;
			winner = getWinner(board); // palauttaa arvon 0 mikäli ei ole voittoa
			
			// jos winner = 0 ja kaikki laudan ruudut on pelattu tulee julistaa tasapeli
			if (winner === 0){
				var i,j,s,end;
				i = 0; j = 0; end = true;
				for (s = 0; s < 9; s++){
					if (board[j][i]===0){
						// yksikin tyhjä ruuttu tarkoittaa sitä, että peli on kesken
						end = false;
						break;
					}
					i++;
					if (i > 2){
						i = 0;
						j++;
					}
				}
				if (end){
					turn = 0; // jotta ei voida pelata ennen pelin resetoimista
				}
				else {
					advanceTurn();
				}
				refreshInfo(turn,end);	
			}
			else {
				// voittajaksi julistetaan vuoron pelannut pelaaja
				refreshInfo(turn,true);
				paintBoard(false,turn);
				turn = 0; // jotta ei voida pelata ennen pelin resetoimista
			}
		}
	}
}

function advanceTurn(){
	switch (turn){
		case 1: turn = 2; break;
		case 2: turn = 1; break;
	}
}

function resetGame(){
	// Resetoidaan pelilauta
	board[0] = [0,0,0];
	board[1] = [0,0,0];
	board[2] = [0,0,0];
	
	refreshBoard(); // Päivitetään lauta
	// nollataan väritelmät
	paintBoard(true,0);
	
	// Päivitetään info ja resetoidaan vuoro X:lle
	turn = 1;
	refreshInfo(turn,false);
}

function paintBoard(reset,winner){
	var i,j,s;
	i = 0; j = 0;
	if (reset){
		for (s = 0; s < 9; s++){
			document.getElementById('g'+j+i).style.backgroundColor = "transparent";
			i++;
			if (i > 2){
				i = 0;
				j++;
			}
		}
	}
	else {
		var line, check, m;
		m = 0; // line arrayn indeksi jota iteroidaan värittäessä
		line = getWinningLine(board,winner);
		console.log(line); // checkausta varten
		check = line[m]; 
		
		var col;
		/*
		switch (winner){
			case 1: col = 'red'; break;
			case 2: col = 'blue'; break;
		}*/
		col = '#ffff66';
		
		for (s = 0; s < 9; s++){
			if (s === check){
				if (m === 3){
					break;
				}
				else {
					document.getElementById('g'+j+i).style.backgroundColor = col;
					m++;
					check = line[m]
				}
			}
			i++;
			if (i > 2){
				i = 0;
				j++;
			}
		}
	}
}

function refreshBoard(){
	var i, j, s;
	j = 0;
	i = 0;
	for (s = 0; s < 9; s++) { 
		switch (board[j][i]){
			case 0: 
				document.getElementById('g'+j+i).innerHTML = "";
				console.log('- : kohdassa -'+j+i);
			break;
			case 1:
				document.getElementById('g'+j+i).innerHTML = '<span class="marker red">X</span>';
				console.log('X : kohdassa -'+j+i);
			break;
			case 2:
				document.getElementById('g'+j+i).innerHTML = '<span class="marker blue">0</span>';
				console.log('0 : kohdassa -'+j+i);
			break;
		}
		i++; // rivin vaihtoa varten
		if (i > 2){
			i = 0;
			j++;
		}
	}
}
