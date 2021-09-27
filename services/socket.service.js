const config = require('../../config/config');
const WebSocketClient = require('websocket').client;

class SocketService {
    _client =  new WebSocketClient();
    _connection = null;

    constructor() { }

    async _getConnection() {
        if(this._connection !== null) {
            return this._connection;
        }
        console.log('getting new connection');
        const newConnection = await this._createConnection();
        this._connection = newConnection;
        return newConnection;
        
    }

    async _createConnection() {
        const { webSocketUrl } = config;
        this._client.connect(webSocketUrl, 'echo-protocol');
        return new Promise((res, rej) => {
            this._client.on('connectFailed', function(error) {
                console.log('Connect Error: ' + error.toString());
                rej('Connect Error');
            });
            this._client.on('connect', (connection) => {
                console.log('WebSocket Client Connected');
                this._initializeOnErrorListener(connection);
                this._initializeOnCloseListener(connection);
                res(connection);
            });
        })
    }

    _close() {
        this._client.off();
    }

    _initializeOnErrorListener(connection) {
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
    }

    _initializeOnCloseListener(connection) {
        connection.on('close', () => {
            this._connection = null;
            console.log('echo-protocol Connection Closed');
        });
    }

    async emit(userId, eventName) {
        const message = JSON.stringify([userId, eventName]);
        const connection = await this._getConnection();
        console.log('Message sended to: ' + userId);
        connection.sendUTF(message);
    }

}

module.exports = new SocketService();


