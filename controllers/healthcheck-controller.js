import { checkConnection } from "../services/healthcheck-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import logger from "./logger.js";

export const healthCheck = async (request, response) => {
    logger.info({
        message: "Healthcheck started",
        severity: 'INFO'
      });
    response.set('Cache-Control', 'no-cache');
    try {
        if(Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0){
            logger.error({
                message: 'request body (or) request parameter should not be sent',
                severity: 'INFO'
              });
            response.status(400).send();
        } else {
            await checkConnection();
            logger.info({
                message: "Healthcheck successful",
                severity: 'INFO'
              });
              logger.info({
                message: "Healthcheck completed",
                severity: 'INFO'
              });
            response.status(200).send();
        }
    } catch (err) {
        logger.error({
            message: `Healthcheck Failed : ${err}`,
            severity: 'ERROR'
          });
        setErrorResponse(503, err, response);
    }
}

export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    logger.error({
        message: `Healthcheck Failed : Requested method not allowed`,
        severity: 'ERROR'
      });
    response.status(405).send();
}

