/** @format */

import { AvailablePermissions } from "../auth/permissions";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        permissions: string[];
      };
    }
  }
}
