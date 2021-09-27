const socketService = require('./socket.service');

class CacheService {
    _eventsName = {
        newCache: 'cache:new',
    };

    constructor() { }

    emitUpdateCache(usersId) {
        socketService.emit(usersId, this._eventsName.newCache);
    }
}

module.exports = new CacheService();