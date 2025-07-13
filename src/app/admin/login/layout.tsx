export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout overrides the admin layout for the login page
  // No sidebar, just the login form
  return children;
}
