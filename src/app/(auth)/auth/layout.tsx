import type { Metadata } from "next";
import AuthProvider from "../../providers/provider";
import ToastProvider from "../../providers/toast-provider";

type LayoutProps = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: `Authenication | Juno`,
    description: `Sign in to Juno`,
  };
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <ToastProvider />
      {children}
    </AuthProvider>
  )
}

