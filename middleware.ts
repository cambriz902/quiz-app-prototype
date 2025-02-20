import { withAuth } from "next-auth/middleware";

export default withAuth(
  {
    callbacks: {
      authorized: ({ token }) => !!token 
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  // Protect multiple path patterns
  matcher: [
    '/quizzes/:path*',
    '/api/quizzes/:path*', 
    '/api/check-free-response-answer/:path*',
  ]
}; 