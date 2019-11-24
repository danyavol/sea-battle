'use strict'
import { expandCell, randomCell, getCell, mixUpValues, checkCell } from './field.functions.js';

export function generateField() {
	// field.cells = [ {x: 0, y: 0, status: ship/void, shipParts: [{x: 4, y: 4},{x: 4, y: 5}], .. , blocked: false, shot: false}, {...}, {...} ]
	// x, y:  координаты клетки.
	// status:
	// 		void - в этой клетке нету корабля; 
	// 		ship - в этой клетке находится часть корабля.
	// shipParts:  массив координат всех частей данного корабля(если клетка не является частью корабля - null).
	// cellsAroundShip:  массив координат клеток, вокруг корабля(если клетка не является частью корабля - null).
	// blocked:  если true - значит это зона вокруг корабля, куда нельзя ставить другие корабли.
	// shot:  производился ли выстрел по этой клетке.	

	let field = {
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
	for (let i = 0; i < field.fieldSize.x; i++) {
		for (let j = 0; j < field.fieldSize.y; j ++) {
			field.cells.push({x: i, y: j, status: "void", shipParts: null, cellsAroundShip: null, blocked: false, shot: false});
		}
	}


	// заполнение поля короблями
	for (let ship of field.shipsLength) {
		placeShip(ship);
	}


	return field;
	


	function placeShip(shipLength) {
		let iterationCount = 0; // отслеживание количества итерация, для избежания бесконечного цикла
		let flag = false; // если false - корабль разместить невозможно, ищем другую стартовую ячейку

		do {
			let startCell;	

			// поиск стартовой ячейки, где НЕ стоит корабль
			do {
				startCell = getCell(randomCell(field.fieldSize.x, field.fieldSize.y), field);
				if (startCell.status === "void" && startCell.blocked === false) {
					break;
				} 
			} while(true)

			// проверка на то, можно ли разместить здесь корабль		
			let dirArray = mixUpValues(['up', 'down', 'left', 'right']);
			for (let dir of dirArray) {
				// если можно - размещаем и выходим из функции placeShip
				if ( tryToPlaceShip(startCell, dir, shipLength) ) {
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

		
		
		function tryToPlaceShip(startCell, direction, length) {
			// пробуем разместить корабль из указанной ячейки в указанном направление с указанной длиной

			// Проверка
			let cellCoords = [startCell.x, startCell.y];
			if ( checkCell(startCell) ) {
				for(let i = 0; i < length; i++) {
					cellCoords = expandCell(cellCoords, direction);
					if ( !checkCell(getCell(cellCoords, field)) ) {
						return false
					}
				}
			} else {
				return false;
			}

			// Проверка пройдена, размещаем корабль
			placingShipOnField(startCell, direction, length);
			return true;

			function placingShipOnField(cell, direction, length) {
				// размещаем корабль в массив со всеми ячейками игрового поля (fieldCells)

				let currentCellCoords = [cell.x, cell.y];
				for (let i = 0; i < length; i++) {					
					// получаем ссылку на нужную ячейку
					let currentCell = getCell(currentCellCoords, field);
					// выставляем текущей ячейке статус корабля
					currentCell.status = "ship";
					currentCell.blocked = true;
					// задаем текущей ячейке массив всех частей коробля shipParts
					currentCell.shipParts = [];
					let startCellCoords = [cell.x, cell.y];
					for (let j = 0; j < length; j ++) {
						let startCell = getCell(startCellCoords, field);
						currentCell.shipParts.push(
							{x: startCell.x, y: startCell.y}
						);
						startCellCoords = expandCell(startCellCoords, direction);
					}

					// выставляем всем ячейкам вокруг корабля blocked равный true,
					// а так же заполняем массив соседних ячеек cellsAroundShip,
					// чтобы избежать размещения другого корабля вплотную
					if (i === 0 && i === length-1) {
						setIndentAroundShip(currentCell, direction, true, true);
					} else if (i === 0) {
						setIndentAroundShip(currentCell, direction, true, false);
					} else if (i === length-1) {
						setIndentAroundShip(currentCell, direction, false, true);
					} else {
						setIndentAroundShip(currentCell, direction, false, false);
					}

					// переходим к следующей ячейки в указанном направлении
					currentCellCoords = expandCell(currentCellCoords, direction);
				}

				function setIndentAroundShip(cell, direction, first=false, last=false) {
					// выставляем всем ячейка вокруг cell статус blocked
					// first - указывает является ли эта якейка первой в корабле
					// last - указывает является ли эта ячейка последней в корабле

					cell.cellsAroundShip === null ? cell.cellsAroundShip = [] : null;
					switch (direction) {
						// если корабль стоит вертикально, добавляем в cellsAroundShip соседние ячейки по горизонтали
						case 'up':
						case 'down':
							let leftCell = getCell(expandCell(cell, 'left'), field); 
							let rightCell = getCell(expandCell(cell, 'right'), field);
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
							let topCell = getCell(expandCell(cell, 'up'), field); 
							let bottomCell = getCell(expandCell(cell, 'down'), field);
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
						setButtIndent(direction, true);
					}

					// если это ячейка последняя в корабле, добавляем в массив cellsAroundShip ячейки расположенные на втором торце коробля 
					if (last) {
						setButtIndent(direction, false);
					}

					function setButtIndent(direction, isFirst) {
						let dir = getDirectionForIndent(direction, isFirst);
						let centerCell = getCell(expandCell(cell, dir[0]), field);
						let cell2 = getCell(expandCell(centerCell, dir[1]), field);
						let cell3 = getCell(expandCell(centerCell, dir[2]), field);
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
			}			
		}		
	}
}