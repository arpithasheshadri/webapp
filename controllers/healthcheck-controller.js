import { checkConnection } from "../services/healthcheck-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";

export const healthCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    try {
        if(Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0){
            response.status(400).send();
        } else {
            await checkConnection();
            response.status(200).send();
        }
    } catch (err) {
        setErrorResponse(503, err, response);
    }
}

export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    response.status(405).send();
}

