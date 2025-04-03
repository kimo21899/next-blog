import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body lang="en">
        <header>
          <nav>Nav</nav>
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
