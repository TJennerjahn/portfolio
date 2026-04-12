import { NextRequest, NextResponse } from "next/server";
import {
  getDecapStateCookieName,
  getGitHubScope,
  isDecapAuthConfigured,
} from "app/api/decap/shared";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");
  if (provider !== "github") {
    return new NextResponse("Invalid provider", { status: 400 });
  }

  if (!isDecapAuthConfigured()) {
    return new NextResponse(
      "Decap GitHub auth is not configured on this deployment.",
      { status: 500 },
    );
  }

  const state = crypto.randomUUID();
  const redirectUrl = new URL("https://github.com/login/oauth/authorize");
  redirectUrl.searchParams.set(
    "client_id",
    process.env.DECAP_GITHUB_CLIENT_ID as string,
  );
  redirectUrl.searchParams.set(
    "redirect_uri",
    `${request.nextUrl.origin}/api/decap/callback?provider=github`,
  );
  redirectUrl.searchParams.set("scope", getGitHubScope());
  redirectUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: getDecapStateCookieName(),
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/api/decap",
    maxAge: 60 * 10,
  });

  return response;
}

