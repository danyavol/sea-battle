'use strict'
import { shot } from '../shot.js';
import { easyBot } from '../easyBot.js';

export function startPvEasyBot(myFieldObject, myFieldId, enemyFieldObject, enemyFieldId) {

    const myField = document.getElementById(myFieldId);
    const enemyField = document.getElementById(enemyFieldId);
    const status = document.getElementById('status');

    // Добавление события на нажатие по ячейке
	for ( let elem of enemyField.getElementsByClassName('cell') ) {
		elem.addEventListener('click', myShot);
    }
    
    status.innerText = 'Ваш ход..';
	

	function myShot(event) {

		let answer = shot(event.target.id, enemyFieldObject);

		if (answer) {
			// удаляем события первого поля
			for ( let elem of enemyField.getElementsByClassName('cell') ) {
				elem.removeEventListener('click', myShot);
			}

			if (answer != 'win') {
                status.innerText = 'Ход компьютера..';
                setTimeout(() => {
                    enemyShot();
                }, 1200);
				
			} else {
				status.innerText = 'Вы победили!';
			}
		}

	}

	function enemyShot(prevShot) {

        let answer;
        if (prevShot === undefined) {
            answer = easyBot(myFieldId, myFieldObject);
        } else {
            answer = easyBot(myFieldId, myFieldObject, prevShot);
        }
    

        if (answer.status === 'next') {
            // добавляем события первого поля
            for ( let elem of enemyField.getElementsByClassName('cell') ) {
                elem.addEventListener('click', myShot);
            }

            status.innerText = 'Ваш ход..';
        } else if (answer.status === 'again') {
            setTimeout(() => {
                enemyShot(answer);
            }, 1800);
        } else if (answer.status === 'win') {
            status.innerText = 'Компьютер победил!';
        }
	}

}