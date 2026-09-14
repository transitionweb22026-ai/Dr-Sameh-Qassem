import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const [logoBuffer, arabicFontBuffer] = await Promise.all([
    readFile(path.join(process.cwd(), "public/images/logo-icon.png")),
    isAr
      ? readFile(path.join(process.cwd(), "src/lib/fonts-static/Tajawal-Bold.ttf"))
      : Promise.resolve(null),
  ]);
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fbf9f4",
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(197,160,89,0.18) 0%, rgba(197,160,89,0) 45%), radial-gradient(circle at 85% 85%, rgba(10,42,34,0.12) 0%, rgba(10,42,34,0) 45%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 190,
            height: 190,
            backgroundColor: "#ffffff",
            borderRadius: 40,
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 45px rgba(10,42,34,0.15)",
            marginBottom: 36,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={130} height={130} alt="" />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "#0a2a22",
            marginBottom: 14,
            fontFamily: isAr ? "Tajawal" : undefined,
          }}
        >
          {siteConfig.name[isAr ? "ar" : "en"]}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 600,
            color: "#c5a059",
            fontFamily: isAr ? "Tajawal" : undefined,
          }}
        >
          {siteConfig.title[isAr ? "ar" : "en"]}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 44,
            fontSize: 22,
            color: "#22463e",
            opacity: 0.7,
          }}
        >
          {siteConfig.domain.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: arabicFontBuffer
        ? [{ name: "Tajawal", data: arabicFontBuffer, weight: 700, style: "normal" }]
        : [],
    }
  );
}
