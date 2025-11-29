export async function POST(req) {
  try {
    const body = await req.json();

    if(body.title == "" || body.msg == ""){
        return new Response(JSON.stringify({
      success: false,
      error: "Title or Message is empty"
    }), { status: 500 });
    }

    return new Response(JSON.stringify({
      success: true,
      note: body
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: 500 });
  }
}
