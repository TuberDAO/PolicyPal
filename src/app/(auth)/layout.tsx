/**
 * Auth layout — minimal chrome for sign-in flow.
 * Shows only logo and the auth form, no distractions.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      {children}
    </main>
  );
}
