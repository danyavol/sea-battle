'use strict'
const field = document.getElementById('field');

function generateField() {
	// fieldCells = [ {x: 0, y: 0, status: ship/void/blocked}, {...}, {...} ]
	// void - в этой клетке нету корабля; 
	// ship - в этой клетке находится часть корабля;
	// blocked - зона вокруг корабля, куда нельзя ставить корабли.
	let fieldCells = []; 

	// массив кораблей, можно изменять
	//let shipsArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; 
	let shipsArray = [4,4,4,4,4,4,4,4];


	// генерация пустого поля
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j ++) {
			fieldCells.push({x: i, y: j, status: "void"});
		}
	}

	// заполнение поля короблями
	for (let ship of shipsArray) {
		placeShip(ship);
	}
	


	function placeShip(shipLength) {
		let iterationCount = 0; // отслеживание количества итерация, для избежания бесконечного цикла
		let flag = false; // если false - корабль разместить невозможно, ищем другую стартовую ячейку

		do {
			let startCell;	

			// поиск стартовой ячейки, где НЕ стоит корабль
			do {
				startCell = getCell(randomCell(10,10));
				if (startCell.status === "void") {
					break;
				} 
			} while(true)
			
			// console.log('startCel === ', startCell);

			// проверка на то, можно ли разместить здесь корабль
			// если можно - размещаем и выходим из функции placeShip
			let dirArray = mixUpValues(['up', 'down', 'left', 'right']);
			for (let dir of dirArray) {
				if ( tryToPlaceShip(startCell, dir, shipLength) ) {
					flag = true;
					break;
				}
			}
			iterationCount++;
		}
		while (!flag && iterationCount < 100)

		if (iterationCount >= 100) {
			console.log(`Cant place a ship with length - ${shipLength}.`);
		} else {
			console.log(`Ship with length ${shipLength} successfully placed.`);
		}

		
		
		function tryToPlaceShip(startCell, direction, length) {
			// пробуем разместить корабль из указанной ячейки в указанном направление с указанной длиной

			let cellCoords = [startCell.x, startCell.y];
			if (cheackCell(getCell(cellCoords))) {
				for(let i = 0; i < length; i++) {
					cellCoords = expandCell(cellCoords, direction);
					if (!cheackCell(getCell(cellCoords))) {
						return false
					}
				}
			} else {
				return false;
			}

			// Проверка пройдена, размещаем корабль
			console.log(`Can place ${length} ship! Start cell - ${[startCell.x, startCell.y]}. Direction - ${direction}.`);	
			placingShipOnField(startCell, direction, length);
			return true;

			function placingShipOnField(cell, direction, length) {
				// размещаем корабль
				let cellCoords = [cell.x, cell.y];
				for (let i = 0; i < length; i++) {
					// получаем ссылку на нужную ячейку
					let currentCell = getCell(cellCoords);
					// выставляем текущей ячейке статус коробля
					currentCell.status = "ship";

					// выставляем всем ячейкам вокруг корабля статус blocked
					// чтобы избежать размещения другого корабля вплотную
					i === 0 ?
					setIndentAroundShip(currentCell, direction, true) :
					setIndentAroundShip(currentCell, direction);

					// переходим к следующей ячейки в указанном направлении
					cellCoords = expandCell(cellCoords, direction);
				}

				function setIndentAroundShip(cell, direction, include=false) {
					// выставляем всем ячейка вокруг cell статус blocked
					// include - указывает, включать ли ячейку, противоположной по направлению direction
					// (для первой ячейки коробля указываем true, для остальных false)
					let array = ['up','left','down','down','right','right','up','up'];
					let cellToExclude = null;
					if (!include) {
						let directionToExclude;
						switch (direction) {
							case 'up':
								directionToExclude = 'down';
							break;
							case 'down':
								directionToExclude = 'up';
							break;
							case 'left':
								directionToExclude = 'right';
							break;
							case 'right':
								directionToExclude = 'left';
							break;
						}
						cellToExclude = expandCell(cell, directionToExclude);
					}
					
					let currentCell = cell;
					for (let dir of array) {
						currentCell = expandCell(currentCell, dir);
						// проверяем нужно ли исключить текующую ячейку
						if (currentCell === cellToExclude) {
							continue;
						}
						// проверка ячейки и установление ей статуса blocked
						if ( cheackCell( getCell(currentCell) ) ) {
							getCell(currentCell).status = 'blocked';
						}
					}
					
				}
			}
			
			
			function cheackCell(cell) {
				if (!cell) return false;

				if (cell.status === 'void') {
					return true;
				} else {
					return false;
				}
			}
		}

		function expandCell(coords, direction) {
			let newCoords;
			if (Array.isArray(coords)) {
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

		function randomCell(width, heigth) {
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

		function mixUpValues(array=['up', 'down', 'left', 'right']) {
			// перемешивает и возвращает входной массив array

			let startArray = [].concat(array);
			let newArray = [];
			
			while (startArray.length > 0) {
				let x = returnRandomValue(startArray);
				startArray = startArray.filter(item => {
					return x != item;
				});
				newArray.push(x);	
			}

			function returnRandomValue(valueArray) {
				let x = randomInteger(0, valueArray.length-1);
				return valueArray[x];
			}

			return newArray;
		}

		function randomInteger(min, max) {
			// случайное число от min до (max)
			let rand = min + Math.random() * (max - min);
			return Math.floor(rand);
		}
		
	}

	return fieldCells;
}

let fieldCells = generateField();

for (let i = 0; i < 10; i++) {
	let row = document.createElement('div');
	row.classList.add('row');
	field.appendChild(row);
	for (let j = 0; j < 10; j++) {
		let cell = document.createElement('div');
		cell.classList.add('cell');
		cell.id = `x${i}y${j}`;
		row.appendChild(cell);
	}
}

for (let cell of fieldCells) {
	document.getElementById(`x${cell.x}y${cell.y}`).classList.add(`${cell.status}`);
}
