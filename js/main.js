'use strict'
import { generateField } from './genField.js';
import { startPvP } from './gameModes/PvP.js'
import { startPvEasyBot } from './gameModes/PvEasyBot.js';
const field1 = document.getElementById('field1');
const field2 = document.getElementById('field2');

startGame();



document.getElementById('newGame').addEventListener('click', startGame);

function startGame() {
	let myField = generateField();
	let enemyField = generateField();
	
	for (let field of [[myField, field1, 1], [enemyField, field2, 2]]) {
		field[1].innerHTML = '';

		// Создаем таблицу в DOM
		for (let i = 0; i < field[0].fieldSize.x; i++) {
			let row = document.createElement('div');
			row.classList.add('row');
			field[1].appendChild(row);
			for (let j = 0; j < field[0].fieldSize.y; j++) {
				let cell = document.createElement('div');
				cell.classList.add('cell');
				cell.id = `f${field[2]}x${i}y${j}`;
				row.appendChild(cell);
			}
		}

		// Заполнение игрового поля
		if (field[0] === myField) {
			for (let cell of field[0].cells) {
				document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`${cell.status}`);
			}
		} else {
			for (let cell of field[0].cells) {
				document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`void`);
			}
		}
			
		
	
	}

	// startPvP(myField, field1, enemyField, field2);
	startPvEasyBot(myField, 'field1', enemyField, 'field2');

	
	
	
}
