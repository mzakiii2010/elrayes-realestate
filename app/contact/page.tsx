'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Phone, MessageSquare, MapPin, Clock, ArrowLeft } from 'lucide-react'

export default function ContactPage() {
  const [siteTexts, setSiteTexts] = useState<any>({})
  
  const whatsappNumber = '201099659555'
  const callNumbers = ['01000088960', '01099659555']
  const facebookUrl = 'https://www.facebook.com/Elrayes960/'

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
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 w-full space-y-12">
        {/* رأس الصفحة */}
        <div className="text-center space-y-4">
          <span className="bg-gold/10 text-gold text-xs px-3 py-1 rounded-full font-bold border border-gold/20">
            تواصل معنا
          </span>
          <h1 className={`${siteTexts.contact_title_size || 'text-3xl sm:text-4xl'} ${siteTexts.contact_title_color || 'text-white'} ${siteTexts.contact_title_font || 'font-extrabold'}`}>
            {siteTexts.contact_title || 'نحن هنا لمساعدتك في إيجاد عقارك المثالي'}
          </h1>
          <p className={`max-w-xl mx-auto ${siteTexts.contact_subtitle_size || 'text-sm'} ${siteTexts.contact_subtitle_color || 'text-slate-400'} ${siteTexts.contact_subtitle_font || ''}`}>
            {siteTexts.contact_subtitle || 'تواصل معنا عبر وسائل الاتصال المباشرة أدناه، وسيكون فريق المبيعات جاهزاً للرد على استفساراتكم في أسرع وقت.'}
          </p>
        </div>

        {/* شبكة خيارات الاتصال */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* بطاقة الواتساب المباشر */}
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl transition group flex flex-col justify-between space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition">
                <MessageSquare className="size-8" />
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                متاح الآن
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">
                محادثة واتساب سريعة
              </h3>
              <p className="text-slate-400 text-xs">
                تحدث مباشرة مع خدمة العملاء عبر تطبيق الواتساب للاستفسار عن التفاصيل.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-emerald-400 font-bold text-xs">
              <span className="dir-ltr">+20 109 965 9555</span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition">
                ابدأ المحادثة <ArrowLeft className="size-3.5" />
              </span>
            </div>
          </a>

          {/* بطاقة الاتصال الهاتفي */}
          <div className="bg-slate-900 border border-slate-800 hover:border-gold/50 rounded-2xl p-6 shadow-xl transition flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div className="bg-gold/10 text-gold p-4 rounded-2xl border border-gold/20">
                <Phone className="size-8" />
              </div>
              <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-bold border border-gold/20">
                اتصال مباشر
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">أرقام الاتصال</h3>
              <p className="text-slate-400 text-xs">
                اتصل بنا مباشرة في أي وقت وسيقوم ممثلنا بالرد عليك.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              {callNumbers.map((phone, idx) => (
                <a
                  key={idx}
                  href={`tel:${phone}`}
                  className="flex items-center justify-between text-gold font-bold text-xs bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700 transition"
                >
                  <span className="dir-ltr">{phone}</span>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    اتصل <Phone className="size-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* بطاقة صفحة الفيسبوك */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl transition group flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="bg-blue-500/10 text-blue-400 p-4 rounded-2xl border border-blue-500/20 group-hover:scale-110 transition">
                <svg className="size-8 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/20">
                تابعنا
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                صفحة الفيسبوك الرسمية
              </h3>
              <p className="text-slate-400 text-xs">
                تابع أحدث عروضنا العقارية وألبومات الصور عبر صفحتنا على فيسبوك.
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-blue-400 font-bold text-xs">
              <span>Elrayes Real Estate</span>
              <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition">
                زيارة الصفحة <ArrowLeft className="size-3.5" />
              </span>
            </div>
          </a>

        </div>

        {/* معلومات إضافية (عنوان، أوقات العمل) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-900">
          <div className="flex items-start gap-4 bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl">
            <div className="bg-gold/10 text-gold p-3 rounded-lg">
              <Clock className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ساعات العمل</h4>
              <p className="text-slate-400 text-xs mt-1">طوال أيام الأسبوع من الساعة 9 صباحاً حتى 10 مساءً</p>
            </div>
          </div>

          <div className="flex items-start gap-4 bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl">
            <div className="bg-gold/10 text-gold p-3 rounded-lg">
              <MapPin className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">مقر الشركة</h4>
              <p className="text-slate-400 text-xs mt-1">جمهورية مصر العربية - خدمة عقارية متكاملة</p>
            </div>
          </div>
        </div>

      </main>

      <SiteFooter />
    </div>
  )
}