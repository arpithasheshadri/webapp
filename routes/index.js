import healthCheckRouter from './healthcheck-route.js';


export default (app) => {
  app.use("/healthz", healthCheckRouter);
};
