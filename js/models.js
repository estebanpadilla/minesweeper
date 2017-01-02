function Cell(id, box) {
    this.id = id;
    this.north = undefined;
    this.south = undefined;
    this.west = undefined;
    this.east = undefined;
    this.north_west = undefined;
    this.south_west = undefined;
    this.north_east = undefined;
    this.south_east = undefined;
    this.isMine = false;
    this.mineCounter = 0;
    this.box = box;
    this.isActavited = false;
}

Cell.prototype.activate = function activate() {

    console.log(this.id);

    if (this.isMine) {
        console.log("GAME OVER");
        this.box.color = '#ee3344';
        this.box.update();
        return;
    }

    if (this.isActavited) {
        return;
    }

    this.isActavited = true;

    if (this.north) {
        if (this.north.isMine) {
            this.mineCounter++;
        }
    }
    if (this.south) {
        if (this.south.isMine) {
            this.mineCounter++;
        }
    }

    if (this.east) {
        if (this.east.isMine) {
            this.mineCounter++;
        }
    }

    if (this.west) {
        if (this.west.isMine) {
            this.mineCounter++;
        }
    }

    if (this.north_east) {
        if (this.north_east.isMine) {
            this.mineCounter++;
        }
    }

    if (this.north_west) {
        if (this.north_west.isMine) {
            this.mineCounter++;
        }
    }

    if (this.south_east) {
        if (this.south_east.isMine) {
            this.mineCounter++;
        }
    }
    if (this.south_west) {
        if (this.south_west.isMine) {
            this.mineCounter++;
        }
    }

    if (this.mineCounter > 0) {
        this.box.text = '' + this.mineCounter;
    }

    this.box.color = '#ddf1f9';
    this.box.update();

    if (this.mineCounter < 2) {
        if (this.north) {
            if (!this.north.isMine) {
                this.north.activate();
            }
        }
        if (this.south) {
            if (!this.south.isMine) {
                this.south.activate();
            }
        }

        if (this.east) {
            if (!this.east.isMine) {
                this.east.activate();
            }
        }

        if (this.west) {
            if (!this.west.isMine) {
                this.west.activate();
            }
        }

        if (this.north_east) {
            if (!this.north_east.isMine) {
                this.north_east.activate();
            }
        }

        if (this.north_west) {
            if (!this.north_west.isMine) {
                this.north_west.activate();
            }
        }

        if (this.south_east) {
            if (!this.south_east.isMine) {
                this.south_east.activate();
            }
        }
        if (this.south_west) {
            if (!this.south_west.isMine) {
                this.south_west.activate();
            }
        }
    }
}