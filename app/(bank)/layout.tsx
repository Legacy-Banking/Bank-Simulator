import BankNavbar from "@/components/BankNavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BankNavbar/>
        <main>{children}</main>
      </body>
    </html>
  );
}
