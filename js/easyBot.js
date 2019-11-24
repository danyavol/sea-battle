'use strict'

import { getCell, randomCell } from './field.functions.js';

export function easyBot(fieldId, fieldObject, answer) {
    // return: { status: 'next'/'again'/'win', prevShot: {x: 0, y: 1} }
    //      'next' - если ход переходит игроку
    //      'again' - если бот стреляет еще раз
    //      'win' - если бот уничтожил все корабли

    const fId = fieldId.match(/\d/g).join('');

    if (answer != undefined && answer.prevShot != undefined) {
        // добиваем корабль

    }

    let coords = randomCell(fieldObject.fieldSize.x, fieldObject.fieldSize.y); // координаты ячейке, по которой стреляем
    let pressedCell = getCell(coords, fieldObject); // ссылка на эту ячейку

    // проверка на то, стреляли ли по этой ячейке уже
    if (pressedCell.shot) {
        return easyBot(fieldId, fieldObject, answer);
    }
    pressedCell.shot = true;

    // если выстрел был в пустоту
    if (pressedCell.status === "void") {
        document.getElementById(`f${fId}x${coords.x}y${coords.y}`).classList.add('miss');
        return {status: 'next'};
    }

    // если выстрел был по кораблю
    if (pressedCell.status === "ship") {
        document.getElementById(`f${fId}x${coords.x}y${coords.y}`).classList.add('hit');

        // проверяем затонул весь корабль или нет
        let isShipSank = true;
        for (let elem of pressedCell.shipParts) {
            let cell = getCell([elem.x, elem.y], fieldObject);
            !cell.shot ? isShipSank = false : null;
        }

        // если все части корабля подбиты
        if (isShipSank) {
            for (let partCoords of pressedCell.shipParts) {
                // установка всем клеткам корабля стиля 'died'
                let elem = document.getElementById(`f${fId}x${partCoords.x}y${partCoords.y}`);
                elem.classList.add('died');
                elem.classList.remove('hit');
                let part = getCell(partCoords, fieldObject)

                // установка клеткам вокруг стиля 'miss'
                for (let cell of part.cellsAroundShip) {
                    document.getElementById(`f${fId}x${cell.x}y${cell.y}`).classList.add('miss');
                    getCell(cell, fieldObject).shot = true;
                }
                
            }

            // Проверка на то, подбиты ли все корабли на поле
            let endOfGame = true;
            for (let ship of fieldObject.cells) {
                if (ship.status === "ship") {
                    if (!ship.shot) {
                        endOfGame = false;
                        break;
                    }
                }
            }

            // Если игра окончена
            if (endOfGame) {
                return {status: 'win'};
            } else {
                // корабль утонул, стреляет еще раз
                return {status: 'again'};
            }

        }
            // корабль подбит, стреляет еще раз
            return {status: 'again', prevShot: coords};       
    }
    
}