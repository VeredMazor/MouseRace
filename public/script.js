let down = true;
let rigth = true;
let isStarted = false;

class GameElement {
    constructor(type, x, y, size) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.color;

        this.type = type;
        this.behavior = this.getBehavior();
        this.color = this.getColor();
        this.shape = this.getShape();
        this.size = size;
        
    }

    getShape() {
        switch (this.type) {
            case 'Collect': return 'rectangle';
            case 'Avoid': return 'circle';
            case 'Change': return 'square';
        }
    }

    getColor() {
        switch (this.type) {
            case 'Collect':
                return 'green';
            case 'Avoid':
                return 'red';
            case 'Change':
                return this.color;
        }
    }

    getBehavior() {
        switch (this.type) {
            case 'Collect': return this.moveUpDown.bind(this);
            case 'Avoid': return this.moveLeftRight.bind(this);
            case 'Change': return this.rotate.bind(this);
        }
    }

    draw(context) {
        context.save();
        context.fillStyle = this.getColor();
        
        if (this.shape === 'square') {
            context.translate(this.x + this.size / 2, this.y + this.size / 2);
            context.rotate(this.angle);
            context.translate(-(this.x + this.size / 2), -(this.y + this.size / 2));
        }
        switch (this.shape) {
            case 'rectangle':
                context.fillRect(this.x + 1, this.y + 2, this.size + 10, this.size + 40);
                break;
            case 'circle':
                context.beginPath();
                context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
                context.fill();
                break;
            case 'square':
                context.fillRect(this.x, this.y, this.size, this.size);
                break;
        }
        context.restore();
    }


    moveUpDown() {
        if(down) { this.y++; }
        else { this.y--; }
        if (this.y > 600) this.y = 0;
        else if (this.y <= 0) this.y = 600;
    }

    moveLeftRight() {
        if(rigth) { this.x++; }
        else { this.x--; }
        if (this.x > 800) this.x = 0;
        else if (this.x <= 0) this.x = 800;
    }

    rotate() { this.angle += 0.05; }

    update() { this.behavior(); }

    isClicked(mouseX, mouseY) {
        switch (this.shape) {
            case 'rectangle':
                return (
                    mouseX >= this.x &&
                    mouseX <= this.x + this.size + 10 &&
                    mouseY >= this.y &&
                    mouseY <= this.y + this.size + 40
                );
            case 'square':
                return (
                    mouseX >= this.x &&
                    mouseX <= this.x + this.size &&
                    mouseY >= this.y &&
                    mouseY <= this.y + this.size
                );
            case 'circle':
                const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
                return distance <= this.size / 2;
        }
    }

    setColor(color) { this.color = color; }

}


class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.context = this.canvas.getContext('2d');
        this.elements = [];
        this.color;
        this.rectanglesCount = 0;
        this.squaresCount = 0;
        this.startTime = null;
        this.timer = document.getElementById('timer');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.init();
    }

    init() {
        document.getElementById('start-button').addEventListener('click', () => this.start());
        this.canvas.addEventListener('click', (event) => this.onClick(event));
        this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.updateLeaderboard();
    }

    start() {
        if(!isStarted){
            this.startTime = Date.now();
            this.generateElements();
            this.update();
            isStarted = true;
        }
    }

    reset() {
        this.elements = [];
        this.rectanglesCount = 0;
        this.squaresCount = 0;
        location.reload();
    }

    generateElements() {
        this.elements = [];
        this.rectanglesCount = 0;
        this.squaresCount = 0;
        
        for (let i = 0; i < 10; i++) {
            const type = ['Collect', 'Avoid', 'Change'][Math.floor(Math.random() * 3)];
            const size = Math.random() * 50 + 20;
            const x = Math.random() * (this.canvas.width-size);
            const y = Math.random() * (this.canvas.height-size);
            
            const element = new GameElement(type, x, y, size);
            this.elements.push(element);
            if (element.type === 'Collect' || element.type === 'Change') {
                if (element.shape === 'rectangle') {
                    this.rectanglesCount++;
                } else if (element.shape === 'square') {
                    this.squaresCount++;
                }
            }
        }
        
    }

    onClick(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        let removed = false;
    
        for (let i = this.elements.length - 1; i >= 0; i--) {
            const element = this.elements[i];
            if (element.isClicked(mouseX, mouseY)) {
                console.log(element.color)
                if (element.getColor() === 'red') {
                    alert('Game over!') 
                    this.reset();
                    return;
                }
    
                this.elements.splice(i, 1);
                if (element.type === 'Collect' || element.type === 'Change') {
                    if (element.shape === 'rectangle') {
                        this.rectanglesCount--;
                    } else if (element.shape === 'square') {
                        this.squaresCount--;
                    }
                }
                removed = true;
                break;
            }
        }
    
        if (removed && this.rectanglesCount === 0 && this.squaresCount === 0) {
            if (confirm('Congratulations! You have cleared all rectangles and squares. Game completed! Do you want to save your time and name in the leaderboard?')) {
                this.saveToLeaderboard();
            }
            this.reset();
        }
    }
    
    onMouseMove(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        let hovering = false;

        for (const element of this.elements) {
            if (element.isClicked(mouseX, mouseY)) {
                hovering = true;
                break;
            }
        }
        this.canvas.style.cursor = hovering ? 'pointer' : 'default';
    }

    update() {
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        if (elapsedTime % 4 == 0) { down = true }

        else if (elapsedTime % 4 == 2) { down = false }

        if (elapsedTime % 6 == 0) { rigth = true }

        else if (elapsedTime % 6 == 3) { rigth = false }

        if (elapsedTime % 4 == 0) { this.color = 'green' }

        else if (elapsedTime % 4 == 2) { this.color = 'red' }

        this.timer.textContent = `Time: ${elapsedTime}`;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const element of this.elements) {
            element.setColor(this.color);
            element.update();
            element.draw(this.context);
        }
        requestAnimationFrame(() => this.update());
    }

    // script.js
    saveToLeaderboard() {
        const name = prompt('Enter your name for the leaderboard:');
        if (name) {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            const leaderboardEntry = { name: name, time: elapsedTime };
            this.addToLeaderboard(leaderboardEntry);
        } else {
            alert('Name not entered. Your score will not be saved.');
        }
    }

    addToLeaderboard(entry) {
        fetch('/submit-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        })
        .then(data => {
            console.log('Response:', data);
            if (typeof data === 'object' && data.success) {
                this.updateLeaderboard(); // Update leaderboard on successful submission
            } else {
                alert('Error saving to leaderboard.');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Error saving to leaderboard.');
        });
    }

    
    async fetchLeaderboard() {
        try {
            const response = await fetch('/leaderboard');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    async updateLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = ''; // Clear existing leaderboard
        var numOfLead = 0; 
        const leaderboardData = await this.fetchLeaderboard();
        leaderboardData.forEach(entry => {
            if(numOfLead < 3) {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.name}: ${entry.time} seconds`;
                leaderboardList.appendChild(listItem);
                numOfLead++;
            }
        });
    }
    
}

window.onload = () => {
    new Game();
};
