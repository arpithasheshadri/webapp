
export const setResponse = (data, response) => {
    response.status(200).json(data);
};
  
export const setErrorResponse = (errorCode, errorMessage, response) => {
    switch (errorCode) {
        case 400: {
          response.status(400).json({
            code: "BadRequest",
            message: errorMessage ? errorMessage : "Invalid request, check the payload.",
          });
          break;
        }
        case 401: {
          response.status(401).json({
            code: "UnauthorizedRequest",
            message: errorMessage ? errorMessage : "User is not authenticated to access the resource.",
          });
          break;
        }
        case 403: {
          response.status(403).json({
            code: "Forbidden",
            message: errorMessage ? errorMessage : "User already exists.",
          });
          break;
        }
        case 500: {
          response.status(500).json({
            code: "ServicesError",
            message: errorMessage ? errorMessage : "Error occured while processing your request.",
          });
          break;
        }
        case 503: {
            response.status(503).json({
              code: "ServicesError",
              message: errorMessage ? errorMessage : "Error occured while processing your request.",
            });
            break;
          }
        default:{
            response.status(errorCode?errorCode:400).json(errorMessage).send();
        }
      }
};
  