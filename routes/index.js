import healthCheckRouter from './healthcheck-route.js';
import userRouter from './user-route.js';
import verifyRoute from './verify-route.js';

export default (app) => {
  app.use("/healthz", healthCheckRouter);
  app.use("/v1/user", userRouter);
  app.use("/verify", verifyRoute);
};
