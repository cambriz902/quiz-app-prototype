import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth.config";
import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

type CurrentUser = Pick<User, 'id' | 'name' | 'email'>;

// Use this when you need just the user ID
export async function getSessionUserId(): Promise<number | null> {
  try {
    const session = await getServerSession(authOptions);
    return session?.user?.id ? parseInt(session.user.id) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Keep this for when you need full user details
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const userId = await getSessionUserId();
    
    if (!userId) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    return currentUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}