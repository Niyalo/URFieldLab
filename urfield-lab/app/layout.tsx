import type { Metadata } from "next";
import "./globals.css";
import "yet-another-react-lightbox/styles.css";

// Use CSS variables for font families instead of Google Fonts
// These are defined in globals.css

export const metadata: Metadata = {
  title: "URField Lab",
  description: "URField Lab - Research and Development Platform",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}