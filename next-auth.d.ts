import "next-auth/jwt";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin" | "user";
  }
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    publicKey?: string;
    user: {
      name?: string | null;
      image?: string | null;
      address?: string;
    };
  }
}
