'use client'
// This provider is deprecated - SessionProvider is now in providers.tsx
// If you need custom auth logic, add it here but DO NOT wrap with SessionProvider again

export default function AuthProvider({
    children,
}: { children: React.ReactNode }) {
    return children
}