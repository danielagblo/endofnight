// This layout ensures the login page doesn't use the admin layout or navbar
// It bypasses the admin layout's authentication check
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {children}
    </div>
  )
}

