'use strict'
import { Field } from './genField.js';
import { PvP } from './gameModes/PvP.js'
import { PvBot } from './gameModes/PvBot.js';
import { statisticUpdate } from './statistic.js';

const field1 = document.getElementById('field1');
const field2 = document.getElementById('field2');



document.getElementById('pvp').addEventListener('click', startGame);
document.getElementById('pve').addEventListener('click', startGame);
document.getElementById('stats').addEventListener('click', showStats);
document.querySelectorAll('.goto-menu').forEach(item => item.addEventListener('click', gotoMenu));

function gotoMenu() {
	document.getElementById('statistic').style = 'display: none;';
	document.getElementById('game').style = 'display: none;';
	document.getElementById('mainMenu').style = 'display: block;';

	field1.innerHTML = '';
	field2.innerHTML = '';
}

function showStats() {
	document.getElementById('statistic').style = 'display: block;';
	document.getElementById('game').style = 'display: none;';
	document.getElementById('mainMenu').style = 'display: none;';
	statisticUpdate();
}

function startGame(event) {
	let mf = new Field();
	const myField = mf.generateField();
	let ef = new Field();
	const enemyField = ef.generateField();

	document.getElementById('mainMenu').style = 'display: none;';
	document.getElementById('statistic').style = 'display: none;';
	document.getElementById('game').style = 'display: block;';
	
	for (let field of [[myField, field1, 1], [enemyField, field2, 2]]) {
		field[1].innerHTML = '';

		// Создаем таблицу в DOM
		for (let i = 0; i < field[0].fieldSize.x; i++) {
			let row = document.createElement('div');
			row.classList.add('field-row');
			field[1].appendChild(row);
			for (let j = 0; j < field[0].fieldSize.y; j++) {
				let cell = document.createElement('div');
				cell.classList.add('field-cell');
				cell.id = `f${field[2]}x${i}y${j}`;
				row.appendChild(cell);
			}
		}

		// Заполнение игрового поля
		if (event.target.id === 'pve') {
			// Режим игры PvE
			if (field[0] === myField) {
				for (let cell of field[0].cells) {
					document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`${cell.status}`);
				}
			} else {
				for (let cell of field[0].cells) {
					document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`void`);
				}
			}
		} else if ( event.target.id === 'pvp') {
			// Режим игры PvP
			for (let cell of field[0].cells) {
				document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`void`);
			}
		}
	
	}

	if (event.target.id === 'pve') {
		let sp = new PvBot(myField, 'field1', enemyField, 'field2');
		sp.start();
	} else if ( event.target.id === 'pvp') {
		let sp = new PvP(myField, field1, enemyField, field2);
		sp.start();
	}
	
}
