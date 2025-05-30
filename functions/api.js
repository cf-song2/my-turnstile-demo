export async function onRequest(context) {
  return new Response(JSON.stringify({ message: "API 요청 성공!" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

