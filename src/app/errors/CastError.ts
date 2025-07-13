import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleCastError = (err: any):TGenericErrorResponse => {
    const statusCode = 400;
    const errorSources: TErrorSource = [{
        path: err?.path,
        message: err?.message
    }]

    return{
     statusCode,
     message: "Validation Error.",
     errorSources,
     
    }
};

export default handleCastError;