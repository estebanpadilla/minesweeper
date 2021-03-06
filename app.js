window.addEventListener('load', initGame, false);
function initGame() {

    let canvas = null;
    let context = null;
    let scoreBg = null;
    let face = null;
    let timerBg = null;
    let actionBtn = null;

    let minesQty = 0;
    let gametime = 0;
    let timerId = 0;
    let cells = [];
    let mapData = [];
    let useImageDataForMap = false;
    let mapName = './maps/map1.jpg';
    let pool = [];
    let lines = [];
    let cols = 10;
    let rows = 10;
    let scoreBgColor = '#1695ac';
    let x = 20;
    let y = 20;
    let width = 440;
    let height = 540;
    let isGameStarted = false;
    // var isGamePaused = false;
    let isGameOver = false;
    let isGameComplete = false;
    let isTimerOn = false;

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

        scoreBg = new Box({ x: x, y: y }, 140, height, scoresBgColor(), context);
        scoreBg.text = '' + minesQty;
        scoreBg.font = '60px Lato'
        scoreBg.isCell = false;
        pool.push(scoreBg);

        face = new Face({ x: 220, y: 60 }, 30, true, faceHappyColor(), context);
        pool.push(face);

        timerBg = new Box({ x: (width - 160), y: y }, 140, height, scoresBgColor(), context);
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

        for (let i = 0; i < mapData.length; i++) {

            let box = new Box({ x: x, y: y }, 40, 40, 'transparent', context);
            //pool.push(box);
            let cell = new Cell(i, box, gameOver);

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
        for (let i = 0; i < cells.length; i++) {
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
        for (let i = 0; i < (cols + 1); i++) {
            const l = new Line({ x: x, y: y }, { x: (width - 20), y: y }, 2, linesColor(), context)
            y += 40;
            lines.push(l);
        }

        y = 120;
        for (let i = 0; i < (rows + 1); i++) {
            const l = new Line({ x: x, y: y }, { x: x, y: 520 }, 2, linesColor(), context)
            x += 40;
            lines.push(l);
        }
    }

    //Loads map from image.
    function loadMapData() {
        mapData = [];

        if (useImageDataForMap) {
            let map = new Image();
            map.src = mapName;
            map.onload = function () {
                context.drawImage(map, 0, 0, 10, 10);
                map.style.display = 'none';
                let mapImageData = context.getImageData(0, 0, 10, 10);
                //console.log(mapImageData);

                for (let i = 0; i < mapImageData.data.length; i += 4) {
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
            let minePositions = [];

            for (let i = 0; i < 100; i++) {
                mapData.push(0);
            }

            for (let j = 0; j < minesQty; j++) {
                let num = getRandonNumber(minePositions);
                minePositions.push(num);
                //console.log(num);
            }

            for (let k = 0; k < minePositions.length; k++) {
                mapData[minePositions[k]] = 1;
            }

        }

        minesQty = 0;
    }

    function getRandonNumber(lastNumbers) {

        let isSameNumber = false;
        let ramdonNumber = Math.floor(getRandomArbitrary(0, 99));//get number here

        for (let i = 0; i <= lastNumbers.length; i++) {
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
            let colPosition = Math.round((x - 40) / 40);
            let rowPosition = Math.floor((y - 125) / 40);
            const id = (rowPosition * 10) + colPosition;
            activateCell(id);
        }
    }

    function activateCell(id) {
        let cell = cells[id];
        cell.activate();

        if (!cell.isMine) {
            checkAllMinesSweeped();
        }
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

        face.isSuperHappy = false;
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

        let clearCellsQty = 0;
        let totalClearableCells = mapData.length - minesQty;
        let totalClearedCells = 0;

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
    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'absolute';
    canvas.style.left = '' + x + 'px';
    canvas.style.top = '' + y + 'px';
    canvas.style.background = canvasColor();
    return canvas;
}

function createActionButton(x, y, width, height) {
    let button = document.createElement('button');
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