import { QueryProvider } from "@/providers/QueryProvider";
import { Header } from "@/components/marketing/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <Header />
      <div className="pt-16 min-h-screen bg-gray-50">
        {children}
      </div>
    </QueryProvider>
  );
}
