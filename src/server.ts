import * as express from 'express';

// This function it's used for startup the server
// It setup the express server and the apollo server
export default () => {
  const app = express();

  app.listen(3000, () => {
    console.log('Server up and running');
  });
};
