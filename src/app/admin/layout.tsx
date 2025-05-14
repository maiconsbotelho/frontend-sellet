import Nav from '@/components/shared/nav';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-start ">
      {children}
      <Nav />
    </div>
  );
}
