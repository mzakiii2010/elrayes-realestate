'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Building, Bed, Bath, Ruler, Layers, Sparkles } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from 'next/link'

export default function UnifiedCitiesPage() {
  const [citiesData, setCitiesData] = useState<any[]>([])
  const [siteTexts, setSiteTexts] = useState<any>({})
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: cities, error: citiesError } = await supabase
          .from('cities')
          .select('*')
          .order('display_order', { ascending: true })
          
        if (citiesError) throw citiesError

        const { data: properties, error: propsError } = await supabase.from('properties').select('*')
        if (propsError) throw propsError

        const { data: contentData, error: contentError } = await supabase.from('site_content').select('*')
        if (contentError) throw contentError

        if (contentData) {
          const textObj: any = {}
          contentData.forEach((item: any) => {
            textObj[item.key] = item.value
          })
          setSiteTexts(textObj)
        }

        const formatted = cities.map((city) => {
          const matchedProps = properties.filter((p) => p.city_id === city.id)
          return {
            ...city,
            properties: matchedProps
          }
        })

        setCitiesData(formatted)
        if (formatted.length > 0) {
          setSelectedCityId(formatted[0].id)
        }
      } catch (err) {
        console.error('خطأ في جلب بيانات المدن:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center" dir="rtl">
        <p className="text-gold font-bold text-lg">جاري تحميل المدن...</p>
      </div>
    )
  }

  const activeCity = citiesData.find((c) => c.id === selectedCityId)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir="rtl">
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pt-20 pb-20 space-y-12 max-w-[95%] xl:max-w-[1550px] mx-auto w-full">
        <div className="text-center space-y-4">
          <h1 className={`${siteTexts.cities_section_title_size || 'text-3xl md:text-5xl'} ${siteTexts.cities_section_title_color || 'text-white'} ${siteTexts.cities_section_title_font || 'font-extrabold'}`}>
            {siteTexts.cities_section_title || 'استكشف المدن والعقارات المتاحة'}
          </h1>
          <p className={`${siteTexts.cities_section_subtitle_size || 'text-sm md:text-base'} ${siteTexts.cities_section_subtitle_color || 'text-slate-400'} ${siteTexts.cities_section_subtitle_font || ''}`}>
            {siteTexts.cities_section_subtitle || 'اختر المدينة لعرض المشاريع والعقارات الخاصة بها مباشرة من لوحة التحكم.'}
          </p>
        </div>

        {/* أزرار المدن */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {citiesData.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCityId(city.id)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2 border ${
                selectedCityId === city.id
                  ? 'bg-gold text-slate-950 border-gold shadow-lg'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <MapPin className="size-4" />
              {city.name}
            </button>
          ))}
        </div>

        {/* عرض تفاصيل المدينة والعقارات */}
        {activeCity && (
          <div className="space-y-6 pt-4">
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{activeCity.name}</h2>
                <p className="text-slate-400 text-xs md:text-sm mt-1">{activeCity.description || 'أرقى المشاريع العقارية'}</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-xs font-bold">
                {activeCity.properties.length} عقار متاح
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeCity.properties.length > 0 ? (
                activeCity.properties.map((prop: any) => (
                  <div key={prop.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col transition hover:border-gold/50 shadow-xl">
                    
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                      <img
                        src={prop.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800'}
                        alt={prop.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span className="absolute right-3 top-3 bg-slate-950/80 backdrop-blur-md text-gold border border-gold/30 px-3 py-1 rounded-full text-xs font-bold">
                        {prop.type || 'سكني'}
                      </span>
                    </div>

                    <div className="p-5 flex flex-1 flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <MapPin className="size-3.5 text-gold" />
                          <span>{activeCity.name}</span>
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-gold transition">{prop.title}</h3>

                        <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950/50 p-3 text-xs text-slate-300 border border-slate-800/60 mt-3">
                          {prop.bedrooms && (
                            <div className="flex items-center gap-1.5">
                              <Bed className="size-3.5 text-gold" />
                              <span>{prop.bedrooms} غرف</span>
                            </div>
                          )}
                          {prop.bathrooms && (
                            <div className="flex items-center gap-1.5">
                              <Bath className="size-3.5 text-gold" />
                              <span>{prop.bathrooms} حمام</span>
                            </div>
                          )}
                          {prop.area && (
                            <div className="flex items-center gap-1.5">
                              <Ruler className="size-3.5 text-gold" />
                              <span>{prop.area} م²</span>
                            </div>
                          )}
                          {prop.floor && (
                            <div className="flex items-center gap-1.5">
                              <Layers className="size-3.5 text-gold" />
                              <span>الدور {prop.floor}</span>
                            </div>
                          )}
                          {prop.finishing && (
                            <div className="col-span-2 flex items-center gap-1.5 border-t border-slate-800/80 pt-2 mt-1">
                              <Sparkles className="size-3.5 text-gold" />
                              <span>{prop.finishing}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-slate-400">السعر المطلوب</span>
                          <span className="text-gold font-extrabold text-sm">
                            {prop.price ? `${prop.price.toLocaleString('ar-EG')} ج.م` : 'عند الطلب'}
                          </span>
                        </div>
                        <Link
                          href={`/properties/${prop.id}`}
                          className="rounded-xl bg-gold/10 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold hover:text-slate-950 transition"
                        >
                          التفاصيل
                        </Link>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 col-span-full bg-slate-900/40 border border-slate-900 rounded-2xl">
                  <p className="text-slate-400 text-sm">لا توجد عقارات مضافة لهذه المدينة حتى الآن.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}