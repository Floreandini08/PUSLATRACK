import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PuslatTrack - Absensi & Monitoring Latihan Atlet Puslatkot & KONI",
    template: "%s | PuslatTrack",
  },
  description:
    "PuslatTrack adalah platform digital untuk absensi foto geotagging, pencatatan durasi latihan, dan monitoring aktivitas atlet Pusat Latihan Kota (Puslatkot) & KONI.",
  keywords: [
    "PuslatTrack",
    "Puslatkot",
    "KONI",
    "absensi atlet",
    "monitoring latihan",
    "manajemen olahraga",
  ],
  authors: [{ name: "Kelompok 1 Kelas 2025B - UNESA" }],
  openGraph: {
    title: "PuslatTrack - Modernisasi Absensi & Monitoring Latihan Atlet",
    description:
      "Absensi foto geotagging, rekapitulasi jam latihan otomatis, dan monitoring program latihan terintegrasi.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
