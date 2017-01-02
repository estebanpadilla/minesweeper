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
    this.context.font = '20px Lato';
    this.context.fillText(this.text, (this.position.x + 14), (this.position.y + 27));
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

