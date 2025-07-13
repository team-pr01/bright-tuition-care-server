import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleValidationError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSource = Object.values(err.errors).map(
    (val: any) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  return {
    statusCode,
    message: "Zod Validation Error.",
    errorSources,
  };
};

export default handleValidationError;
