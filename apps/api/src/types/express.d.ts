// ---------------------------------------------------------------------------
// Extend Express Request interface to include authenticated user data
// ---------------------------------------------------------------------------

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
    };
  }
}
