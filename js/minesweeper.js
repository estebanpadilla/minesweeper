window.addEventListener('load', initGame, false);
function initGame() {
    console.log('initGame');

    var minesQty = 12;
    var gametime = 0;
    var timerId = 0;
    var cells = [];
    var pool = [];
    var cols = 10;
    var rows = 10;
    var scoreBgColor = '#1695ac';
    var canvas = undefined;
    var context = undefined;
    var x = 20;
    var y = 20;
    var width = 440;
    var height = 540;

    canvas = createCanvas(x, y, width, height);
    context = canvas.getContext('2d');

    x = 20;
    y = 20;
    height = 80;

    const scoreBg = new Box({ x: x, y: y }, 140, height, scoreBgColor, context);
    scoreBg.text = '' + minesQty;
    scoreBg.font = '60px Lato'
    scoreBg.isCell = false;
    pool.push(scoreBg);

    const face = new Face({ x: 220, y: 60 }, 30, true, '#fff100', context);
    pool.push(face);

    const timerBg = new Box({ x: (width - 160), y: y }, 140, height, scoreBgColor, context);
    timerBg.text = '0';
    timerBg.font = '60px Lato';
    timerBg.isCell = false;
    timerId = setInterval(gameTimerHandler, 1000);
    pool.push(timerBg);


    canvas.addEventListener('click', clickOnCellHandler, false);

    //Create all cells.
    const cellQty = cols * rows;
    x = 20;
    y = 120;
    for (var i = 0; i < cellQty; i++) {


        var box = new Box({ x: x, y: y }, 40, 40, 'transparent', context);
        pool.push(box);
        var cell = new Cell(i, box, gameOver);

        if (i % 6 == 0) {
            cell.isMine = true;
        }

        cells.push(cell);
        x += 40;

        if ((i + 1) % 10 == 0) {
            x = 20;
            y += 40;
        }
    }

    //Set cells relationships
    for (var i = 0; i < cells.length; i++) {
        console.log('Cell: ' + cells[i].id);
        setNort(cells[i]);
        setSouth(cells[i]);
        setWest(cells[i]);
        setEast(cells[i]);
        setNorth_East(cells[i]);
        setNorth_West(cells[i]);
        setSouth_East(cells[i]);
        setSouth_West(cells[i]);
    }

    //Draw grid lines.
    y = 120;
    x = 20
    for (var i = 0; i < (cols + 1); i++) {
        const l = new Line({ x: x, y: y }, { x: (width - 20), y: y }, 2, '#e6e7e8', context)
        y += 40;
        pool.push(l);
    }

    y = 120;
    for (var i = 0; i < (rows + 1); i++) {
        const l = new Line({ x: x, y: y }, { x: x, y: 520 }, 2, '#e6e7e8', context)
        x += 40;
        pool.push(l);
    }

    //Click on cell event handler.
    function clickOnCellHandler(e) {
        findCellByPosition(e.layerX, e.layerY);
    }

    //Find the cell using the mouse click position.
    function findCellByPosition(x, y) {
        if (x > 20 && x < 420 && y > 125 && y < 525) {
            var colPosition = Math.round((x - 40) / 40);
            var rowPosition = Math.floor((y - 125) / 40);
            const id = (rowPosition * 10) + colPosition;
            activateCell(id);
        }
    }

    function activateCell(id) {
        var cell = cells[id];
        cell.activate();
        showConnection(id);
    }

    //Timer event handler.
    function gameTimerHandler() {
        gametime++;
        timerBg.text = '' + gametime;
        timerBg.update();
    }

    function gameOver() {
        console.log('GAME OVER');
        //Remove event listeners.
        canvas.removeEventListener('click', clickOnCellHandler, false);

        //Clear timer.
        clearInterval(timerId);

        //Set a sad face.    
        face.isHappy = false;
        face.update();

        //Show all mines in grid.
        cells.forEach(function (cell) {
            cell.explote();
        }, this);
    }

    function setNort(cell) {
        if (cell.id > cols) {
            cell.north = cells[(cell.id - cols)];
        }
    }

    function setSouth(cell) {
        if ((cell.id) < (cells.length - cols)) {
            cell.south = cells[(cell.id + cols)];
        }
    }

    function setWest(cell) {
        if ((cell.id) % 10 != 0) {
            if (cell.id > 1) {
                cell.west = cells[(cell.id - 1)];
            }
        }
    }

    function setEast(cell) {
        if ((cell.id + 1) % 10 != 0) {
            if (cell.id < (cells.length - 1)) {
                cell.east = cells[(cell.id + 1)];

            }
        }
    }

    function setNorth_East(cell) {
        if ((cell.id + 1) % 10 != 0) {
            cell.north_east = cells[(cell.id - (cols - 1))];
        }
    }

    function setNorth_West(cell) {
        if (cell.id % 10 != 0) {
            cell.north_west = cells[(cell.id - (cols + 1))];
        }
    }

    function setSouth_East(cell) {
        if ((cell.id + 1) % 10 != 0) {
            if ((cell.id) < (cells.length - cols)) {
                cell.south_east = cells[(cell.id + (cols + 1))];
            }
        }
    }

    function setSouth_West(cell) {
        if (cell.id % 10 != 0) {
            if ((cell.id) < (cells.length - cols)) {
                cell.south_west = cells[(cell.id + (cols - 1))];
            }
        }
    }

    pool.forEach(function (element) {
        element.update();
    }, this);
}

function createCanvas(x, y, width, height) {
    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.className = 'canvasStyle';
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.left = '' + x + 'px';
    canvas.style.top = '' + y + 'px';
    return canvas;
}