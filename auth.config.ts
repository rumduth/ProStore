import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized: async ({ request, auth }: any) => {
      // Array of regex patterns of paths we want to protect
      const protectedPath = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      //Get pathname from request url

      const { pathname } = request.nextUrl;
      //Check if use is not authenticated ans assessing a protected route
      if (!auth && protectedPath.some((p) => p.test(pathname))) return false;

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
  },
};
