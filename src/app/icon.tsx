import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1510",
          borderRadius: "50%",
          border: "1px solid #c9a876",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 120 120" fill="none">
          <path
            d="M60,90 C46,74 46,42 60,14 C74,42 74,74 60,90 Z"
            stroke="#3a8a96"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <path
            d="M60,90 C50,80 49,58 58,38 C67,58 70,80 60,90 Z"
            stroke="#3a8a96"
            strokeWidth="5"
            strokeLinejoin="round"
            transform="rotate(-34 60 90)"
          />
          <path
            d="M60,90 C50,80 49,58 58,38 C67,58 70,80 60,90 Z"
            stroke="#3a8a96"
            strokeWidth="5"
            strokeLinejoin="round"
            transform="rotate(34 60 90)"
          />
        </svg>
      </div>
    ),
    size
  );
}
