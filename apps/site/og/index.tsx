import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const InterBold = await fetch("https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff").then((res) => res.arrayBuffer());
    const InterRegular = await fetch("https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff").then((res) => res.arrayBuffer());
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My default title';

    return new ImageResponse(
      (
<div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundImage: "url(https://siddharthsuresh.me/mesh-664.png)",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "2rem",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "88",
              fontWeight: "700",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              color: "#29fc9b",
              padding: "0 3rem"
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "20%",
            display: "flex",
            padding: "2rem",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#999",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: ".75rem",
            }}
          >
            <span
              style={{
                fontSize: "30",
                color: "#94a3b8",
                marginLeft: "1rem",
                marginTop: "6px",
              }}
            >
              siddharthsuresh.me
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "1rem",
                fontSize: "25",
              }}
            >
              <span
                style={{
                  color: "#94a3b8",
                }}
              >
                Siddharth Suresh
              </span>
              <span
                style={{
                  color: "#3178c6",
                }}
              >
                @siddhsuresh
              </span>
            </div>
          </div>
        </div>
      </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}