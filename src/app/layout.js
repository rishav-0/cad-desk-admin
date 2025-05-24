
import "./globals.css";

// app/layout.js
import Sidebar from "../components/Sidebar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 overflow-auto p-8 ">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
