import bcrypt from "bcrypt";
import { fetchUser } from "../services/user-service.js";
import logger from "./logger.js";

export const authentication = async(auth = {}) => {
    logger.debug({
        message: `Authentication started`,
        severity: 'DEBUG'
      });
    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');
    const authenticatedUser = await fetchUser(email);
    if(authenticatedUser){
        const passwordMatch = await bcrypt.compare(password, authenticatedUser.password);
        if(passwordMatch){
            logger.debug({
                message: `Authentication successful`,
                severity: 'DEBUG'
              });
            return authenticatedUser;
        }
        logger.debug({
            message: `Authentication failed`,
            severity: 'DEBUG'
          }); 
        return null
    }
    logger.debug({
        message: `Authentication failed`,
        severity: 'DEBUG'
      });
    return null
    
}