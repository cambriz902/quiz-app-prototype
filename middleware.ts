import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect all routes that start with /quizzes
  matcher: ["/quizzes/:path*"]
}; 