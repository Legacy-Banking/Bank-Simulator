import RootNavbar from "@/components/RootNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <RootNavbar/>
      {children}
    </main>
  )
}