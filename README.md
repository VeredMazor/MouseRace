# Mouse Race Game

A simple browser-based game where you need to collect and avoid different types of elements. The game is built with HTML, CSS, and JavaScript, and uses Node.js for the backend.

## How to Run the Project

### Prerequisites

- Install [Node.js](https://nodejs.org/) version 4.19.2.
- Make sure you have npm (Node Package Manager) installed.

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/mouserace.git
    cd mouserace
    ```

2. Install the necessary packages:

    ```bash
    npm install
    ```

### Running the Project

Start the server by running:

```bash
npm start
```
### Database Setup (Redis)
For Redis on Windows, follow these steps:

1. Open PowerShell or Windows Command Prompt as an administrator.

2. Install Windows Subsystem for Linux (WSL) and Ubuntu:
```bash
wsl --install
```

3. If this is your first time setting up WSL, you'll be prompted to choose a username and password. Make sure to remember them!
4. Update the package list:
```bash
sudo apt update
```
5. Install Redis server:
```bash
sudo apt install redis-server
```
6. Start the Redis server:
```bash
sudo service redis-server start
```
7. Enable Redis server to start on boot:
```bash
sudo systemctl enable redis-server
```
8. Check the status of the Redis server:
```bash
sudo service redis-server status
```
9. Open the Redis CLI to interact with the Redis server:
```bash
redis-cli
```    
10. In the Redis CLI, check if the server is running by typing:
```bash
127.0.0.1:6379> ping
```
