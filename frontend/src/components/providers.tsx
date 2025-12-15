import { ReactNode } from 'react'
import { AppProvider } from '@/contexts/AppContext'
import { UserProvider } from '@/contexts/UserContext'
import { CartProvider } from '@/contexts/CartContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UserProvider>
      <CartProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </CartProvider>
    </UserProvider>
  )
}
