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
        const user = await userVerification(token);
        if(user){
            const curDate = Date.now();
            if(curDate <= user.expiryTime.getTime()){
                setVerification(user.email).then(()=>{
                    logger.info({
                        message: "User verification successful",
                        severity: 'INFO'
                      });
                      response.status(200).send();
                })
                .catch((err)=>{
                    logger.error({
                        message: "Verification Success , failed to update DB",
                        severity: 'ERROR'
                      });
                    setErrorResponse(403,"Verification Success , failed to update DB.",response);
                })
            } else {
                logger.error({
                    message: "Verification failed! Verification link has expired.",
                    severity: 'ERROR'
                  });
                setErrorResponse(403,"Verification failed! Verification link has expired.",response);
            }
        }
        else {
            logger.error({
                message: "Broken link! Verification token does not exist.",
                severity: 'ERROR'
              });
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
