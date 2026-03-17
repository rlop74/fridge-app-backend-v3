import app from './app';
import config from './config/config';

// import startDatabaseConnection from './db/db-connection';
// import redisClient, { connectRedis } from './cache/redis';
// import logger from './logs/logger';

function appListen() {
  return app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
  // http://localhost:<port>
}

const server = appListen();


// const server = startDatabaseConnection(config.mongoURI, appListen);

// Initialize Redis client

function exitHandler() {
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

const unexpectedErrorHandler = (error: any) => {
  console.log('Unexpected error:', error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  console.log('SIGTERM received');
  if (server) {
    server.close(() => {
      console.log('Server closed');
    });
  }
});