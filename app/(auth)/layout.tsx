import BankNavbar from "@/components/BankNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <BankNavbar/>
        <main className="min-h-screen flex flex-col items-center bg-yellow-25">
          {children}
        </main>
      </body>
    </html>
  )
}