import { addUser } from "../services/user-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import bcrypt from "bcrypt";
import { authentication } from "./authentication.js";
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
            response.status(201).send(responseUser);
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            setErrorResponse(400, "Username (or) Email already exists", response);
        } else {
            setErrorResponse(503, err, response);
        }
    }
}

export const getUser = async (request, response) => {
    try {
        const auth = request.headers.authorization;
        if (!auth || Object.keys(auth).length === 0) {
            setErrorResponse(400, "Authentication credentials required", response);
        } else if(Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0) {
            setErrorResponse(400, "Request body should not be sent", response);
        } else {
            const authenticatedUser = await authentication(auth);
            if (authenticatedUser) {
                let user = {
                    id: authenticatedUser.id,
                    username: authenticatedUser.username,
                    first_name: authenticatedUser.first_name,
                    last_name: authenticatedUser.last_name,
                    account_created: authenticatedUser.account_created,
                    account_updated: authenticatedUser.account_updated
                }
                setResponse(user, response);
            } else {
                setErrorResponse(401, "Invalid credentials provided", response);
            }
        }
    } catch (err) {
        setErrorResponse(503, err, response);
    }
}

export const updateUser = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    try {
        const { first_name, last_name, password } = request.body;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/;
        if(!Object.values(request.body).every(val => {
            return typeof val === 'string' && val.trim() !== '' && val !== null;
        })){
            setErrorResponse(400,"Payload values should not be empty/null",response);
        }
        else if(password && !passwordPattern.test(password)){
            setErrorResponse(400,"Password should be alphanumeric with special characters and at least 6 characters long",response);
        } else {
            const allowedFields = ["first_name", "last_name", "password"];
            const invalidFields = Object.keys(request.body).filter(val => !allowedFields.includes(val));
            if (invalidFields.length > 0) {
                setErrorResponse(400, `Invalid fields - ${invalidFields.join(', ')} to update`, response);
            } else {
                const auth = request.headers.authorization;
                if (!auth || Object.keys(auth).length === 0) {
                    setErrorResponse(400, "Authentication credentials required", response);
                } else {
                    const authenticatedUser = await authentication(auth);
                    if (authenticatedUser) {
                        if (first_name) {
                            authenticatedUser.first_name = first_name;
                        }
                        if (last_name) {
                            authenticatedUser.last_name = last_name;
                        }
                        if (password) {
                            const salt = await bcrypt.genSalt(10);
                            const hpassword = await bcrypt.hash(password, salt);
                            authenticatedUser.password = hpassword;
                        }
                        authenticatedUser.account_updated = new Date();
                        await authenticatedUser.save();
                        response.status(204).send();
                    } else {
                        setErrorResponse(401, "Invalid credentials provided", response);
                    }
                }
            }
        }
    } catch (err) {
        setErrorResponse(503, "Service Unavailable", response);
    }
}

export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    response.status(405).send();
}

