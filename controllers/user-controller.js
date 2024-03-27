import { addUser } from "../services/user-service.js";
import { setResponse, setErrorResponse } from "./response-handler.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { authentication } from "./authentication.js";
import { validate } from "./validation.js";
import logger from "./logger.js";
import { PubSub } from "@google-cloud/pubsub";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({
    override: true,
    path: path.join(__dirname, '../development.env')
});

const pubsub = new PubSub();
const topicName = 'projects/cloud-gcp-tf/topics/verify_email';

export const createUser = async (request, response) => {
    logger.debug({
        message: "User creation started",
        severity: 'DEBUG'
    });
    try {
        const isValid = validate(request.body);
        if (!isValid.isValid) {
            logger.error({
                message: `Error occured while creating user : ${isValid.errors.message}`,
                severity: 'ERROR'
            });
            setErrorResponse(isValid.errors?.code, isValid.errors, response)
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
            if (process.env.APP_ENV == 'test') {
                addedUser.is_verified = true
                addedUser.save();
            }
            let responseUser = {
                id: addedUser.id,
                username: addedUser.username,
                first_name: addedUser.first_name,
                last_name: addedUser.last_name,
                account_created: addedUser.account_created,
                account_updated: addedUser.account_updated

            }
            logger.info({
                message: `User creation successful - ${responseUser.username}`,
                severity: 'INFO'
            });
            logger.debug({
                message: `User creation completef`,
                severity: 'DEBUG'
            });
            if (process.env.APP_ENV == 'prod') {
                let data = {
                    username: addedUser.username
                }
                console.log(data);
                const sendData = JSON.stringify(data);
                const dataBuffer = Buffer.from(sendData);
                try {
                    const messageId = await pubsub
                        .topic(topicName)
                        .publishMessage({ data: dataBuffer });
                    logger.info({
                        message: `Message published: ${messageId}`,
                        severity: 'INFO'
                    })
                } catch (error) {
                    logger.error({
                        message: `Error occured while publishing message : ${error.message}`,
                        severity: 'ERROR'
                    });
                }
            }
            response.status(201).send(responseUser);
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            logger.error({
                message: `Error occured while creating user : Username (or) Email already exists`,
                severity: 'ERROR'
            });
            setErrorResponse(400, "Username (or) Email already exists", response);
        } else {
            logger.error({
                message: `Error occured while creating user : ${err}`,
                severity: 'ERROR'
            });
            setErrorResponse(503, err, response);
        }
    }
}

export const getUser = async (request, response) => {
    logger.debug({
        message: "Fetching user started",
        severity: 'DEBUG'
    });
    try {
        const auth = request.headers.authorization;
        if (!auth || Object.keys(auth).length === 0) {
            logger.error({
                message: `Error occured while fetching user : Authentication credentials required`,
                severity: 'ERROR'
            });
            setErrorResponse(400, "Authentication credentials required", response);
        } else if (Object.keys(request.body).length != 0 || Object.keys(request.query).length != 0) {
            logger.error({
                message: `Error occured while fetching user : Request body should not be sent`,
                severity: 'ERROR'
            });
            setErrorResponse(400, "Request body should not be sent", response);
        } else {
            const authenticatedUser = await authentication(auth);
            if (authenticatedUser) {
                if (!authenticatedUser.is_verified) {
                    setErrorResponse(401, "User is not verfied", response);
                } else {
                    let user = {
                        id: authenticatedUser.id,
                        username: authenticatedUser.username,
                        first_name: authenticatedUser.first_name,
                        last_name: authenticatedUser.last_name,
                        account_created: authenticatedUser.account_created,
                        account_updated: authenticatedUser.account_updated
                    }
                    logger.info({
                        message: `User fetched successfully - ${user.username}`,
                        severity: 'INFO'
                    });
                    logger.debug({
                        message: `User fetching completed`,
                        severity: 'DEBUG'
                    });
                    setResponse(user, response);
                }
            } else {
                logger.error({
                    message: `Error occured while fetching user : Invalid credentials provided`,
                    severity: 'ERROR'
                });
                setErrorResponse(401, "Invalid credentials provided", response);
            }
        }
    } catch (err) {
    logger.error({
        message: `Error occured while fetching user : ${err}`,
        severity: 'ERROR'
    });
    setErrorResponse(503, err, response);
}
}

export const updateUser = async (request, response) => {
    logger.debug({
        message: "Updating user started",
        severity: 'DEBUG'
    });
    response.set('Cache-Control', 'no-cache');
    try {
        const { first_name, last_name, password } = request.body;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/;
        logger.warn({
            message: "Multiple nested if/else conditions exists, consider refactoring in future.",
            severity: 'WARN'
        });
        if (!Object.values(request.body).every(val => {
            return typeof val === 'string' && val.trim() !== '' && val !== null;
        })) {
            logger.error({
                message: "Error occured while updating user : Payload values should not be empty/null",
                severity: 'ERROR'
            });
            setErrorResponse(400, "Payload values should not be empty/null", response);
        }
        else if (password && !passwordPattern.test(password)) {
            logger.error({
                message: "Error occured while updating user : Password should be alphanumeric with special characters and at least 6 characters long",
                severity: 'ERROR'
            });
            setErrorResponse(400, "Password should be alphanumeric with special characters and at least 6 characters long", response);
        } else {
            const allowedFields = ["first_name", "last_name", "password"];
            const invalidFields = Object.keys(request.body).filter(val => !allowedFields.includes(val));
            if (invalidFields.length > 0) {
                logger.error({
                    message: `Error occured while updating user : Invalid fields - ${invalidFields.join(', ')} to update`,
                    severity: 'ERROR'
                });
                setErrorResponse(400, `Invalid fields - ${invalidFields.join(', ')} to update`, response);
            } else {
                const auth = request.headers.authorization;
                if (!auth || Object.keys(auth).length === 0) {
                    logger.error({
                        message: `Error occured while updating user : Authentication credentials required`,
                        severity: 'ERROR'
                    });
                    setErrorResponse(400, "Authentication credentials required", response);
                } else {
                    const authenticatedUser = await authentication(auth);
                    if (authenticatedUser) {
                        if (!authenticatedUser.is_verified) {
                            setErrorResponse(401, "User is not verfied", response);
                        } else {
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
                            logger.info({
                                message: `User updated successfully - ${authenticatedUser.username}`,
                                severity: 'INFO'
                            });
                            logger.debug({
                                message: `Update user completed`,
                                severity: 'DEBUG'
                            });
                            response.status(204).send();
                        }
                    } else {
                        logger.error({
                            message: `Error occured while updating user : Invalid credentials provided`,
                            severity: 'ERROR'
                        });
                        setErrorResponse(401, "Invalid credentials provided", response);
                    }
                }
            }
        }
    } catch (err) {
        logger.error({
            message: `Error occured while updating user : Service Unavailable`,
            severity: 'ERROR'
        });
        setErrorResponse(503, "Service Unavailable", response);
    }
}

export const methodCheck = async (request, response) => {
    logger.debug({
        message: "Updating user started",
        severity: 'DEBUG'
    });
    response.set('Cache-Control', 'no-cache');
    logger.error({
        message: `Error occured while updating user : Requested method not allowed`,
        severity: 'ERROR'
    });
    response.status(405).send();
}

