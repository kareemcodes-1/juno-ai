import type { Metadata } from "next";
import ToastProvider from "../providers/toast-provider";
import AuthProvider from "../providers/provider";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AI chat bot",
  description:
    "Upload, transform, and optimize your images with AI-powered tools. Resize, crop, remove backgrounds, and more with AI transformations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ToastProvider />
      <AuthProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
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
    </>
  );
}
