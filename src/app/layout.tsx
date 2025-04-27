import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { Layout as AntLayout } from 'antd';
import 'antd/dist/reset.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntLayout>
          <AuthProvider>{children}</AuthProvider>
        </AntLayout>
      </body>
    </html>
  );
}
