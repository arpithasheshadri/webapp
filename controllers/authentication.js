import bcrypt from "bcrypt";
import { fetchUser } from "../services/user-service.js";

export const authentication = async(auth = {}) => {
    const encoded = auth.substring(6);
    const decoded = Buffer.from(encoded, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');
    const authenticatedUser = await fetchUser(email);
    if(authenticatedUser){
        const passwordMatch = await bcrypt.compare(password, authenticatedUser.password);
        if(passwordMatch){
            return authenticatedUser;
        } 
        return null
    }
    return null
    
}