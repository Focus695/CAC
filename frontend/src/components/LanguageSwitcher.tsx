'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()

  const handleChangeLanguage = (lng: string) => {
    // For App Router, we can simply change the language without updating the URL path
    // This prevents the 404 issue while still providing the language switching functionality
    i18n.changeLanguage(lng);
  }

  return (
    <div className="font-serif text-sm">
      <span
        onClick={() => handleChangeLanguage(i18n.language === 'zh' ? 'en' : 'zh')}
        className={`cursor-pointer transition-all duration-300 ${
          i18n.language === 'zh' ? 'text-sandalwood underline decoration-2 underline-offset-4' : 'text-stone-500 hover:text-sandalwood'
        }`}
      >
        {i18n.language === 'zh' ? 'EN' : '中'}
      </span>
    </div>
  )
}
