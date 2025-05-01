import Header from '@/components/ui/header';
import Nav from '@/components/ui/nav';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-start ">
      <Header />
      {children}
      <Nav />
    </div>
  );
}
