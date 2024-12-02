/** @format */

import { ApiKeys, User } from "@prisma/client";
import { AvailablePermissions } from "../auth/permissions";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        permissions: string[];
      };

      apiKeyData?: ApiKeys;
    }
  }
}
