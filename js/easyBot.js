'use strict'

export function easyBot() {

    

    
    function randomCell(width, heigth) {
        // Возвращает рандомные координаты ячейки на поле
        return { x: randomInteger(0, width), y: randomInteger(0, heigth) };
    }

    function getCell(coords) {
        // получение ссылки на ячейку с указанными координатами
        let cell;
        if (Array.isArray(coords)) {
            cell = fieldCells.filter((item) => {
                return item.x == coords[0] && item.y == coords[1];
            });
        } else {
            cell = fieldCells.filter((item) => {
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

    function randomInteger(min, max) {
        // случайное число от min до max
        let rand = min + Math.random() * (max - min);
        return Math.floor(rand);
    }
}