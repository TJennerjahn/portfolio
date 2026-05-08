export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="antialiased max-w-xl md:max-w-4xl mx-4 md:mx-auto">
      {children}
    </div>
  );
}
