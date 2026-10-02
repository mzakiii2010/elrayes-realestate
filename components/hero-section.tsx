'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function HeroSection({ cities = [] }: { cities?: any[] }) {
  const router = useRouter()
  const [location, setLocation] = useState('all')
  const [type, setType] = useState('all')

  const [heroContent, setHeroContent] = useState({
    hero_title: '',
    hero_title_size: 'text-4xl md:text-6xl',
    hero_title_color: 'text-white',
    hero_title_font: 'font-[family-name:var(--font-cairo)]',

    hero_subtitle: '',
    hero_subtitle_size: 'text-lg',
    hero_subtitle_color: 'text-slate-400',
    hero_subtitle_font: 'font-[family-name:var(--font-tajawal)]',
  })

  useEffect(() => {
    async function fetchHeroContent() {
      const { data } = await supabase.from('site_content').select('*')
      if (data) {
        const textObj: any = {}
        data.forEach((item: any) => {
          textObj[item.key] = item.value
        })
        setHeroContent(prev => ({ ...prev, ...textObj }))
      }
    }
    fetchHeroContent()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location && location !== 'all') params.set('location', location)
    if (type && type !== 'all') params.set('type', type)
    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="relative py-20 px-6 text-center bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* العنوان الرئيسي بخطه الخاص */}
        <h1 className={`${heroContent.hero_title_size} ${heroContent.hero_title_color} ${heroContent.hero_title_font} font-extrabold leading-tight transition-all`}>
          {heroContent.hero_title}
        </h1>
        
        {/* النص الفرعي بخطه الخاص */}
        <p className={`${heroContent.hero_subtitle_size} ${heroContent.hero_subtitle_color} ${heroContent.hero_subtitle_font}`}>
          {heroContent.hero_subtitle}
        </p>

        {/* نموذج البحث مع ضبط اتجاه الـ RTL وحفظ الترتيب */}
        <form 
          suppressHydrationWarning
          onSubmit={handleSearch} 
          dir="rtl" 
          className="flex flex-wrap items-center justify-center gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 max-w-2xl mx-auto shadow-2xl font-[family-name:var(--font-cairo)]"
        >
          <select 
            suppressHydrationWarning
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none flex-1 min-w-[140px]"
          >
            <option value="all">كل المدن</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>

          <select 
            suppressHydrationWarning
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none flex-1 min-w-[140px]"
          >
            <option value="all">نوع العقار</option>
            <option value="شقة">شقة</option>
            <option value="فيلا">فيلا</option>
            <option value="بينتهاوس">بينتهاوس</option>
          </select>

          <button 
            type="submit" 
            className="bg-[#D4AF37] text-slate-950 font-bold px-8 py-3 rounded-xl hover:bg-[#b8952b] transition text-sm min-w-[100px]"
          >
            بحث
          </button>
        </form>
      </div>
    </section>
  )
}