const socketService = require('./socket.service');

const eventsName = {
  newCache: 'cache:new',
};

class CacheService {
  emitUpdateCache(usersId) {
    socketService.emit(usersId, eventsName.newCache);
  }
}

module.exports = new CacheService();
