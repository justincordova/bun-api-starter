import cors from "cors";
import { ALLOWED_ORIGINS, NODE_ENV } from "../../config/env";

// CORS middleware configuration
const corsConfig = cors({
  origin:
    NODE_ENV === "production"
      ? ALLOWED_ORIGINS?.split(",").filter(Boolean) || []
      : "*",
  credentials: true,
});

export default corsConfig;
