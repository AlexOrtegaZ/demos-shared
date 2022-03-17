/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const WebSocketClient = require('websocket').client;
const config = require('../../config/config');
const logger = require('../config/logger');

class SocketService {

  constructor() {
    this._client = new WebSocketClient();
    this._connection = null;
    this._connectionInProgressPromise = null;
  }

  async _getConnection() {
    if (this._connection !== null) {
      return this._connection;
    }
    if (this._connectionInProgressPromise !== null) {
      return this._connectionInProgressPromise;
    }
    logger.info(`Getting new connection(${new Date().toISOString()})`);
    const newConnection = await this._createConnection();
    this._connection = newConnection;
    return newConnection;
  }

  async _createConnection() {
    const { webSocketUrl } = config;
    this._client.connect(webSocketUrl, 'echo-protocol');
    this._connectionInProgressPromise =  new Promise((res, rej) => {
      this._client.on('connectFailed', function (error) {
        logger.error(`Connect Error: ${error.toString()}`);
        rej(Error('Connect Error'));
        this._connectionInProgressPromise = null;
      });
      this._client.on('connect', (connection) => {
        logger.info('WebSocket Client Connected');
        this._initializeOnErrorListener(connection);
        this._initializeOnCloseListener(connection);
        res(connection);
        this._connectionInProgressPromise = null;
      });
    });

    return this._connectionInProgressPromise;
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
    logger.info(`Message sended to: ${userId}, event name:  ${eventName}`);
    connection.sendUTF(message);
  }
}

module.exports = new SocketService();
