import sharp from 'sharp';

export async function GET(request: Request) {
  const url = new URL(request.url);
  let width, height, text;

  try {
    width = parseInt(url.searchParams.get('width')!);
    height = parseInt(url.searchParams.get('height')!);
    text = url.searchParams.has('text');
  } catch (error) {
    return new Response('Invalid width or height', { status: 400 });
  }

  try {
    let image = sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 240, g: 240, b: 240 }
      }
    });

    if (text) {
      const svgImage = Buffer.from(`
        <svg width="${width}" height="${height}">
          <rect x="0" y="0" width="${width}" height="${height}" fill="transparent" />
          <text
            x="50%" y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-family="Arial"
            font-size="24"
            fill="black"
          >
            ${width} X ${height}
          </text>
        </svg>  
      `);
  
      image = image.composite([
        {
          input: svgImage,
          top: 0,
          left: 0,
        }
      ]);
    }

    const imageBuffer = await image.webp().toBuffer();

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