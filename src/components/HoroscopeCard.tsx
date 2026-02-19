import { ReactNode } from 'react';

interface HoroscopeCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
  icon?: ReactNode;
}

export default function HoroscopeCard({ title, subtitle, children, accentColor = '#7B61FF', icon }: HoroscopeCardProps) {
  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A0533 0%, #2D1B69 100%)',
        border: `1px solid ${accentColor}33`,
        boxShadow: `0 0 40px ${accentColor}18`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />
      <div className="flex items-start gap-4 mb-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}>
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-white font-bold text-lg" style={{ fontFamily: 'Cinzel, serif' }}>{title}</h3>
          {subtitle && <p className="text-purple-400 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="text-purple-100 leading-relaxed text-sm">
        {children}
      </div>
    </div>
  );
}
