'use client'

import { ReactNode } from 'react'
import { AppProvider } from '@/contexts/AppContext'
import { UserProvider } from '@/contexts/UserContext'
import { CartProvider } from '@/contexts/CartContext'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n' // Import the initialized i18n instance

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <UserProvider>
        <AppProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AppProvider>
      </UserProvider>
    </I18nextProvider>
  )
}

