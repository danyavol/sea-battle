'use strict'

export function shot(_id, _field) {
    let coords = _id.match(/x\d{1,}|y\d{1,}/g);
    coords = coords.map(item => +item.slice(1)); // координаты нажатой ячейки

    let fieldId = _id.match(/f\d{1,}/)[0];
    fieldId = +fieldId.slice(1); // id поля

    let pressedCell = getCell(coords, _field);

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
            let cell = getCell([elem.x, elem.y], _field);
            !cell.shot ? isShipSank = false : null;
        }

        // если все части корабля подбиты
        if (isShipSank) {
            for (let partCoords of pressedCell.shipParts) {
                // установка всем клеткам корабля стиля 'died'
                let elem = document.getElementById(`f${fieldId}x${partCoords.x}y${partCoords.y}`);
                elem.classList.add('died');
                elem.classList.remove('hit');
                let part = getCell(partCoords, _field)

                // установка клеткам вокруг стиля 'miss'
                for (let cell of part.cellsAroundShip) {
                    document.getElementById(`f${fieldId}x${cell.x}y${cell.y}`).classList.add('miss');
                    getCell(cell, _field).shot = true;
                }
                
            }

            // Проверка на то, подбиты ли все корабли на поле
            let endOfGame = true;
            for (let ship of _field) {
                if (ship.status === "ship") {
                    if (!ship.shot) {
                        endOfGame = false;
                        break;
                    }
                }
            }

            // Если игра окончена
            if (endOfGame) {
                alert('Победа!!!');
            }

        }

        return true;
    }
    

    function getCell(coords, field) {
        // получение ссылки на ячейку с указанными координатами
        let cell;
        if (Array.isArray(coords)) {
            cell = field.filter((item) => {
                return item.x == coords[0] && item.y == coords[1];
            });
        } else {
            cell = field.filter((item) => {
                return item.x == coords.x && item.y == coords.y;
            });
        }

        // возвращаем ссылку на ячейку, либо false, если совпадений не найдено
        if (cell.length != 0) {
            return cell[0];
        } else {
            return false;
        }
    }
}