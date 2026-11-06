import Link from 'next/link';

export default function StaticFooter() {
  return (
    <footer className="relative z-10 py-8 px-6" style={{ borderTop: '1px solid rgba(184,146,42,0.1)' }}>
      <div className="text-center">
        <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(184,146,42,0.5)', opacity: 0.85 }}>
          本平台基于中国传统文化研究，不构成医疗、投资、法律或重大决策建议
        </p>
        <p className="text-[10px] tracking-wider" style={{ color: 'rgba(184,146,42,0.5)' }}>
          <Link href="/terms" style={{ color: 'rgba(184,146,42,0.5)', textDecoration: 'underline' }}>服务条款</Link>
          {' · '}
          <Link href="/privacy" style={{ color: 'rgba(184,146,42,0.5)', textDecoration: 'underline' }}>隐私政策</Link>
        </p>
      </div>
    </footer>
  );
}