export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      HOME TOPBAR
      {children}
    </main>
  )
}