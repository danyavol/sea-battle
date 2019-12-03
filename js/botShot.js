'use strict'

import { BasicFuncs } from './basicFuncs.js';

export class BotShot extends BasicFuncs {
    constructor (fieldId, fieldObject, answer) {
        super();
        this.fieldId = fieldId;
        this.fieldObject = fieldObject;
        this.answer = answer;
    }

    shot() {
        // return: { status: 'next'/'again'/'win', prevShot: {x: 0, y: 1} }
        //      'next' - если ход переходит игроку
        //      'again' - если бот стреляет еще раз
        //      'win' - если бот уничтожил все корабли

        const fId = this.fieldId.match(/\d/g).join('');

        if (this.answer != undefined && this.answer.prevShot != undefined) {
            // добиваем корабль
            let directions = super.mixUpValues();
            let cellsAround = [];
            for (let dir of directions) {
                let cell = super.getCell(super.expandCell(this.answer.prevShot, dir), this.fieldObject);
                // если такая ячейка существует
                if (cell) {
                    // продолжаем добивать корабль, если уже известно направление корабля
                    if (cell.status === 'ship' && cell.shot === true) {
                        let cellToShot = super.getCell( super.expandCell(this.answer.prevShot, super.getOppositeDir(dir)), this.fieldObject );
                        if (cellToShot && cellToShot.shot === false) {
                            // стреляем, если такая ячейка существует и по ней не стреляли
                            let result = super.shotThatCell(cellToShot, this.fieldObject, fId);
                            return handleTheResult(result, cellToShot);    
                        } else if (cellToShot) {
                            // ищем ячейку корабля с другой стороны
                            let cellToShot = this.answer.prevShot;
                            do {
                                cellToShot = super.getCell( super.expandCell(cellToShot, dir), this.fieldObject );
                                if (cellToShot && cellToShot.shot === false) {
                                    // ячейка найдена, стреляем по ней
                                    let result = super.shotThatCell(cellToShot, this.fieldObject, fId);
                                    return handleTheResult(result, cellToShot);
                                } 

                            } while(true)
                        }
                    } else if (cell.shot === false) {
                        cellsAround.push(cell);
                    }
                }
            }

            let result = super.shotThatCell(cellsAround[0], this.fieldObject, fId);
            return handleTheResult(result, cellsAround[0]);

        }

        let coords = super.randomCell(this.fieldObject.fieldSize.x, this.fieldObject.fieldSize.y); // координаты ячейки, по которой стреляем
        let cellToShot = super.getCell(coords, this.fieldObject); // ссылка на эту ячейку

        // проверка на то, стреляли ли по этой ячейке уже
        if (cellToShot.shot) {
            return this.shot();
            //easyBot(this.fieldId, this.fieldObject, this.answer);
        }

        // стреляем
        let result = super.shotThatCell(cellToShot, this.fieldObject, fId);
        return handleTheResult(result, cellToShot);

        function handleTheResult(result, shotCellObject) {
            // обработка результата выстрела
            if (result === 'hit') {
                return {status: 'again', prevShot: {x: shotCellObject.x, y: shotCellObject.y}};  
            } else if (result === 'sank') {
                return {status: 'again'};
            } else if (result === 'void') {
                return {status: 'next'}
            } else if (result === 'win') {
                return {status: 'win'};
            } else {
                console.log('Error');
                return;        
            }
        }
        
    }
}

