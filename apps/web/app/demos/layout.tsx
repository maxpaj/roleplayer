export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container hidden space-y-6 p-10 pb-16 md:block">
      {children}
    </div>
  );
}