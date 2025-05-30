export async function onRequest(context) {
    const body = await context.request.json();
    const token = body.token;
  
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "missing token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    const formData = new URLSearchParams();
    formData.append("secret", context.env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", context.request.headers.get("CF-Connecting-IP") || "");
  
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
  
    const result = await verify.json();
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  