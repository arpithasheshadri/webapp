import healthCheckRouter from './healthcheck-route.js';
import userRouter from './user-route.js';

export default (app) => {
  app.use("/healthz", healthCheckRouter);
  app.use("/v1/user", userRouter);
};
