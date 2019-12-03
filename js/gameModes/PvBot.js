'use strict'
import { PlayerShot } from '../playerShot.js';
import { BotShot } from '../botShot.js';
import { statisticAdd } from '../statistic.js';

export class PvBot extends PlayerShot {
    constructor(myFieldObject, myFieldId, enemyFieldObject, enemyFieldId) {
        super();

        this.myFieldObject = myFieldObject;
        this.myFieldId = myFieldId;
        this.enemyFieldObject = enemyFieldObject;
        this.enemyFieldId = enemyFieldId;
    }

    start() {
        const enemyField = document.getElementById(this.enemyFieldId);
        const status = document.getElementById('status');

        // Добавление события на нажатие по ячейке
        for ( let elem of enemyField.getElementsByClassName('field-cell') ) {
            elem.addEventListener('click', myShot);
        }

        let enemyFieldObject = this.enemyFieldObject;
        
        status.innerText = 'Ваш ход..';

        function myShot(event) {
            let sp = new PlayerShot(event.target.id, enemyFieldObject);
            let answer = sp.shot();
    
            if (answer) {
                // удаляем события первого поля
                for ( let elem of enemyField.getElementsByClassName('field-cell') ) {
                    elem.removeEventListener('click', myShot);
                }
    
                if (answer != 'win') {
                    status.innerText = 'Ход компьютера..';
                    setTimeout(() => {
                        enemyShot();
                    }, 1000);
                    
                } else {
                    status.innerText = 'Вы победили!';
                    statisticAdd({mode: 'Игрок / Комп.', winner: 'Игрок'});
                }
            }
    
        }

        let myFieldObject = this.myFieldObject;
        let myFieldId = this.myFieldId;
    
        function enemyShot(prevShot) {
    
            let answer;
            
            if (prevShot === undefined) {
                let bot = new BotShot(myFieldId, myFieldObject);
                answer = bot.shot();
            } else {
                let bot = new BotShot(myFieldId, myFieldObject, prevShot);
                answer = bot.shot();
            }
        
    
            if (answer.status === 'next') {
                // добавляем события первого поля
                for ( let elem of enemyField.getElementsByClassName('field-cell') ) {
                    elem.addEventListener('click', myShot);
                }
    
                status.innerText = 'Ваш ход..';
            } else if (answer.status === 'again') {
                setTimeout(() => {
                    enemyShot(answer);
                }, 1000);
            } else if (answer.status === 'win') {
                status.innerText = 'Компьютер победил!';
                statisticAdd({mode: 'Игрок / Комп.', winner: 'Комп.'});
            }
        }
    }
}