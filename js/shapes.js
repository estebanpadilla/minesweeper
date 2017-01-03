function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

function Box(position, width, height, color, context) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.context = context;
    this.color = color;
    this.text = '';
    this.font = '20px Lato';
    this.isCell = true;
    this.showMine = false;
    this.showFlag = false;
}

Box.prototype.reset = function reset() {
    this.context.clearRect(this.position.x, this.position.y, this.width, this.height);

    this.color = '#f3f5f5';
    this.text = '';
    this.showMine = false;
    this.showFlag = false;
    this.update();
}

Box.prototype.update = function update() {
    this.render();
}

Box.prototype.render = function render() {

    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.fillRect((this.position.x + 0.5), (this.position.y + 0.5), (this.width - 1), (this.height - 1));
    this.context.fill();
    this.context.closePath();

    this.context.font = this.font;

    if (this.isCell) {
        this.context.fillStyle = celltextColor();
        this.context.textAlign = 'center';
        this.context.fillText(this.text, (this.position.x + 19), (this.position.y + 27));
    } else {
        this.context.fillStyle = scoresTxtColor();
        this.context.textAlign = 'right';
        this.context.fillText(this.text, (this.position.x + 120), (this.position.y + 62));
    }

    if (this.showMine) {

        this.context.fillStyle = mineColor();
        this.context.arc((this.position.x + this.width / 2), (this.position.y + this.height / 2), 8, 0, (Math.PI * 2), false);
        this.context.fill();

        this.context.lineWidth = 2;
        this.context.lineCap = 'round';

        this.context.strokeStyle = mineColor();
        this.context.beginPath();
        this.context.moveTo(this.position.x + 8, this.position.y + this.height / 2);
        this.context.lineTo(this.position.x + (this.width - 8), this.position.y + this.height / 2);
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo(this.position.x + (this.width / 2), this.position.y + 8);
        this.context.lineTo(this.position.x + (this.width / 2), this.position.y + (this.height - 8));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo(this.position.x + 13, this.position.y + 13);
        this.context.lineTo(this.position.x + (this.width - 13), this.position.y + (this.height - 13));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo(this.position.x + (this.width - 13), this.position.y + 13);
        this.context.lineTo(this.position.x + 13, this.position.y + (this.height - 13));
        this.context.stroke();
        this.context.closePath();

        this.context.fillStyle = 'white';
        this.context.arc((this.position.x + 17), (this.position.y + 17), 2, 0, (Math.PI * 2), false);
        this.context.fill();
    }

    if (this.showFlag) {

        this.context.beginPath();
        this.context.strokeStyle = mineColor();
        this.context.lineWidth = 3;
        this.context.moveTo(this.position.x + 16, this.position.y + (this.height - 11));
        this.context.lineTo(this.position.x + (this.width - 16), this.position.y + (this.height - 11));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.lineWidth = 4;
        this.context.moveTo(this.position.x + 13, this.position.y + (this.height - 8));
        this.context.lineTo(this.position.x + (this.width - 13), this.position.y + (this.height - 8));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.moveTo(this.position.x + (this.width / 2), this.position.y + 10);
        this.context.lineTo(this.position.x + (this.width / 2), this.position.y + (this.height - 10));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.strokeStyle = flagColor();
        this.context.fillStyle = flagColor();
        this.context.lineCap = 'round';
        this.context.moveTo(this.position.x + (this.width / 2), this.position.y + 10);
        this.context.lineTo(this.position.x + 10, this.position.y + 15);
        this.context.lineTo(this.position.x + (this.width / 2), this.position.y + 20);
        this.context.closePath();
        this.context.fill();
        this.context.stroke();
    }
}

function Line(a, b, width, color, context) {
    this.a = a;
    this.b = b;
    this.width = width;
    this.color = color;
    this.context = context;
}

Line.prototype.render = function render() {
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.width;
    this.context.beginPath();
    this.context.moveTo(this.a.x, this.a.y);
    this.context.lineTo(this.b.x, this.b.y);
    this.context.closePath();
    this.context.stroke();
}

Line.prototype.update = function update() {
    this.render();
}

function Face(position, radius, isHappy, color, context) {
    this.position = position;
    this.radius = radius;
    this.isHappy = isHappy;
    this.color = color;
    this.context = context;
    this.isSuperHappy = false;
}

Face.prototype.update = function update() {
    this.render();
}

Face.prototype.render = function render() {
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.fillStyle = this.getFaceColor();
    this.context.strokeStyle = 'black';
    this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    this.context.fill();
    this.context.stroke();

    if (this.isHappy) {
        //Draw happy face
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.arc((this.position.x - 10), (this.position.y - 7), 5, 0, Math.PI * 2, false);
        this.context.fill();

        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.arc((this.position.x + 10), (this.position.y - 7), 5, 0, Math.PI * 2, false);
        this.context.fill();

        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.moveTo((this.position.x - 10), (this.position.y + 10));
        this.context.bezierCurveTo((this.position.x - 7), (this.position.y + 15), (this.position.x + 7), (this.position.y + 15), (this.position.x + 10), (this.position.y + 10));
        this.context.stroke();

    } else if (this.isSuperHappy) {
        //Drar super happy face
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.moveTo((this.position.x - this.radius), this.position.y);
        this.context.lineTo((this.position.x - 18), (this.position.y - 12));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo((this.position.x + this.radius), this.position.y);
        this.context.lineTo((this.position.x + 18), (this.position.y - 12));
        this.context.stroke();
        this.context.closePath();

        // this.context.beginPath();
        // this.context.lineWidth = 4;
        // this.context.moveTo((this.position.x - 18), (this.position.y - 10));
        // this.context.lineTo((this.position.x + 18), (this.position.y - 10));
        // this.context.stroke();
        // this.context.closePath();

        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.lineWidth = 3;
        this.context.moveTo((this.position.x - 20), (this.position.y - 12));
        this.context.bezierCurveTo((this.position.x - 20), (this.position.y + 7), (this.position.x), (this.position.y + 7), (this.position.x), (this.position.y - 12));
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.moveTo((this.position.x), (this.position.y - 12));
        this.context.bezierCurveTo((this.position.x), (this.position.y + 7), (this.position.x + 20), (this.position.y + 7), (this.position.x + 20), (this.position.y - 12));
        this.context.closePath();
        this.context.fill();
        this.context.stroke();


        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.moveTo((this.position.x - 10), (this.position.y + 10));
        this.context.bezierCurveTo((this.position.x - 7), (this.position.y + 15), (this.position.x + 7), (this.position.y + 15), (this.position.x + 10), (this.position.y + 10));
        this.context.stroke();


    } else {
        //Draw sad face
        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.moveTo((this.position.x - 12.5), (this.position.y - 10));
        this.context.lineTo((this.position.x - 7.5), (this.position.y - 5));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo((this.position.x - 7.5), (this.position.y - 10));
        this.context.lineTo((this.position.x - 12.5), (this.position.y - 5));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo((this.position.x + 7), (this.position.y - 10));
        this.context.lineTo((this.position.x + 12), (this.position.y - 5));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.moveTo((this.position.x + 12), (this.position.y - 10));
        this.context.lineTo((this.position.x + 7), (this.position.y - 5));
        this.context.stroke();
        this.context.closePath();

        this.context.beginPath();
        this.context.lineWidth = 3;
        this.context.lineCap = 'round';
        this.context.moveTo((this.position.x - 10), (this.position.y + 10));
        this.context.bezierCurveTo((this.position.x - 7), (this.position.y + 5), (this.position.x + 7), (this.position.y + 5), (this.position.x + 10), (this.position.y + 10));
        this.context.stroke();
    }
}

Face.prototype.getFaceColor = function getFaceColor() {
    if (this.isSuperHappy) {
        return faceSuperHappyColor()
    } else if (this.isHappy) {
        return faceHappyColor();

    } else {
        return faceSadColor();
    }
}


