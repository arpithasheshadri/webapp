import logger from "./logger.js";

export const validate = (payload = {}) => {
    logger.debug({
        message: "Validating payload started",
        severity: 'DEBUG'
      });
    if (!payload || typeof payload !== 'object') {
        return {
            isValid: false,
            errors: {
                code: 400,
                message: 'Payload is missing or invalid'
            }
        };
    }
    const requiredFields = ['username', 'password', 'first_name', 'last_name'];

    const missingFields = requiredFields.filter(field => !payload.hasOwnProperty(field));
    if (missingFields.length > 0) {
        logger.debug({
            message: "Validating payload unsuccessful",
            severity: 'DEBUG'
          });
        return {
            isValid: false,
            errors: {
                code: 400,
                message: `Payload is missing required fields: ${missingFields.join(', ')}`
            }
        };
    }
    const { username, password, first_name, last_name, ...extraFields } = payload;

    const hasExtraFields = Object.keys(extraFields).length > 0;
    if (hasExtraFields) {
        logger.debug({
            message: "Validating payload unsuccessful",
            severity: 'DEBUG'
          });
        return {
            isValid: false,
            errors: {
                message: 'Payload contains extra fields'
            }
        };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,}$/;

    

    const isEmail = emailPattern.test(username);

     const isPasswordValid = passwordPattern.test(password);

    const isFirstnameString = typeof first_name === 'string';
    const isLastnameString = typeof last_name === 'string';

    const isValid = isEmail && isPasswordValid && isFirstnameString && isLastnameString;
    logger.debug({
        message: `Validating payload completed with status - ${isValid}`,
        severity: 'DEBUG'
      });
    return {
        isValid,
        errors: {
            username: !isEmail ? 'Username should be a valid email' : "valid",
            password: !isPasswordValid ? 'Password should be alphanumeric with special characters and at least 6 characters long' : "valid",
            first_name: !isFirstnameString ? 'First name should be a string' : "valid",
            last_name: !isLastnameString ? 'Last name should be a string' : "valid"
        }
    };
}
