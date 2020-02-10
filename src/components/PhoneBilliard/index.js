import React from 'react';

class PhoneBilliard extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.ballRadius = 1 / 100.0;
        this.speedFactor = 0.2;
        this.maxSpeed = 10.0;
        this.drag = 0.5;

        const balls = [];
        for (let i = 0; i < 10; i++) {
            const x =
                Math.random() * (1 - 2 * this.ballRadius) +
                this.ballRadius;
            const y =
                Math.random() * (1 - 2 * this.ballRadius) +
                this.ballRadius;
            balls.push(new Ball(x, y, i));
        }
        this.balls = balls;
        this.activeBall = null;

        this.state = {
            phoneNumber: '90651077',
        };

        this.interval = null;
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.update();
            this.draw();
        }, 1000.0 / 60);
        const canvas = this.canvasRef.current;
        canvas.onmousedown = this.handleMouseDown.bind(this);
        canvas.onmouseup = this.handleMouseUp.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleMouseDown(e) {
        const canvas = this.canvasRef.current;
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        for (const ball of this.balls) {
            // (x - center_x)^2 + (y - center_y)^2 < radius^2
            if (
                Math.pow(mouseX - ball.x * canvas.width, 2) +
                    Math.pow(mouseY - ball.y * canvas.height, 2) <=
                Math.pow(this.ballRadius * canvas.width, 2)
            ) {
                this.activeBall = ball;
                break;
            }
        }
    }

    handleMouseUp(e) {
        const canvas = this.canvasRef.current;
        const mouseX = e.offsetX / canvas.width;
        const mouseY = e.offsetY / canvas.height;

        if (this.activeBall) {
            const dx = this.activeBall.x - mouseX;
            const dy = this.activeBall.y - mouseY;

            this.activeBall.dx = Math.min(
                dx * this.speedFactor,
                this.maxSpeed,
            );
            this.activeBall.dy = Math.min(
                dy * this.speedFactor,
                this.maxSpeed,
            );
        }

        this.activeBall = null;
    }

    draw() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, w, h);
        const radius = this.ballRadius * w;

        for (let ball of this.balls) {
            const centerX = ball.x * w;
            const centerY = ball.y * h;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'green';
            ctx.fill();
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = '#003300';
            // ctx.stroke();
        }
    }

    update() {
        for (const ball of this.balls) {
            ball.move(this.ballRadius, this.drag);
        }
    }

    render() {
        const { phoneNumber } = this.state;

        return (
            <div>
                <div>
                    <label>Telefonnummer: {phoneNumber}</label>
                    <button className="btn">Start på nytt</button>
                </div>

                <canvas
                    ref={this.canvasRef}
                    width="1024px"
                    height="768px"
                ></canvas>
            </div>
        );
    }
}

class Ball {
    dx = 0;
    dy = 0;
    x = 0;
    y = 0;
    number = 0;

    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this.number = number;
    }

    move(ballRadius, drag) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x - ballRadius <= 0 && this.dx < 0) {
            this.dx *= -drag;
        } else if (this.x + ballRadius >= 1.0 && this.dx > 0) {
            this.dx *= -drag;
        }

        if (this.y - ballRadius <= 0 && this.dy < 0) {
            this.dy *= -drag;
        } else if (this.y + ballRadius >= 1.0 && this.dy > 0) {
            this.dy *= -drag;
        }
    }
}

export default PhoneBilliard;
