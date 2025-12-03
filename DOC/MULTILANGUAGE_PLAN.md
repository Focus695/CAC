# 多语言支持方案

## 一、技术选型
- **国际化框架**: react-i18next (灵活的翻译钩子和组件支持)
- **路由方案**: Next.js 13+ App Router 国际化路由
- **翻译文件**: JSON 格式 (易于维护和扩展)

## 二、实现步骤

### 1. 安装依赖
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. 配置 Next.js 国际化路由
在 `next.config.js` 中添加：
```javascript
module.exports = {
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    localeDetection: false,
  },
}
```

### 3. 创建翻译文件结构
```
/public
└── locales
    ├── zh
    │   └── common.json
    └── en
        └── common.json
```

### 4. 配置 i18next
创建 `src/lib/i18n.ts`：
```javascript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'zh',
    debug: false,
    resources: {
      zh: {
        common: require('../../public/locales/zh/common.json')
      },
      en: {
        common: require('../../public/locales/en/common.json')
      }
    },
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
```

### 5. 创建语言切换组件
```typescript
// src/components/LanguageSwitcher.tsx
'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()

  const handleChangeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    router.replace(`/${lng}${pathname}`)
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleChangeLanguage('zh')}
        className={`px-3 py-1 rounded ${i18n.language === 'zh' ? 'bg-sandalwood text-white' : 'bg-stone-200'}`}
      >
        中文
      </button>
      <button 
        onClick={() => handleChangeLanguage('en')}
        className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-sandalwood text-white' : 'bg-stone-200'}`}
      >
        English
      </button>
    </div>
  )
}
```

### 6. 在组件中使用翻译
修改需要国际化的组件：
```typescript
// 示例：CheckoutModal.tsx
import { useTranslation } from 'react-i18next'

const CheckoutModal = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h3 className="font-serif text-2xl text-sandalwood mb-8">{t('checkout.shippingAddress')}</h3>
      {/* 其他翻译内容 */}
    </div>
  )
}
```

### 7. 创建翻译文件内容
```json
// /public/locales/zh/common.json
{
  "checkout": {
    "shippingAddress": "收货雅址",
    "confirmPayment": "确认支付",
    "orderSummary": "雅物清单"
  },
  "order": {
    "orderNumber": "订单号",
    "status": "状态",
    "total": "总计"
  }
}

// /public/locales/en/common.json
{
  "checkout": {
    "shippingAddress": "Shipping Address",
    "confirmPayment": "Confirm Payment",
    "orderSummary": "Order Summary"
  },
  "order": {
    "orderNumber": "Order Number",
    "status": "Status",
    "total": "Total"
  }
}
```

## 三、注意事项
1. **SEO优化**: 确保每个语言版本的页面都有独立的meta标签
2. **动态内容**: 后端API需要支持多语言返回
3. **测试**: 确保所有组件在切换语言时都能正确更新

