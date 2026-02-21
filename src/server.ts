import config from './app/config';
import { startScheduler } from './app/modules/scheduler/scheduler';
import app from './app';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

    startScheduler();
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection detected. Shutting down...', err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException detected. Shutting down...', err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
