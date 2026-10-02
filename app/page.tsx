'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MapPin, Bed, Bath, Ruler, Layers, Sparkles, ArrowUpDown, Search } from 'lucide-react'
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/hero-section"
import Link from 'next/link'

function HomeContent() {
  const searchParams = useSearchParams()
  const selectedLocation = searchParams.get('location') || 'all'
  const selectedType = searchParams.get('type') || 'all'

  const [citiesData, setCitiesData] = useState<any[]>([])
  const [propertiesData, setPropertiesData] = useState<any[]>([])
  const [siteTexts, setSiteTexts] = useState<any>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function fetchData() {
      try {
        const { data: cities, error: citiesError } = await supabase.from('cities').select('*')
        if (citiesError) throw citiesError

        const { data: properties, error: propsError } = await supabase
          .from('properties')
          .select('*')
        if (propsError) throw propsError

        // جلب جميع العقارات كما هي تماماً وبدون أي شروط تقييدية
        setPropertiesData(properties || [])

        const { data: contentData, error: contentError } = await supabase.from('site_content').select('*')
        if (contentError) throw contentError

        setCitiesData(cities || [])

        if (contentData) {
          const textObj: any = {}
          contentData.forEach((item: any) => {
            textObj[item.key] = item.value
          })
          setSiteTexts(textObj)
        }
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProperties = propertiesData.filter((prop: any) => {
    const matchesLocation = selectedLocation === 'all' || String(prop.city_id) === String(selectedLocation)
    const matchesType = selectedType === 'all' || prop.type?.toLowerCase() === selectedType.toLowerCase()
    const matchesSearch = searchQuery === '' || 
      prop.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.type?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesLocation && matchesType && matchesSearch
  }).sort((a: any, b: any) => {
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0)
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0)
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  })

  const currentCityObj = citiesData.find(c => String(c.id) === String(selectedLocation))

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold">جاري التحميل...</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-col" dir="rtl">
      <SiteHeader />

      <main className="flex-1 space-y-10 pb-16 pt-18">
        <HeroSection cities={citiesData} />

        <section className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                suppressHydrationWarning
                placeholder={currentCityObj ? `ابحث في عقارات ${currentCityObj.name}...` : "ابحث في العقارات المتاحة..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white focus:outline-none focus:border-gold transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ArrowUpDown className="size-4 text-gold" />
              <span className="text-xs text-slate-400">ترتيب حسب:</span>
              <select
                suppressHydrationWarning
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold transition"
              >
                <option value="newest">الأحدث</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className={`${siteTexts.properties_section_title_size || 'text-xl'} ${siteTexts.properties_section_title_color || 'text-white'} ${siteTexts.properties_section_title_font || 'font-bold'}`}>
                {currentCityObj ? currentCityObj.name : (siteTexts.properties_section_title || "جميع العقارات والمشاريع المتاحة")}
              </h3>
              <p className={`${siteTexts.properties_section_subtitle_size || 'text-xs'} ${siteTexts.properties_section_subtitle_color || 'text-slate-400'} ${siteTexts.properties_section_subtitle_font || ''} mt-1`}>
                {currentCityObj ? (currentCityObj.description || 'أرقى المشاريع العقارية بالمدينة') : (siteTexts.properties_section_subtitle || 'استعرض أحدث العقارات المتاحة للتسوق الفوري')}
              </p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold">
              {filteredProperties.length} عقار متاح
            </span>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-gold font-bold text-sm">جاري تحميل العقارات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((prop: any) => {
                  const propCity = citiesData.find(c => c.id === prop.city_id)
                  return (
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
                            <span>{propCity ? propCity.name : 'مصر'}</span>
                          </div>
                          <h4 className="font-bold text-base text-white group-hover:text-gold transition">{prop.title}</h4>

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
                  )
                })
              ) : (
                <div className="text-center py-16 col-span-full bg-slate-900/40 border border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-xs">لا توجد عقارات مطابقة لخيارات البحث الحالية.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold">جاري التحميل...</div>}>
      <HomeContent />
    </Suspense>
  )
}