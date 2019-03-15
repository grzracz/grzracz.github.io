// Copyright (c) 2019 Grzegorz Raczek
// https://github.com/grzracz
// Files available under MIT license

window.onload=function(){
	
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) 
{    
	window.setTimeout(callback, 1000 / 60)
};

var div = document.getElementById("pong_div");
var canvas = document.getElementById("pong");

var scale = (div.clientHeight * 99/100) / 400;
canvas.width = (div.clientWidth * 99/100);
canvas.height = (div.clientHeight * 99/100);

var context = canvas.getContext('2d');
var computer1 = new Computer(canvas.width * 1/30 - canvas.width/160, canvas.height * 3/8, canvas.width/80, canvas.height/5);
var computer2 = new Computer(canvas.width * 29/30 - canvas.width/160, canvas.height * 3/8, canvas.width/80, canvas.height/5);
var ball = new Ball(canvas.width/2, canvas.height/2);

var render = function () {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    computer1.render();
    computer2.render();
    ball.render();
};

var update = function () {
    computer1.update(ball, -1);
    computer2.update(ball, 1);
    ball.update(computer1, computer2);
};

var step = function () {
    update();
    render();
    animate(step);
	context.font = (scale*60 + "px Helvetica");
	context.textAlign = "center";
	var str = computer1.paddle.score + " - " + computer2.paddle.score;
	context.fillText(str, canvas.width/2, canvas.height/2);
	context.fillStyle = "#FFFFFF";
};

function Paddle(x, y, width, height) {
	this.score = 0;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (y) {
    this.y += y;
    this.y_speed = y;
    if (this.y < 0) {
        this.y = 0;
        this.y_speed = 0;
    } else if (this.y + this.height > canvas.height) {
        this.y = canvas.height - this.height;
        this.y_speed = 0;
    }
};

function Computer(x, y, height, width) {
    this.paddle = new Paddle(x, y, height, width);
	this.score = 0;
}

Computer.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.update = function (ball, side) {
    var temp = -((this.paddle.y + (this.paddle.height / 2)) - ball.y);
    if (temp < -4) {
        temp = -5*scale+(ball.y_speed/5);
    } else if (temp > 4) {
        temp = 5*scale+(ball.y_speed/5);
    }
    if (ball.x_speed < 0)
	{	
		if (side < 0) this.paddle.move(temp);
	}
	else if (ball.x_speed > 0)
	{
		if (side > 0) this.paddle.move(temp);
	}
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 6*scale;
    this.y_speed = scale;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, scale*5, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    context.fill();
};

Ball.prototype.update = function (computer1, computer2) {
    this.x += this.x_speed;
    this.y += this.y_speed;

    if (this.y - scale*5 < 0) {
        this.y = scale*5;
        this.y_speed = -this.y_speed;
    } else if (this.y + scale*5 > canvas.height) {
        this.y = canvas.height - scale*5;
        this.y_speed = -this.y_speed;
    }

    if (this.x < 0 || this.x > canvas.width) {
		if (this.x < 0) computer2.paddle.score++;
		else if (this.x > canvas.width) computer1.paddle.score++;
        this.x_speed = 6*scale*(((Math.random()-0.5) > 0) ? 1 : -1);
        this.y_speed = scale*(((Math.random()-0.5) > 0) ? 1 : -1);
        this.x = canvas.width/2;
        this.y = canvas.height/2;
    }
	
	var p1 = computer1.paddle;
	var p2 = computer2.paddle;
	
	
    if ((this.x - scale*5 < p1.x + p1.width/2) && (this.y - 5*scale < p1.y + p1.height) && (this.y + 5*scale > p1.y) && (this.x + scale*5 > p1.x))
	{
		if (this.y_speed < 0) this.y_speed -= scale + Math.random()*scale;
		else this.y_speed += scale + Math.random()*scale;
        this.x_speed *= -1;  
        this.x += this.x_speed;
	}
	else if ((this.x + scale*5 > p2.x + p2.width/2) && (this.y - 5*scale < p2.y + p2.height) && (this.y + 5*scale > p2.y) && (this.x - scale*5 < p2.x + p2.width))
	{
		if (this.y_speed < 0) this.y_speed -= scale + Math.random()*scale;
		else this.y_speed += scale + Math.random()*scale;
        this.x_speed *= -1;  
        this.x += this.x_speed;
	}
	
};
animate(step);
}