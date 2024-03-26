import { userVerification, setVerification } from "../services/verify-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import logger from "./logger.js";

export const verifyUser = async (request, response) => {
    const token = request.query.token;
    logger.debug({
        message: "User verification started",
        severity: 'DEBUG'
      });
    response.set('Cache-Control', 'no-cache');
    try {
        const user = userVerification(token);
        if(user){
            const curDate = Date.now();
            logger.info({message: `curDate: ${curDate}, expiryTime: ${user.expiryTime}`,
        severity: 'INFO'});
            // const dbDate = new Date((user.expiryTime).toString()).getTime();
            

            if(curDate <= user.expiryTime){
                const user = setVerification(user.email);
                logger.info({
                    message: "User verification successful",
                    severity: 'INFO'
                  });
                response.status(200).send();
            } else {
                setErrorResponse(403,"Verification failed! Verification link has expired.",response);
            }
            
        }
        else {
            setErrorResponse(400,"Broken link! Verification token does not exist.",response);
        }
      
        
    } catch (err) {
        logger.error({
            message: `Verification Failed : ${err}`,
            severity: 'ERROR'
          });
        setErrorResponse(503, err, response);
    }
}
