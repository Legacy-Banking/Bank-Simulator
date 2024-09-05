import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import StoreProvider from './store/StoreProvider'; // Import your StoreProvider component

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-poppins'
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "LearntoBank",
  description: "LearntoBank is a simple-to-use online banking simulator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable}`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
