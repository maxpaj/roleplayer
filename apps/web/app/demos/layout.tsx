export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container space-y-6 md:p-10 pb-16">{children}</div>;
}
