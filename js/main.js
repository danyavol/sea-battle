'use strict'
import { generateField } from './genField.js';
import { shot } from './shot.js';
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
		for (let cell of field[0].cells) {
			document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`${cell.status}`);
			//document.getElementById(`f${field[2]}x${cell.x}y${cell.y}`).classList.add(`void`);
		}
	
	}

	// Добавление события на нажатие по ячейке
	for ( let elem of field1.getElementsByClassName('cell') ) {
		elem.addEventListener('click', myShot);
	}

	

	function myShot(event) {

		let answer = shot(event.target.id, myField);

		if (answer) {
			// удаляем события первого поля
			for ( let elem of field1.getElementsByClassName('cell') ) {
				elem.removeEventListener('click', myShot);
			}

			document.getElementById('status').innerText = '';

			if (answer != 'win') {
				// и добавляем события другого поля
				for ( let elem of field2.getElementsByClassName('cell') ) {
					elem.addEventListener('click', enemyShot);
				}

				document.getElementById('status').innerText = 'Ход игрока справа..';
			} else {
				alert ('Победил игрок слева!');
			}
		}

	}

	function enemyShot(event) {

		let answer = shot(event.target.id, enemyField);


		if (answer) {
			// удаляем события первого поля
			for ( let elem of field2.getElementsByClassName('cell') ) {
				elem.removeEventListener('click', enemyShot);
			}

			document.getElementById('status').innerText = '';

			if (answer != 'win') {
				// и добавляем события другого поля
				for ( let elem of field1.getElementsByClassName('cell') ) {
					elem.addEventListener('click', myShot);
				}

				document.getElementById('status').innerText = 'Ход игрока слева..';
			} else {
				alert ('Победил игрок cправа!');
			}
		}
	}
	
	
}
