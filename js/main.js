'use strict'
import { generateField } from './genField.js';
import { shot } from './shot.js';

const field = document.getElementById('field');


let myField = generateField();
console.log(myField);
let enemyField = generateField();

// Создаем таблицу в DOM
for (let i = 0; i < 10; i++) {
	let row = document.createElement('div');
	row.classList.add('row');
	field.appendChild(row);
	for (let j = 0; j < 10; j++) {
		let cell = document.createElement('div');
		cell.classList.add('cell');
		cell.id = `f1x${i}y${j}`;
		row.appendChild(cell);
	}
}

// Заполнение игрового поля
for (let cell of myField) {
	document.getElementById(`f1x${cell.x}y${cell.y}`).classList.add(`${cell.status}`);
}

for ( let elem of field.getElementsByClassName('cell') ) {
	elem.addEventListener('click', (event) => {
		shot(event.target.id, myField);
	});
}
