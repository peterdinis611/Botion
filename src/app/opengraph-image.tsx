import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(145deg, #1a1f1e 0%, #0f1413 55%, #1c2a28 100%)",
          color: "#f4f1ea",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#3d8b7a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 700,
              color: "#f4f1ea",
            }}
          >
            B
          </div>
          <span style={{ fontSize: "42px", fontWeight: 700 }}>Botion</span>
        </div>
        <p style={{ fontSize: "52px", fontWeight: 700, lineHeight: 1.15, maxWidth: "900px" }}>
          All-in-one workspace for notes, graphs, and calendar
        </p>
        <p style={{ fontSize: "28px", color: "#b8c4be", marginTop: "24px", maxWidth: "820px" }}>
          {siteConfig.tagline}
        </p>
      </div>
    ),
    { ...size },
  );
}
