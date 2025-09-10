import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "./providers/toast-provider";
import AuthProvider from "./providers/provider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Juno AI Agent for your business",
  description:
    "Create and manage AI agents that adapt to your business needs. Customize their roles, instructions, and appearance to deliver personalized, intelligent support across your workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <ToastProvider />
        <AuthProvider>
                    {children}
        </AuthProvider>

         <Script
                id="chat-widget"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(){
                      var script = document.createElement("script");
                      script.src = "http://localhost:3000/widget.js"; // your widget bundle
                      script.async = true;
                      script.setAttribute("data-workspace-url", "test-url");
                       script.setAttribute("data-agent-id", "68bd73787e4cf74e0c293906");
                       document.body.appendChild(script);
                    })();
                  `,
                }}
              />
      </body>
    </html>
  );
}
