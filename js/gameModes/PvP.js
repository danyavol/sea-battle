'use strict'
import { shot } from '../shot.js';
import { statisticAdd } from '../statistic.js';

export function startPvP(myField, field1, enemyField, field2) {

    // Добавление события на нажатие по ячейке
	for ( let elem of field1.getElementsByClassName('field-cell') ) {
		elem.addEventListener('click', myShot);
    }
	
	const status = document.getElementById('status');
    status.innerText = 'Ход игрока 1..';
	

	function myShot(event) {

		let answer = shot(event.target.id, myField);

		if (answer) {
			// удаляем события первого поля
			for ( let elem of field1.getElementsByClassName('field-cell') ) {
				elem.removeEventListener('click', myShot);
			}

			status.innerText = '';

			if (answer != 'win') {
				// и добавляем события другого поля
				for ( let elem of field2.getElementsByClassName('field-cell') ) {
					elem.addEventListener('click', enemyShot);
				}

				status.innerText = 'Ход игрока 2..';
			} else {
				status.innerText = 'Победил игрок 1!';
				statisticAdd({ mode: 'Игрок / Игрок', winner: 'Игрок 1'});
			}
		}

	}

	function enemyShot(event) {

		let answer = shot(event.target.id, enemyField);


		if (answer) {
			// удаляем события первого поля
			for ( let elem of field2.getElementsByClassName('field-cell') ) {
				elem.removeEventListener('click', enemyShot);
			}

			status.innerText = '';

			if (answer != 'win') {
				// и добавляем события другого поля
				for ( let elem of field1.getElementsByClassName('field-cell') ) {
					elem.addEventListener('click', myShot);
				}

				status.innerText = 'Ход игрока 1..';
			} else {
				status.innerText = 'Победил игрок 2!';
				statisticAdd({ mode: 'Игрок / Игрок', winner: 'Игрок 2'});
			}
		}
	}

}