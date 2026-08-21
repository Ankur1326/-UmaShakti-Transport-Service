export async function GET() {
  return Response.json({
    success: true,
    message: "Quotes API is available",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return Response.json({
      success: true,
      message: "Quote request received",
      data: body,
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: "Invalid request body",
      },
      { status: 400 }
    );
  }
}
