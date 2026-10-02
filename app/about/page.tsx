'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Target, Users } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function AboutPage() {
  const [siteTexts, setSiteTexts] = useState<any>({})

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('site_content').select('*')
      if (data) {
        const textObj: any = {}
        data.forEach((item: any) => {
          textObj[item.key] = item.value
        })
        setSiteTexts(textObj)
      }
    }
    fetchContent()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between" dir="rtl">
      {/* استدعاء الهيدر العلوي */}
      <SiteHeader />

      <main className="mx-auto max-w-5xl space-y-16 pt-36 pb-20 px-4 sm:px-6 lg:px-8 w-full">
        {/* المقدمة */}
        <div className="text-center space-y-4">
          <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">
            من نحن
          </span>
          
          <h1 className={`flex flex-wrap items-center justify-center gap-3 ${siteTexts.about_main_title_size || 'text-3xl sm:text-5xl'} ${siteTexts.about_main_title_font || 'font-black'}`}>
            <span className={siteTexts.about_title_part1_color || 'text-white'}>
              {siteTexts.about_title_part1 || 'شركة'}
            </span>
            <span className={siteTexts.about_title_part2_color || 'text-[#D4AF37]'}>
              {siteTexts.about_title_part2 || 'M and M Realestate Marketing'}
            </span>
          </h1>

          <p className={`max-w-2xl mx-auto leading-relaxed ${siteTexts.about_description_size || 'text-sm sm:text-base'} ${siteTexts.about_description_color || 'text-slate-400'} ${siteTexts.about_description_font || ''}`}>
            {siteTexts.about_description || 'نحن شركة متخصصة في التسويق العقاري لعقارات إعادة البيع (Resale). من خلال منصة الريس (El Rayes)، نقدم تجربة بحث وعرض متكاملة تضمن للمشتري والبائع أعلى درجات الموثوقية والأمان.'}
          </p>
        </div>

        {/* مميزاتنا الأساسية */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white">شفافية وموثوقية</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نحرص على عرض تفاصيل دقيقة ومحدثة لكل عقار لضمان بناء علاقة ثقة مستدامة مع عملائنا.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Target className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white">خبرة بسوق الريسيل</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نمتلك رؤية تحليلية لسوق العقارات بمختلف المدن والمناطق الحيوية لمساعدتك في اتخاذ القرار المناسب.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 sm:col-span-2 lg:col-span-1 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Users className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-white">متابعة واستجابة سريعة</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              نظام CRM متطور لضمان سرعة الرد على كافة استفسارات العملاء وتقديم الدعم المتكامل طوال رحلة الشراء.
            </p>
          </div>
        </div>

        {/* رؤيتنا */}
        <div className="bg-gradient-to-l from-slate-900 to-slate-900/50 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6 shadow-xl">
          <h2 className="text-2xl font-bold text-gold">رؤيتنا ورسالتنا</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            نسعى في <strong>M and M Realestate Marketing</strong> لأن نكون الخيار الأول لكل من يبحث عن التميز في سوق عقارات إعادة البيع. منصة <strong>الريس (El Rayes)</strong> صُممت خصيصاً لتسهيل عملية التواصل وربط العملاء بالفرص العقارية الحقيقية بأعلى معايير الكفاءة المهنية.
          </p>
        </div>
      </main>

      {/* استدعاء الفوتر */}
      <SiteFooter />
    </div>
  )
}