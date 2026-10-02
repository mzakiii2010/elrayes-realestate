'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import { ConsultationModal } from './consultation-modal'

export function PropertyActions({ property }: { property: any }) {
  const [isOpen, setIsOpen] = useState(false)

  // تجهيز رسالة الواتساب التلقائية متضمنة تفاصيل الإعلان والرابط الحالي
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappMessage = encodeURIComponent(
    `مرحباً، أنا مهتم بهذا العقار وأرغب في معرفة التفاصيل:\n` +
    `- عنوان الإعلان: ${property.title || 'بدون عنوان'}\n` +
    `- السعر: ${property.price ? property.price.toLocaleString('ar-EG') + ' ج.م' : 'عند الطلب'}\n` +
    `- رابط الإعلان: ${currentUrl}`
  );

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-2xl space-y-6">
        <div>
          <span className="text-xs text-slate-400 block mb-1">السعر المطلوب</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gold block">
            {property.price ? `${property.price.toLocaleString('ar-EG')} ج.م` : "عند الطلب"}
          </span>
        </div>

        <div className="space-y-3 border-t border-slate-800 pt-6">
          <a
            href={`https://wa.me/201099659555?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition text-sm"
          >
            <Phone className="size-4" /> تواصل عبر الواتساب
          </a>

          <button 
            onClick={() => setIsOpen(true)}
            className="w-full bg-gold hover:bg-gold/80 text-slate-950 font-bold py-3 px-4 rounded-xl transition text-center text-sm"
          >
            طلب استشارة عقارية
          </button>
        </div>
      </div>

      <ConsultationModal 
        propertyId={property.id} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}