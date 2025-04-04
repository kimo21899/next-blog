import "./globals.css";
import {Poppins} from "next/font/google";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <header>
          <Navigation />
        </header>

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
