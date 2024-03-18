import { addUser } from "../services/user-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { authentication } from "./authentication.js";
import { validate } from "./validation.js";
import logger from "./logger.js";

export const createUser = async (request, response) => {
    logger.info("User creation started");
    try {
        const isValid = validate(request.body);
        if (!isValid.isValid) {
            logger.error(`Error occured while creating user : ${isValid.errors.message}`);
            setErrorResponse(isValid.errors?.code, isValid.errors,response)
        } else {
            const salt = await bcrypt.genSalt(10);
            const hpassword = await bcrypt.hash(request.body.password, salt);
            
            let user = {
                id: uuidv4(),
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
            logger.info("User creation successful");
            response.status(201).send(responseUser);
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            logger.error(`Error occured while creating user : Username (or) Email already exists`);
            setErrorResponse(400, "Username (or) Email already exists", response);
        } else {
            logger.error(`Error occured while creating user : ${err}`);
            setErrorResponse(503, err, response);
        }
    }
}

export const getUser = async (request, response) => {
    logger.info("Fetching user started");
    try {
        const auth = request.headers.authorization;
        if (!auth || Object.keys(auth).length === 0) {
            logger.error(`Error occured while fetching user : Authentication credentials required`);
            setErrorResponse(400, "Authentication credentials required", response);
        } else if(Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0) {
            logger.error(`Error occured while fetching user : Request body should not be sent`);
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
                logger.info(`User fetched successfully`);
                setResponse(user, response);
            } else {
                logger.error(`Error occured while fetching user : Invalid credentials provided`);
                setErrorResponse(401, "Invalid credentials provided", response);
            }
        }
    } catch (err) {
        logger.error(`Error occured while fetching user : ${err}`);
        setErrorResponse(503, err, response);
    }
}

export const updateUser = async (request, response) => {
    logger.info("Updating user started");
    response.set('Cache-Control', 'no-cache');
    try {
        const { first_name, last_name, password } = request.body;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/;
        if(!Object.values(request.body).every(val => {
            return typeof val === 'string' && val.trim() !== '' && val !== null;
        })){
            logger.error("Error occured while updating user : Payload values should not be empty/null");
            setErrorResponse(400,"Payload values should not be empty/null",response);
        }
        else if(password && !passwordPattern.test(password)){
            logger.error("Error occured while updating user : Password should be alphanumeric with special characters and at least 6 characters long");
            setErrorResponse(400,"Password should be alphanumeric with special characters and at least 6 characters long",response);
        } else {
            const allowedFields = ["first_name", "last_name", "password"];
            const invalidFields = Object.keys(request.body).filter(val => !allowedFields.includes(val));
            if (invalidFields.length > 0) {
                logger.error(`Error occured while updating user : Invalid fields - ${invalidFields.join(', ')} to update`);
                setErrorResponse(400, `Invalid fields - ${invalidFields.join(', ')} to update`, response);
            } else {
                const auth = request.headers.authorization;
                if (!auth || Object.keys(auth).length === 0) {
                    logger.error(`Error occured while updating user : Authentication credentials required`);
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
                        logger.info("User updated successfully");
                        response.status(204).send();
                    } else {
                        logger.error(`Error occured while updating user : Invalid credentials provided`);
                        setErrorResponse(401, "Invalid credentials provided", response);
                    }
                }
            }
        }
    } catch (err) {
        logger.error(`Error occured while updating user : Service Unavailable`);
        setErrorResponse(503, "Service Unavailable", response);
    }
}

export const methodCheck = async (request, response) => {
    response.set('Cache-Control', 'no-cache');
    logger.error(`Error occured while updating user : Requested method not allowed`);
    response.status(405).send();
}

