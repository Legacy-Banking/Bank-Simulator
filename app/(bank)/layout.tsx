export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      BANK TOPBAR
      {children}
    </main>
  )
}