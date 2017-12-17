# chat-study
Small chat project for learning NodeJS, Socket.io and MongoDB

This project was made to run in Cloud9 (https://c9.io).

## Installation

* Create an new **Blank Ubuntu** workspace.

* Install *NodeJs*, *npm* and *MongoDB*:
    ```
    sudo apt-get update
    sudo apt-get install nodejs npm mongodb-org
    ```
  * Don't update node and npm in cloud9 environment. Go with the default versions downloaded.

* Clone this project contents into the workspace root:
    ```
    git clone https://github.com/paulera/chat-study ~/workspace
    ```

* Install node dependencies:
    ```
    cd ~/workspace/iochat
    npm install
    ```

* Create *mongoDB* data directory:
    ```
    mkdir ~/workspace/data
    ```

## Running the chat

Run the script files `node_start.sh` and `mongo_start.sh` from the workspace root folder. The mongoDB port is hardcoded in the variable `strMongoHost` in `iochat/server.js`, you might need to change it (check mongoDB server log output to find the port number).

Head to the url provided by the node server script to open the chat.

