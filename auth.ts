import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma/prisma";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      authorize: async (credentials) => {
        if (credentials == null) return null;
        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });
        // Check if the user exists and the password matches
        if (user) {
          const isMatch = await compare(
            credentials.password as string,
            user.password as string
          );
          if (isMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ request, auth }: any) => {
      //Checl for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        //Generate new session Cart Id cookie
        const sessionCartId = crypto.randomUUID();
        //clone the req headers
        // const newRequestHeaders = new Headers(request.headers);

        //Create new response and add the new headers
        // const response = NextResponse.next({
        //   request: {
        //     headers: newRequestHeaders,
        //   },
        // });
        const response = NextResponse.next();
        //set newly generated sessionCartId
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      } else return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        //If use has no name, then use the email
        if (user.name === "NO_NAME") {
          token.name = user.email.split("@")[0];
        }

        //Update database to reflect the token name
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: { name: token.name },
        });
      }
      return token;
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      //Set the user ID from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      //If there is an update, set the user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
});
