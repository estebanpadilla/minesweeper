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
}

Box.prototype.update = function update() {
    this.render();
}

Box.prototype.render = function render() {
    this.context.beginPath();
    this.context.fillStyle = this.color;
    this.context.fillRect((this.position.x + 0.5), (this.position.y + 0.5), (this.width - 1), (this.height - 1));
    this.context.closePath();
    this.context.fill();

    this.context.fillStyle = '#a0d4e3';
    this.context.font = this.font;
    if (this.isCell) {
        this.context.textAlign = 'center';
        this.context.fillText(this.text, (this.position.x + 19), (this.position.y + 27));
    } else {
        this.context.textAlign = 'right';
        this.context.fillText(this.text, (this.position.x + 120), (this.position.y + 62));
    }
    //this.context.fill();
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
}

Face.prototype.update = function update() {
    this.render();
}

Face.prototype.render = function render() {
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.fillStyle = this.color;
    this.context.strokeStyle = 'black';
    this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
    this.context.fill();
    this.context.stroke();

    if (this.isHappy) {
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

    } else {

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


