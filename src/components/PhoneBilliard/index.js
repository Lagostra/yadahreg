import React from 'react';

class PhoneBilliard extends React.Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        this.ballRadius = 1 / 20.0;
        this.holeRadius = 1 / 8.0;
        this.speedFactor = 0.2;
        this.maxSpeed = 5.0;
        this.wallDrag = 0.5;
        this.drag = 0.99;

        this.touchX = null;
        this.touchY = null;

        this.balls = [];
        this.holes = [];
        this.activeBall = null;

        this.state = {
            phoneNumber: '',
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
        canvas.onmousemove = this.handleMouseMove.bind(this);
        canvas.ontouchstart = this.handleTouchStart.bind(this);
        canvas.ontouchmove = this.handleTouchMove.bind(this);
        canvas.ontouchend = this.handleTouchEnd.bind(this);

        canvas.width = canvas.parentNode.clientWidth;
        canvas.height = canvas.parentNode.clientHeight;

        const ballRadiusY =
            this.ballRadius * (canvas.width / canvas.height);
        const balls = [];
        for (let i = 0; i < 10; i++) {
            const x =
                Math.random() * (1 - 2 * this.ballRadius) +
                this.ballRadius;
            const y =
                Math.random() * (1 - 2 * this.ballRadius) +
                ballRadiusY;
            balls.push(new Ball(x, y, i));
        }
        this.balls = balls;

        this.holes = [
            new Ball(0, 0),
            new Ball(1, 0),
            new Ball(1, 1),
            new Ball(0, 1),
        ];

        this.props.updatePhoneNumber(this.state.phoneNumber);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleTouchStart(e) {
        const touch = e.changedTouches[0];
        const canvas = this.canvasRef.current;
        const cRect = canvas.getBoundingClientRect();
        const offsetX = touch.clientX - cRect.x;
        const offsetY = touch.clientY - cRect.y;
        this.touchX = offsetX;
        this.touchY = offsetY;

        this.handleMouseOrTouchDown(offsetX, offsetY);
    }

    handleMouseDown(e) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        this.touchX = mouseX;
        this.touchY = mouseY;
        this.handleMouseOrTouchDown(mouseX, mouseY);
    }

    handleMouseOrTouchDown(offsetX, offsetY) {
        const canvas = this.canvasRef.current;
        offsetX /= canvas.width;
        offsetY /= canvas.height;

        for (const ball of this.balls) {
            // (x - center_x)^2 + (y - center_y)^2 < radius^2
            if (
                Math.pow(offsetX - ball.x, 2) +
                    Math.pow(offsetY - ball.y, 2) <=
                Math.pow(this.ballRadius, 2)
            ) {
                this.activeBall = ball;
                break;
            }
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const canvas = this.canvasRef.current;
        const cRect = canvas.getBoundingClientRect();
        this.touchX = touch.clientX - cRect.x;
        this.touchY = touch.clientY - cRect.y;
    }

    handleMouseMove(e) {
        this.touchX = e.offsetX;
        this.touchY = e.offsetY;
    }

    handleMouseUp(e) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        this.handleMouseOrTouchUp(mouseX, mouseY);
    }

    handleTouchEnd = () => {
        const offsetX = this.touchX;
        const offsetY = this.touchY;
        this.handleMouseOrTouchUp(offsetX, offsetY);
    };

    handleMouseOrTouchUp(offsetX, offsetY) {
        this.touchX = this.touchY = null;
        const canvas = this.canvasRef.current;
        offsetX /= canvas.width;
        offsetY /= canvas.height;
        if (this.activeBall) {
            const dx = this.activeBall.x - offsetX;
            const dy = this.activeBall.y - offsetY;

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

    addNumber = ball => {
        const canvas = this.canvasRef.current;
        const ballRadiusY =
            this.ballRadius * (canvas.width / canvas.height);
        let { phoneNumber } = this.state;
        phoneNumber = phoneNumber + ball.number;
        this.setState({ phoneNumber });

        const x =
            Math.random() * (1 - 2 * this.ballRadius) +
            this.ballRadius;
        const y =
            Math.random() * (1 - 2 * this.ballRadius) + ballRadiusY;
        ball.x = x;
        ball.y = y;
        ball.dx = ball.dy = 0;

        this.props.updatePhoneNumber(this.state.phoneNumber);
    };

    clearNumber = () => {
        this.setState({ phoneNumber: '' });
        this.props.updatePhoneNumber(this.state.phoneNumber);
    };

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
            ctx.fillStyle = 'black';
            ctx.font = '15px Arial';
            ctx.fillText(ball.number, centerX, centerY);
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = '#003300';
            // ctx.stroke();
        }

        for (let hole of this.holes) {
            const centerX = hole.x * w;
            const centerY = hole.y * h;
            ctx.beginPath();
            ctx.arc(
                centerX,
                centerY,
                this.holeRadius * w,
                0,
                2 * Math.PI,
                false,
            );
            ctx.fillStyle = 'gray';
            ctx.fill();
        }

        if (this.touchX && this.activeBall) {
            ctx.beginPath();
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 10;
            ctx.moveTo(this.touchX, this.touchY);
            ctx.lineTo(
                this.activeBall.x * canvas.width,
                this.activeBall.y * canvas.height,
            );
            ctx.stroke();
        }
    }

    update() {
        const canvas = this.canvasRef.current;
        for (const ball of this.balls) {
            const ballRadiusY =
                this.ballRadius * (canvas.width / canvas.height);
            ball.move(
                this.ballRadius,
                ballRadiusY,
                this.drag,
                this.wallDrag,
                this.holes,
                this.holeRadius,
                this.addNumber,
            );
        }
    }

    render() {
        const { phoneNumber } = this.state;

        return (
            <div
                style={{
                    width: '100%',
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div>
                    <label>Telefonnummer: {phoneNumber}</label>
                    <button
                        className="btn"
                        onClick={this.clearNumber}
                    >
                        Start på nytt
                    </button>
                </div>
                <div style={{ width: '100%', flex: '1 1 auto' }}>
                    <canvas ref={this.canvasRef}></canvas>
                </div>
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

    move(
        ballRadiusX,
        ballRadiusY,
        drag,
        wallDrag,
        holes,
        holeRadius,
        addNumberFn,
    ) {
        this.x += this.dx;
        this.y += this.dy;

        this.dx *= drag;
        this.dy *= drag;

        // Check collision with walls
        if (this.x - ballRadiusX <= 0 && this.dx < 0) {
            this.x = ballRadiusX;
            this.dx *= -wallDrag;
        } else if (this.x + ballRadiusX >= 1.0 && this.dx > 0) {
            this.x = 1 - ballRadiusX;
            this.dx *= -wallDrag;
        }

        if (this.y - ballRadiusY <= 0 && this.dy < 0) {
            this.y = ballRadiusY;
            this.dy *= -wallDrag;
        } else if (this.y + ballRadiusY >= 1.0 && this.dy > 0) {
            this.y = 1 - ballRadiusY;
            this.dy *= -wallDrag;
        }

        // Check hit of holes
        for (let hole of holes) {
            if (
                Math.pow(this.x - hole.x, 2) +
                    Math.pow(this.y - hole.y, 2) <=
                Math.pow(holeRadius, 2)
            ) {
                addNumberFn(this);
            }
        }
    }
}

export default PhoneBilliard;
