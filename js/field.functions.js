'use strict'

export function expandCell(coords, direction) {
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


export function randomCell(width, heigth) {
    // Возвращает рандомные координаты ячейки на поле
    return { x: randomInteger(0, width), y: randomInteger(0, heigth) };
}

export function getCell(coords, field) {
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

export function mixUpValues(array=['up', 'down', 'left', 'right']) {
    // перемешивает входной массив и возвращает его

    // создаем независимую копию входного массива
    let inputArray = [].concat(array);
    let newArray = [];
    
    while (inputArray.length > 0) {
        // поиск рандомного значения из входного массива
        let x = returnRandomValue(inputArray);
        // удаление этого значения из входного массива
        inputArray = inputArray.filter(item => {
            return x != item;
        });
        // добавляем значение в новый массив
        newArray.push(x);	
    }

    function returnRandomValue(valueArray) {
        let x = randomInteger(0, valueArray.length-1);
        return valueArray[x];
    }

    return newArray;
}

export function randomInteger(min, max) {
    // случайное число от min до max
    let rand = min + Math.random() * (max - min);
    return Math.floor(rand);
}

export function checkCell(cell) {
    // принимает ссылку на ячейку
    // проверка ячейки, является ли она пустой (status: void)
    if (!cell) return false;

    if (cell.status === 'void' && cell.blocked === false) {
        return true;
    } else {
        return false;
    }
}