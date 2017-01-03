window.addEventListener('load', initGame, false);
function initGame() {
    var minesQty = 0;
    var gametime = 0;
    var timerId = 0;
    var cells = [];
    var mapData = [];
    var useImageDataForMap = false;
    var mapName = './maps/map1.jpg';
    var pool = [];
    var lines = [];
    var cols = 10;
    var rows = 10;
    var scoreBgColor = '#1695ac';
    var canvas = undefined;
    var context = undefined;
    var scoreBg = undefined;
    var face = undefined;
    var timerBg = undefined;
    var actionBtn = undefined;

    var x = 20;
    var y = 20;
    var width = 440;
    var height = 540;
    var isGameStarted = false;
    // var isGamePaused = false;
    var isGameOver = false;
    var isGameComplete = false;
    var isTimerOn = false;

    canvas = createCanvas(x, y, width, height);
    context = canvas.getContext('2d');

    //CREATION METHODS
    function createUI() {

        y = height + 30;
        actionBtn = createActionButton(210, 50, 60, 60);
        actionBtn.addEventListener('click', actionBtnHandler, false);

        x = 20;
        y = 20;
        height = 80;

        scoreBg = new Box({ x: x, y: y }, 140, height, scoreBgColor, context);
        scoreBg.text = '' + minesQty;
        scoreBg.font = '60px Lato'
        scoreBg.isCell = false;
        pool.push(scoreBg);

        face = new Face({ x: 220, y: 60 }, 30, true, '#fff100', context);
        pool.push(face);

        timerBg = new Box({ x: (width - 160), y: y }, 140, height, scoreBgColor, context);
        timerBg.text = '0';
        timerBg.font = '60px Lato';
        timerBg.isCell = false;
        pool.push(timerBg);
    }

    //Create all cells.
    function createCells() {

        cells = [];

        x = 20;
        y = 120;
        // const cellQty = cols * rows;

        for (var i = 0; i < mapData.length; i++) {

            var box = new Box({ x: x, y: y }, 40, 40, 'transparent', context);
            //pool.push(box);
            var cell = new Cell(i, box, gameOver);

            if (mapData[i] == 1) {
                cell.isMine = true;
                minesQty++;
            }

            cells.push(cell);
            x += 40;

            if ((i + 1) % 10 == 0) {
                x = 20;
                y += 40;
            }
        }

        //Set cells relationships.
        for (var i = 0; i < cells.length; i++) {
            setNort(cells[i]);
            setSouth(cells[i]);
            setWest(cells[i]);
            setEast(cells[i]);
            setNorth_East(cells[i]);
            setNorth_West(cells[i]);
            setSouth_East(cells[i]);
            setSouth_West(cells[i]);
        }
    }

    //Create grid lines.
    function createGridLines() {
        //Draw grid lines.
        y = 120;
        x = 20
        for (var i = 0; i < (cols + 1); i++) {
            const l = new Line({ x: x, y: y }, { x: (width - 20), y: y }, 2, '#e6e7e8', context)
            y += 40;
            lines.push(l);
        }

        y = 120;
        for (var i = 0; i < (rows + 1); i++) {
            const l = new Line({ x: x, y: y }, { x: x, y: 520 }, 2, '#e6e7e8', context)
            x += 40;
            lines.push(l);
        }
    }

    //Loads map from image.
    function loadMapData() {
        mapData = [];

        if (useImageDataForMap) {
            var map = new Image();
            map.src = mapName;
            map.onload = function () {
                context.drawImage(map, 0, 0, 10, 10);
                map.style.display = 'none';
                var mapImageData = context.getImageData(0, 0, 10, 10);
                //console.log(mapImageData);

                for (var i = 0; i < mapImageData.data.length; i += 4) {
                    //Read the first pixel and checks the value is close to 0.
                    if (mapImageData.data[i] < 10) {
                        //console.log('Pixel ' + (i / 4) + ' is mine');
                        mapData.push(1);
                    } else {
                        mapData.push(0);
                    }
                }
                createCells();
            };
        } else {
            minesQty = 15;
            var minePositions = [];

            for (var i = 0; i < 100; i++) {
                mapData.push(0);
            }

            for (var j = 0; j < minesQty; j++) {
                var num = getRandonNumber(minePositions);
                minePositions.push(num);
                //console.log(num);
            }

            for (var k = 0; k < minePositions.length; k++) {
                mapData[minePositions[k]] = 1;
            }

        }

        minesQty = 0;
    }

    function getRandonNumber(lastNumbers) {

        var isSameNumber = false;
        var ramdonNumber = Math.floor(getRandomArbitrary(0, 99));//get number here

        for (var i = 0; i <= lastNumbers.length; i++) {
            if (ramdonNumber == lastNumbers[i]) {
                isSameNumber = true;
                break;
            }
        }

        if (isSameNumber) {
            return getRandonNumber(lastNumbers);
        } else {
            return ramdonNumber;
        }
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    loadMapData();
    if (!useImageDataForMap) {
        createCells();
    }
    createUI();
    createGridLines();

    //EVENT HANDLERS
    //Click on cell event handler.
    function actionBtnHandler(e) {
        if (!isGameStarted) {
            startGame();
        }
    }

    //Timer event handler.
    function gameTimerHandler() {
        gametime++;
        timerBg.text = '' + gametime;
        timerBg.update();
    }

    function clickOnCellHandler(e) {

        if (!isTimerOn) {
            isTimerOn = true;
            timerId = setInterval(gameTimerHandler, 1000);
        }

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
        checkAllMinesSweeped();
    }


    //GAME LOGIG METHODS
    function startGame() {

        if (isGameOver || isGameComplete) {
            resetMap();
        }

        scoreBg.text = '' + minesQty;
        scoreBg.update();

        canvas.addEventListener('click', clickOnCellHandler, false);

        // isGamePaused = false;
        isGameStarted = true;
        isGameComplete = false;
    }

    function gameOver() {

        isGameStarted = false;
        isGameComplete = false;
        isGameOver = true;

        face.isHappy = false;
        face.update();

        //Remove event listeners.
        canvas.removeEventListener('click', clickOnCellHandler, false);

        //Clear timer.
        isTimerOn = false;
        clearInterval(timerId);

        //Show all mines in grid.
        cells.forEach(function (cell) {
            cell.explote();
        }, this);
    }

    function gameCompleted() {

        isGameComplete = true;
        isGameStarted = false;
        isGameOver = false;

        face.isHappy = false;
        face.isSuperHappy = true;
        face.update();

        //Remove event listeners.
        canvas.removeEventListener('click', clickOnCellHandler, false);

        //Clear timer.
        isTimerOn = false;
        clearInterval(timerId);

        //Show all mines in grid.
        cells.forEach(function (cell) {
            cell.showFlag();
        }, this);

    }

    //Check all mine to see if game map is clear.`
    function checkAllMinesSweeped() {

        var clearCellsQty = 0;
        var totalClearableCells = mapData.length - minesQty;
        var totalClearedCells = 0;

        cells.forEach(function (cell) {
            if (cell.isClear) {
                totalClearedCells++;
            }
        }, this);

        if (totalClearableCells == totalClearedCells) {
            console.log('Game COMPLETE');
            isGameComplete = true;
            gameCompleted();
        }
    }

    function resetMap() {

        gametime = 0;
        timerBg.text = '' + gametime;
        timerBg.update();
        face.isHappy = true;
        face.update();

        if (!useImageDataForMap) {
            isGameOver = false;
            isGameComplete = false;
            loadMapData();
            createCells();

        }

        cells.forEach(function (cell) {
            cell.reset();
        }, this);

        lines.forEach(function (line) {
            line.update();
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

    lines.forEach(function (line) {
        line.update();
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

function createActionButton(x, y, width, height) {
    var button = document.createElement('button');
    button.className = 'button';
    button.setAttribute('type', 'button');
    button.style.position = 'absolute';
    button.style.left = '' + x + 'px';
    button.style.top = '' + y + 'px';
    button.style.width = '' + width + 'px';
    button.style.height = '' + height + 'px';
    //button.innerHTML = 'Play';
    document.body.appendChild(button);
    return button;
}