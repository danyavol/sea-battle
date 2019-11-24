'use strict'
import { shot } from '../shot.js';

export function startPvP(myField, field1, enemyField, field2) {

    // Добавление события на нажатие по ячейке
	for ( let elem of field1.getElementsByClassName('cell') ) {
		elem.addEventListener('click', myShot);
    }
    
    document.getElementById('status').innerText = 'Ход игрока слева..';
	

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