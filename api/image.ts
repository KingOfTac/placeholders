import sharp from 'sharp';

export async function GET(request: Request) {
  const url = new URL(request.url);
  let width, height;

  try {
    width = Number(url.searchParams.get('width')) ?? 300;
    height = Number(url.searchParams.get('height')) ?? 200;
  } catch (error) {
    return new Response('Invalid width or height', { status: 400 });
  }

  try {
    const imageBuffer = await sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    })
      .webp()
      .toBuffer();

    const response = new Response(
      imageBuffer,
      {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      }
    );

    return response;
  } catch (error) {
    return new Response('Error processing image', { status: 500 });
  }
}