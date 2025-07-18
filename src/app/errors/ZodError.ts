import { ZodError, ZodIssue } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
        const lastPath = issue?.path[issue.path.length - 1];
        return {
            path: typeof lastPath === "string" || typeof lastPath === "number" ? lastPath : String(lastPath),
            message: issue?.message
        };
    });
   const statusCode = 400;

   return{
    statusCode,
    message: "Zod Validation Error.",
    errorSources,
    
   }
}

export default handleZodError