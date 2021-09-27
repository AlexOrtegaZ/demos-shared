const WebSocketClient = require('websocket').client;
const config = require('../../config/config');
const logger = require('../config/logger');

class SocketService {
  constructor() {
    this._client = new WebSocketClient();
    this._connection = null;
  }

  async _getConnection() {
    if (this._connection !== null) {
      return this._connection;
    }
    logger.info(`Getting new connection(${new Date().toISOString()})`);
    const newConnection = await this._createConnection();
    this._connection = newConnection;
    return newConnection;
  }

  async _createConnection() {
    const { webSocketUrl } = config;
    this._client.connect(webSocketUrl, 'echo-protocol');
    return new Promise((res, rej) => {
      this._client.on('connectFailed', function (error) {
        logger.error(`Connect Error: ${error.toString()}`);
        rej(Error('Connect Error'));
      });
      this._client.on('connect', (connection) => {
        logger.info('WebSocket Client Connected');
        this._initializeOnErrorListener(connection);
        this._initializeOnCloseListener(connection);
        res(connection);
      });
    });
  }

  _close() {
    this._client.off();
  }

  _initializeOnErrorListener(connection) {
    connection.on('error', function (error) {
      logger.info(`Connection Error: ${error.toString()}`);
    });
  }

  _initializeOnCloseListener(connection) {
    connection.on('close', () => {
      this._connection = null;
      logger.info('echo-protocol Connection Closed');
    });
  }

  async emit(userId, eventName) {
    const message = JSON.stringify([userId, eventName]);
    const connection = await this._getConnection();
    logger.info(`Message sended to: ${userId}`);
    connection.sendUTF(message);
  }
}

module.exports = new SocketService();
