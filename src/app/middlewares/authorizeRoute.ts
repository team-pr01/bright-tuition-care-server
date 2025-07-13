import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/auth/auth.model";
import { routeAccessMap } from "../constants/routeAccessMap.constants";

const authorizeRoute = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to proceed!"
      );
    }

    // Extract token
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }

    // Fetch user to get assignedPages and role
    const user = await User.findById(decoded.userId).select(
      "assignedPages role"
    );

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }

    // Attach user info to request
    req.user = decoded;

    // 👇️ Construct and normalize current route
    let currentRoute = req.baseUrl + (req.route?.path ?? "");

    currentRoute = currentRoute.replace(/^\/api\/v[0-9]+/, "").replace(/\/$/, "");

    console.log(currentRoute);


    // Flatten allowed backend routes from assigned frontend pages
    const allowedRoutes = user!
      .assignedPages!.map(
        (frontendPath: string) => routeAccessMap[frontendPath] || []
      )
      .flat();
      console.log(allowedRoutes);

    if (!allowedRoutes.includes(currentRoute)) {
      throw new AppError(httpStatus.FORBIDDEN, "Access denied to this route");
    }

    next();
  });
};

export default authorizeRoute;
