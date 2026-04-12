import { NextRequest, NextResponse } from "next/server";
import {
  getDecapStateCookieName,
  isDecapAuthConfigured,
} from "app/api/decap/shared";

export const dynamic = "force-dynamic";

function createCallbackResponse(
  status: "success" | "error",
  payload: Record<string, string>,
) {
  const serializedPayload = JSON.stringify(payload).replace(/</g, "\\u003c");

  return new NextResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Decap Authorization</title>
    <script>
      const receiveMessage = () => {
        window.opener.postMessage(
          'authorization:github:${status}:${serializedPayload}',
          '*'
        );
        window.removeEventListener('message', receiveMessage, false);
        window.close();
      };

      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    </script>
  </head>
  <body>
    <p>Authorizing Decap...</p>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider");
  if (provider !== "github") {
    return new NextResponse("Invalid provider", { status: 400 });
  }

  if (!isDecapAuthConfigured()) {
    return createCallbackResponse("error", {
      error: "Decap GitHub auth is not configured on this deployment.",
    });
  }

  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(getDecapStateCookieName())?.value;
  if (!state || !storedState || state !== storedState) {
    return createCallbackResponse("error", {
      error: "Invalid OAuth state.",
    });
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return createCallbackResponse("error", {
      error: "Missing OAuth code.",
    });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.DECAP_GITHUB_CLIENT_ID,
      client_secret: process.env.DECAP_GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${request.nextUrl.origin}/api/decap/callback?provider=github`,
    }),
    cache: "no-store",
  });

  const tokenPayload = await tokenResponse.json();

  if (!tokenResponse.ok || tokenPayload.error || !tokenPayload.access_token) {
    return createCallbackResponse("error", {
      error:
        tokenPayload.error_description ||
        tokenPayload.error ||
        "GitHub token exchange failed.",
    });
  }

  const response = createCallbackResponse("success", {
    token: tokenPayload.access_token,
  });
  response.cookies.set({
    name: getDecapStateCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/api/decap",
    maxAge: 0,
  });

  return response;
}

