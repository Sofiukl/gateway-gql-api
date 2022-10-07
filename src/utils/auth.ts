import jwt from "jsonwebtoken";

export function getCurrentUser(context: any) {
  // context = { ... headers }
  const authHeader = context.req.headers.authorization;
  console.log(`AUTH HEADER .... ${authHeader}`);
  if (authHeader) {
    // Bearer ....
    const token = authHeader.split("Bearer ")[1];
    if (!token) {
      console.log("Authentication token must be 'Bearer [token]");
      return null;
    }
    try {
      const user = jwt.verify(token, "my_secret_key");
      return user;
    } catch (err) {
      console.log("Invalid/Expired token");
    }
  }
  console.log("Authorization header is not provided!");
  return null;
}

export const isAuthenticated = (context: any) => {
  if (!context.currentUser) {
    throw new Error(`Unauthenticated!`);
  }
  return true;
};

export const isAuthorized = (context: any, role: any) => {
  isAuthenticated(context);
  if (context.currentUser.role !== role) {
    throw new Error(`Unauthorized!`);
  }

  return false;
};
