'use strict'
import { PlayerShot } from '../playerShot.js';
import { statisticAdd } from '../statistic.js';

export class PvP extends PlayerShot {
	constructor(myField, field1, enemyField, field2) {
		super();
		this.myField = myField;
		this.field1 = field1;
		this.enemyField = enemyField;
		this.field2 = field2;
	}

	start() {
		// Добавление события на нажатие по ячейке
		for ( let elem of this.field1.getElementsByClassName('field-cell') ) {
			elem.addEventListener('click', myShot);
		}
		
		const status = document.getElementById('status');
		status.innerText = 'Ход игрока 1..';

		let myField = this.myField;
		let field1 = this.field1;
		let enemyField = this.enemyField;
		let field2 = this.field2;



		function myShot(event) {
			let obj = new PlayerShot(event.target.id, myField);
			let answer = obj.shot();
	
	
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
			let obj = new PlayerShot(event.target.id, enemyField);
			let answer = obj.shot();
	
	
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

	
}

