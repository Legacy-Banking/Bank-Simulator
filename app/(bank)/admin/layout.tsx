import AdminSideBar from "@/components/AdminSideBar";
import BankNavbar from "@/components/BankNavbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <BankNavbar/>
        <div className="flex">
          <AdminSideBar/>
          <main className="bg-[#FCFCFD] flex flex-auto border-[#D7D7D7] border-x-2">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}