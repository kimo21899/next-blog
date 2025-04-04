import Link from "next/link";
import "./globals.css";
import {Poppins} from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

// local font 로 폰트 지정방식
// import localFont from "next/font/local";
// const myFont = localFont({src: [
//   {
//     path: "../fonts/Poppins-Bold.ttf",
//     weight: "600",
//     style: "bold"
//   },
//   {
//     path: "../fonts/Poppins-Light.ttf",
//     weight: "200",
//     style: "light"
//   }
// ]});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        <header>
          <nav>
            <Link className="nav-link" href="/">Home</Link>
            <div>
              <Link className="nav-link" href="/register">Register</Link>
              <Link className="nav-link" href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>

        <main>
        {children}
        </main>

        <footer>
          footer
        </footer>
      </body>
    </html>
  );
}
