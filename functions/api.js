export async function onRequest() {
  return new Response(JSON.stringify({ message: "🎉 API 요청 성공" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
