'use strict'
import { BasicFuncs } from './basicFuncs.js';

export class PlayerShot extends BasicFuncs {
    constructor (id, field) {
        super();
        this.id = id;
        this.field = field;
    }

    shot() {
        // return:
        //      true - если ход переходит другому игроку
        //      "win" - если игрок уничтожил все корабли
        //      false - если этот игрок продолжает стрелять


        let coords = this.id.match(/x\d{1,}|y\d{1,}/g);
        coords = coords.map(item => +item.slice(1)); // координаты нажатой ячейки

        let fieldId = this.id.match(/f\d{1,}/)[0];
        fieldId = +fieldId.slice(1); // id поля

        let pressedCell = super.getCell(coords, this.field);

        // проверка на то, нажималась ли эта ячейка уже
        if (pressedCell.shot) {
            return false;
        }
        pressedCell.shot = true;

        // если выстрел был в пустоту
        if (pressedCell.status === "void") {
            document.getElementById(`f${fieldId}x${coords[0]}y${coords[1]}`).classList.add('miss');
            return true;
        }

        // если выстрел был по кораблю
        if (pressedCell.status === "ship") {
            document.getElementById(`f${fieldId}x${coords[0]}y${coords[1]}`).classList.add('hit');

            // проверяем затонул весь корабль или нет
            let isShipSank = true;
            for (let elem of pressedCell.shipParts) {
                let cell = super.getCell([elem.x, elem.y], this.field);
                !cell.shot ? isShipSank = false : null;
            }

            // если все части корабля подбиты
            if (isShipSank) {
                for (let partCoords of pressedCell.shipParts) {
                    // установка всем клеткам корабля стиля 'died'
                    let elem = document.getElementById(`f${fieldId}x${partCoords.x}y${partCoords.y}`);
                    elem.classList.add('died');
                    elem.classList.remove('hit');
                    let part = super.getCell(partCoords, this.field)

                    // установка клеткам вокруг стиля 'miss'
                    for (let cell of part.cellsAroundShip) {
                        document.getElementById(`f${fieldId}x${cell.x}y${cell.y}`).classList.add('miss');
                        super.getCell(cell, this.field).shot = true;
                    }
                    
                }

                // Проверка на то, подбиты ли все корабли на поле
                let endOfGame = true;
                for (let ship of this.field.cells) {
                    if (ship.status === "ship") {
                        if (!ship.shot) {
                            endOfGame = false;
                            break;
                        }
                    }
                }

                // Если игра окончена
                if (endOfGame) {
                    return 'win';
                }

            }

            return false;
        }
    }
}

