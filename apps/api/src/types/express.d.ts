// ---------------------------------------------------------------------------
// Extend Express Request interface to include authenticated user data
// ---------------------------------------------------------------------------

declare namespace Express {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
      name: string;
    };
  }
}
