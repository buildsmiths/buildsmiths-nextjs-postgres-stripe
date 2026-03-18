import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    // Add other protected routes here
  ],
};
