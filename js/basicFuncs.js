'use strict'

export class BasicFuncs {
    constructor() {

    }
    
    expandCell(coords, direction) {
        // принмает координаты ячейки и направление
        // возвращает координаты следующей ячейки в указанном направлении

        let newCoords;				
        if (Array.isArray(coords)) {
            // если входные координаты в виде массива
            switch (direction) {
                case 'up':
                    newCoords = [coords[0], coords[1]-1];
                break;
                case 'down':
                    newCoords = [coords[0], coords[1]+1];
                break;
                case 'left':
                    newCoords = [coords[0]-1, coords[1]];
                break;
                case 'right':
                    newCoords = [coords[0]+1, coords[1]];
                break;
            }
            
        } else {
            // если входные координаты в виде объекта
            switch (direction) {
                case 'up':
                    newCoords = [coords.x, coords.y-1];
                break;
                case 'down':
                    newCoords = [coords.x, coords.y+1];
                break;
                case 'left':
                    newCoords = [coords.x-1, coords.y];
                break;
                case 'right':
                    newCoords = [coords.x+1, coords.y];
                break;
            }
        }
        
        return newCoords;
    }

    randomCell(width, heigth) {
        // Возвращает рандомные координаты ячейки на поле
        return { x: this.randomInteger(0, width), y: this.randomInteger(0, heigth) };
    }   

    getCell(coords, field) {
        // получение ссылки на ячейку с указанными координатами
        let cell;
        if (Array.isArray(coords)) {
            cell = field.cells.filter((item) => {
                return item.x == coords[0] && item.y == coords[1];
            });
        } else {
            cell = field.cells.filter((item) => {
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

    mixUpValues(array=['up', 'down', 'left', 'right']) {
        // перемешивает входной массив и возвращает его

        // создаем независимую копию входного массива
        let inputArray = [].concat(array);
        let newArray = [];
        
        while (inputArray.length > 0) {
            // поиск рандомного значения из входного массива
            let x = this.returnRandomValue(inputArray);
            // удаление этого значения из входного массива
            inputArray = inputArray.filter(item => {
                return x != item;
            });
            // добавляем значение в новый массив
            newArray.push(x);	
        }

        

        return newArray;
    }

    returnRandomValue(valueArray) {
        let x = this.randomInteger(0, valueArray.length-1);
        return valueArray[x];
    }

    getOppositeDir(direction) {
        switch (direction) {
            case 'up':
                return 'down'
            case 'down':
                return 'up'
            case 'left':
                return 'right'
            case 'right':
                return 'left'
        }
    }

    randomInteger(min, max) {
        // случайное число от min до max
        let rand = min + Math.random() * (max - min);
        return Math.floor(rand);
    }

    checkCell(cell) {
        // принимает ссылку на ячейку
        // проверка ячейки, является ли она пустой (status: void)
        if (!cell) return false;

        if (cell.status === 'void' && cell.blocked === false) {
            return true;
        } else {
            return false;
        }
    }

    shotThatCell(cellObject, fieldObject, fId) {
        // если по этой ячейке уже стреляли, возвращаем false
        if (cellObject.shot === true) {
            return false;
        }

        cellObject.shot = true;

        if (cellObject.status === 'void') {
            // если ячейка пустая
            document.getElementById(`f${fId}x${cellObject.x}y${cellObject.y}`).classList.add('miss');
            return 'void';
        } else if (cellObject.status === 'ship') {
            // если ячейка с кораблем
            document.getElementById(`f${fId}x${cellObject.x}y${cellObject.y}`).classList.add('hit');

            // проверяем затонул весь корабль или нет
            let isShipSank = true;
            for (let elem of cellObject.shipParts) {
                let cell = this.getCell([elem.x, elem.y], fieldObject);
                !cell.shot ? isShipSank = false : null;
            }

            // если все части корабля подбиты
            if (isShipSank) { 
                // установка стилей в DOM
                for (let partCoords of cellObject.shipParts) {
                    // установка всем клеткам корабля стиля 'died'
                    let elem = document.getElementById(`f${fId}x${partCoords.x}y${partCoords.y}`);
                    elem.classList.add('died');
                    elem.classList.remove('hit');
                    let part = this.getCell(partCoords, fieldObject)

                    // установка клеткам вокруг стиля 'miss'
                    for (let cell of part.cellsAroundShip) {
                        document.getElementById(`f${fId}x${cell.x}y${cell.y}`).classList.add('miss');
                        this.getCell(cell, fieldObject).shot = true;
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
                
                if (endOfGame) {
                    // если игра окончена
                    return 'win';
                } else {
                    // если корабль утонул
                    return 'sank';
                }
            } else {
                // если не все части корабля затонули
                return 'hit';
            }
        }

    }
}














