import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  // mongoose ready-state
  const readyStateMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  const dbReadyState = mongoose.connection.readyState;
  const dbStatus = readyStateMap[dbReadyState] || "Unknown";

  // overall health based on database status
  const isHealthy = dbReadyState === 1;

  const healthStatus = {
    status: isHealthy ? "OK" : "FAIL",
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  };

  // HTTP status code based on health
  const httpStatus = isHealthy ? 200 : 503;

  // different messages based on health
  const message = isHealthy
    ? "Health check successful"
    : "Health check failed: Database connection issue";

  return res
    .status(httpStatus)
    .json(new ApiResponse(httpStatus, healthStatus, message));
});

export { healthCheck };
