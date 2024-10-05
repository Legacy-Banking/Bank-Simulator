import RootNavbar from "@/components/RootNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <RootNavbar/>
        <main className="min-h-screen flex flex-col items-center bg-yellow-25">
          {children}
        </main>
      </div>
  )
}