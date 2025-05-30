export async function onRequest(context) {
  const token = context.request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return new Response("Missing Turnstile token", { status: 403 });
  }

  const formData = new URLSearchParams();
  formData.append("secret", context.env.TURNSTILE_SECRET_KEY);
  formData.append("response", token);
  formData.append("remoteip", context.request.headers.get("CF-Connecting-IP") || "");

  const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  const result = await verify.json();

  if (!result.success) {
    return new Response("Invalid Turnstile token", { status: 403 });
  }

  return new Response(JSON.stringify({ message: "🎉 Turnstile 검증 성공" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
