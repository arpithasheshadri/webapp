import { addUser } from "../services/user-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import bcrypt from "bcrypt";
import { validate } from "./validation.js";

export const createUser = async (request, response) => {
    try {
        const isValid = validate(request.body);
        if (!isValid.isValid) {
            setErrorResponse(isValid.errors?.code, isValid.errors,response)
        } else {
            const salt = await bcrypt.genSalt(10);
            const hpassword = await bcrypt.hash(request.body.password, salt);

            let user = {
                username: request.body.username,
                password: hpassword,
                first_name: request.body.first_name,
                last_name: request.body.last_name
            }
            const addedUser = await addUser(user);
            let responseUser = {
                id: addedUser.id,
                username: addedUser.username,
                first_name: addedUser.first_name,
                last_name: addedUser.last_name,
                account_created: addedUser.account_created,
                account_updated: addedUser.account_updated

            }
            setResponse(responseUser, response);
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            setErrorResponse(400, "Username (or) Email already exists", response);
        } else {
            setErrorResponse(503, err, response);
        }
    }
}



export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    response.status(405).send();
}

