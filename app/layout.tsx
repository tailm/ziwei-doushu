import type { Metadata } from 'next';

import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import PageTracker from '@/components/PageTracker';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';
import { OrganizationJsonLd, WebSiteJsonLd } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    default: '紫微研究 - AI紫微斗数排盘与命理解读',
    template: '%s | 紫微研究',
  },
  description: '紫微研究是基于倪海厦正宗紫微斗数体系的AI命理平台，提供紫微排盘、合盘、每日运势、测字抽签、AI面相手相、风水分析及修持打卡等综合服务',
  keywords: '紫微斗数, 倪海厦, 紫微排盘, 命盘, 命理, 14主星, 12宫位, 合盘, 每日运势, 测字, 抽签, 面相, 手相, 风水, 修持打卡',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '紫微研究 - AI紫微斗数排盘与命理解读',
    description: '基于倪海厦正宗紫微斗数体系，AI深度解读您的命盘格局、大限流年、感情事业财富健康全方位解析',
    url: SITE_URL,
    siteName: '紫微研究',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '紫微研究 - AI紫微斗数排盘与命理解读',
    description: '基于倪海厦正宗紫微斗数体系，AI深度解读您的命盘格局、大限流年、感情事业财富健康全方位解析',
  },
  // 站长平台验证（拿到 verification code 后填入对应字段，重新部署即可）
  verification: {
    // Google Search Console: 在 https://search.google.com/search-console 添加站点后获取
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: 在 https://www.bing.com/webmasters 添加站点后获取
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // 百度站长（等执照下来后）
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 站长（等执照下来后）
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>

      <body className="min-h-screen">
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PageTracker />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
