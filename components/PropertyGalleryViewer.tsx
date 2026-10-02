'use client'
import { useState } from 'react'

export function PropertyGalleryViewer({ images, title, type }: { images: any[], title: string, type: string }) {
  // تنظيف وتجهيز الصور لتكون مصفوفة نظيفة من النصوص وبدون تكرار
  const cleanImages = Array.from(
    new Set(
      images
        .flat()
        .map((img) => (typeof img === 'string' ? img.trim() : ''))
        .filter(Boolean)
    )
  )

  const [activeImage, setActiveImage] = useState(cleanImages[0] || '')

  if (!cleanImages.length) return null

  return (
    <div className="space-y-4">
      {/* الصورة الرئيسية الكبرى */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900">
        <img
          src={activeImage || cleanImages[0]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <span className="absolute top-4 right-4 bg-slate-900/90 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
          {type || "عقار فاخر"}
        </span>
      </div>

      {/* معرض الصور المصغرة التفاعلي */}
      {cleanImages.length > 1 && (
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-200">معرض الصور ({cleanImages.length})</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {cleanImages.map((imgUrl: string, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveImage(imgUrl)}
                className={`relative w-28 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                  activeImage === imgUrl ? 'border-[#D4AF37] scale-105 shadow-lg' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}