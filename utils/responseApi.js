exports.success =(res,message, results,) => {
      return [
         res.status(res.statusCode).send({  
            status: res.statusCode,
            message,
            results,
          }
          )
         ] ;
    }
exports.success1 =(res,message,) => {
      return [
         res.status(res.statusCode).send({  
            message,
            status: res.statusCode,
          }
          )
         ] ;
    }

exports.error =(res,message, statusCode) => {
        
        const codes = [200, 201, 400, 401, 404, 403, 422, 500];
        const findCode = codes.find((code) => code == statusCode);
      
        if (!findCode) resstatusCode = 500;
        else statusCode = findCode;
      
        return [
           res.status(statusCode).send({  
              message,
             
              status: statusCode,
           
            }
            )
           ] ;
      }

  
  
  /**
   * @desc    Send any error response
   *
   * @param   {string} message
   * @param   {number} statusCode
   */
//   exports.error = (message, statusCode) => {
//     // List of common HTTP request code
//     const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  
//     // Get matched code
//     const findCode = codes.find((code) => code == statusCode);
  
//     if (!findCode) statusCode = 500;
//     else statusCode = findCode;
  
//     return {
//       message,
//       code: statusCode,
//       error: true
//     };
//   };
  
  /**
   * @desc    Send any validation response
   *
   * @param   {object | array} errors
   */
  exports.validation = (errors) => {
    return {
      message: "Validation errors",
      error: true,
      code: 422,
      errors
    };
  };