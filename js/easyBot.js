'use strict'

import { getCell, randomCell, mixUpValues, expandCell, getOppositeDir, shotThatCell } from './field.functions.js';

export function easyBot(fieldId, fieldObject, answer) {
    // return: { status: 'next'/'again'/'win', prevShot: {x: 0, y: 1} }
    //      'next' - если ход переходит игроку
    //      'again' - если бот стреляет еще раз
    //      'win' - если бот уничтожил все корабли

    const fId = fieldId.match(/\d/g).join('');

    if (answer != undefined && answer.prevShot != undefined) {
        // добиваем корабль
        let directions = mixUpValues();
        let cellsAround = [];
        for (let dir of directions) {
            let cell = getCell(expandCell(answer.prevShot, dir), fieldObject);
            // если такая ячейка существует
            if (cell) {
                // продолжаем добивать корабль, если уже известно направление корабля
                if (cell.status === 'ship' && cell.shot === true) {
                    let cellToShot = getCell( expandCell(answer.prevShot, getOppositeDir(dir)), fieldObject );
                    if (cellToShot && cellToShot.shot === false) {
                        // стреляем, если такая ячейка существует и по ней не стреляли
                        let result = shotThatCell(cellToShot, fieldObject, fId);
                        return handleTheResult(result, cellToShot);    
                    } else if (cellToShot) {
                        // ищем ячейку корабля с другой стороны
                        let cellToShot = answer.prevShot;
                        do {
                            cellToShot = getCell( expandCell(cellToShot, dir), fieldObject );
                            if (cellToShot && cellToShot.shot === false) {
                                // ячейка найдена, стреляем по ней
                                let result = shotThatCell(cellToShot, fieldObject, fId);
                                return handleTheResult(result, cellToShot);
                            } 

                        } while(true)
                    }
                } else if (cell.shot === false) {
                    cellsAround.push(cell);
                }
            }
        }

        let result = shotThatCell(cellsAround[0], fieldObject, fId);
        return handleTheResult(result, cellsAround[0]);

    }

    let coords = randomCell(fieldObject.fieldSize.x, fieldObject.fieldSize.y); // координаты ячейки, по которой стреляем
    let cellToShot = getCell(coords, fieldObject); // ссылка на эту ячейку

    // проверка на то, стреляли ли по этой ячейке уже
    if (cellToShot.shot) {
        return easyBot(fieldId, fieldObject, answer);
    }

    // стреляем
    let result = shotThatCell(cellToShot, fieldObject, fId);
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