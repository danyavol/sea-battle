'use strict'
import { BasicFuncs } from './basicFuncs.js';

export class Field extends BasicFuncs {
	constructor() {
		super();

		this.field;

		// this.field.cells = [ {x: 0, y: 0, status: ship/void, shipParts: [{x: 4, y: 4},{x: 4, y: 5}], .. , blocked: false, shot: false}, {...}, {...} ]
		// x, y:  координаты клетки.
		// status:
		// 		void - в этой клетке нету корабля; 
		// 		ship - в этой клетке находится часть корабля.
		// shipParts:  массив координат всех частей данного корабля(если клетка не является частью корабля - null).
		// cellsAroundShip:  массив координат клеток, вокруг корабля(если клетка не является частью корабля - null).
		// blocked:  если true - значит это зона вокруг корабля, куда нельзя ставить другие корабли.
		// shot:  производился ли выстрел по этой клетке.	
	}

	generateField() {
		this.field = {
			cells: [],
			// размер поля, можно изменять
			fieldSize: {
				x: 10,
				y: 10
			},
			// массив кораблей, можно изменять
			shipsLength: [
				4, 3, 3, 2, 2, 2, 1, 1, 1, 1
			]
		};

		// генерация пустого поля
		for (let i = 0; i < this.field.fieldSize.x; i++) {
			for (let j = 0; j < this.field.fieldSize.y; j ++) {
				this.field.cells.push({x: i, y: j, status: "void", shipParts: null, cellsAroundShip: null, blocked: false, shot: false});
			}
		}

		// заполнение поля короблями
		for (let ship of this.field.shipsLength) {
			this.placeShip(ship);
		}

		return this.field;
	}

	placeShip(shipLength) {
		let iterationCount = 0; // отслеживание количества итерация, для избежания бесконечного цикла
		let flag = false; // если false - корабль разместить невозможно, ищем другую стартовую ячейку

		do {
			let startCell;	

			// поиск стартовой ячейки, где НЕ стоит корабль
			do {
				let rc = super.randomCell(this.field.fieldSize.x, this.field.fieldSize.y);
				startCell = super.getCell(rc, this.field);
				if (startCell.status === "void" && startCell.blocked === false) {
					break;
				} 
			} while(true)

			// проверка на то, можно ли разместить здесь корабль		
			let dirArray = super.mixUpValues(['up', 'down', 'left', 'right']);
			for (let dir of dirArray) {
				// если можно - размещаем и выходим из функции placeShip
				if ( this.tryToPlaceShip(startCell, dir, shipLength) ) {
					flag = true;
					break;
				}
			}
			iterationCount++;
		}
		while (!flag && iterationCount < 200)

		// Если не удалось установить корабль на поле
		if (iterationCount >= 200) {	
			console.log(`Can't place a ship with length - ${shipLength}.`);
		}			
	}

	tryToPlaceShip(startCell, direction, length) {
		// пробуем разместить корабль из указанной ячейки в указанном направление с указанной длиной

		// Проверка
		let cellCoords = [startCell.x, startCell.y];
		if ( super.checkCell(startCell) ) {
			for(let i = 0; i < length; i++) {
				cellCoords = super.expandCell(cellCoords, direction);
				if ( !super.checkCell(super.getCell(cellCoords, this.field)) ) {
					return false
				}
			}
		} else {
			return false;
		}

		// Проверка пройдена, размещаем корабль
		this.placingShipOnField(startCell, direction, length);
		return true;
					
	}

	placingShipOnField(cell, direction, length) {
		// размещаем корабль в массив со всеми ячейками игрового поля (fieldCells)

		let currentCellCoords = [cell.x, cell.y];
		for (let i = 0; i < length; i++) {					
			// получаем ссылку на нужную ячейку
			let currentCell = super.getCell(currentCellCoords, this.field);
			// выставляем текущей ячейке статус корабля
			currentCell.status = "ship";
			currentCell.blocked = true;
			// задаем текущей ячейке массив всех частей коробля shipParts
			currentCell.shipParts = [];
			let startCellCoords = [cell.x, cell.y];
			for (let j = 0; j < length; j ++) {
				let startCell = super.getCell(startCellCoords, this.field);
				currentCell.shipParts.push(
					{x: startCell.x, y: startCell.y}
				);
				startCellCoords = super.expandCell(startCellCoords, direction);
			}

			// выставляем всем ячейкам вокруг корабля blocked равный true,
			// а так же заполняем массив соседних ячеек cellsAroundShip,
			// чтобы избежать размещения другого корабля вплотную
			if (i === 0 && i === length-1) {
				this.setIndentAroundShip(currentCell, direction, true, true);
			} else if (i === 0) {
				this.setIndentAroundShip(currentCell, direction, true, false);
			} else if (i === length-1) {
				this.setIndentAroundShip(currentCell, direction, false, true);
			} else {
				this.setIndentAroundShip(currentCell, direction, false, false);
			}

			// переходим к следующей ячейки в указанном направлении
			currentCellCoords = super.expandCell(currentCellCoords, direction);
		}

		
	}

	setIndentAroundShip(cell, direction, first=false, last=false) {
		// выставляем всем ячейка вокруг cell статус blocked
		// first - указывает является ли эта якейка первой в корабле
		// last - указывает является ли эта ячейка последней в корабле

		cell.cellsAroundShip === null ? cell.cellsAroundShip = [] : null;
		switch (direction) {
			// если корабль стоит вертикально, добавляем в cellsAroundShip соседние ячейки по горизонтали
			case 'up':
			case 'down':
				let leftCell = super.getCell(super.expandCell(cell, 'left'), this.field); 
				let rightCell = super.getCell(super.expandCell(cell, 'right'), this.field);
				for (let c of [leftCell, rightCell]) {
					if (c) {
						c.blocked = true;
						cell.cellsAroundShip.push( {x: c.x, y: c.y} );
					}
				}
				break;
			// и наоборот
			case 'left':
			case 'right':
				let topCell = super.getCell(super.expandCell(cell, 'up'), this.field); 
				let bottomCell = super.getCell(super.expandCell(cell, 'down'), this.field);
				for (let c of [topCell, bottomCell]) {
					if (c) {
						c.blocked = true;
						cell.cellsAroundShip.push( {x: c.x, y: c.y} );
					}
				}
				break;
		}

		// если это ячейка первая в корабле, добавляем в массив cellsAroundShip ячейки расположенные на первом торце коробля 
		if (first) {
			this.setButtIndent(cell, direction, true);
		}

		// если это ячейка последняя в корабле, добавляем в массив cellsAroundShip ячейки расположенные на втором торце коробля 
		if (last) {
			this.setButtIndent(cell, direction, false);
		}

		
	}

	setButtIndent(cell, direction, isFirst) {
		let dir = getDirectionForIndent(direction, isFirst);
		let centerCell = super.getCell(super.expandCell(cell, dir[0]), this.field);
		let cell2 = super.getCell(super.expandCell(centerCell, dir[1]), this.field);
		let cell3 = super.getCell(super.expandCell(centerCell, dir[2]), this.field);
		for (let c of [centerCell, cell2, cell3]) {
			if (c) {
				c.blocked = true;
				cell.cellsAroundShip.push( {x: c.x, y: c.y} );
			}
		}

		function getDirectionForIndent(dir, isFirst) {
			switch(dir) {
				case 'up':
					if (isFirst) {
						return ['down', 'left', 'right'];
					}
					return ['up', 'left', 'right'];
				case 'down':
					if (isFirst) {
						return ['up', 'left', 'right'];
					}
					return ['down', 'left', 'right'];
				case 'left':
					if (isFirst) {
						return ['right', 'up', 'down'];
					}
					return ['left', 'up', 'down'];
				case 'right':
					if (isFirst) {
						return ['left', 'up', 'down'];
					}
					return ['right', 'up', 'down'];
			}
		}
	}
}

