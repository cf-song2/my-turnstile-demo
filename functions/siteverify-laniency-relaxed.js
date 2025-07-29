export async function onRequest(context) {
    const body = await context.request.json();
    const token = body.token;
  
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "missing token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    const remoteip = context.request.headers.get("CF-Connecting-IP") || "";
  
    const formData = new URLSearchParams();
    formData.append("secret", context.env.TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", remoteip);
    formData.append("remoteip_leniency", "relaxed");
  
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
  
    const result = await verify.json();
    
    const response = {
      ...result,
      debug: {
        sentData: {
          response: token.substring(0, 20) + "...",
          remoteip: remoteip,
          remoteip_leniency: "relaxed",
          secret: "[HIDDEN]"
        },
        clientIP: remoteip
      }
    };
    
    return new Response(JSON.stringify(response), {
      status: result.success ? 200 : 403,
      headers: { "Content-Type": "application/json" }
    });
}