import { checkConnection } from "../services/healthcheck-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import logger from "./logger.js";

export const healthCheck = async (request, response) => {
    logger.info("Healthcheck started");
    response.set('Cache-Control', 'no-cache');
    try {
        if(Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0){
            logger.error("request body (or) request parameter should not be sent");
            response.status(400).send();
        } else {
            await checkConnection();
            logger.info("Healthcheck successful");
            logger.info("Healthcheck completed");
            response.status(200).send();
        }
    } catch (err) {
        logger.error(`Healthcheck Failed : ${err}`);
        setErrorResponse(503, err, response);
    }
}

export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    logger.error(`Healthcheck Failed : Requested method not allowed`);
    response.status(405).send();
}

