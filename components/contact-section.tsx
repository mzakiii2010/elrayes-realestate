'use client'

import { useState } from 'react'
import { Phone, MessageSquare, MapPin, Clock, CheckCircle2 } from 'lucide-react'

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const whatsappNumber = '201099659555'
  const callNumbers = ['01000088960', '01099659555']
  const facebookUrl = 'https://www.facebook.com/Elrayes960/'

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    e.currentTarget.reset()
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28" dir="rtl">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
        
        {/* معلومات الاتصال والروابط المباشرة */}
        <div className="space-y-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
              تواصل معنا
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              دعنا نجد لك العقار المثالي
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              اترك بياناتك وسيتواصل معك مستشار عقاري متخصص خلال 24 ساعة لعرض أفضل الفرص التي تناسب احتياجاتك وميزانيتك.
            </p>
          </div>

          <div className="space-y-4">
            {/* الواتساب */}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl transition group"
            >
              <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 group-hover:scale-110 transition">
                <MessageSquare className="size-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">محادثة واتساب سريعة</h4>
                <span className="text-emerald-400 text-xs dir-ltr block mt-0.5">+20 109 965 9555</span>
              </div>
            </a>

            {/* الاتصال الهاتفي */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-3 text-gold font-bold text-sm mb-2">
                <Phone className="size-5" /> أرقام الاتصال المباشر
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {callNumbers.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone}`}
                    className="bg-slate-800/80 hover:bg-slate-800 text-gold text-xs dir-ltr p-2.5 rounded-xl border border-slate-700 text-center font-bold transition block"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            {/* صفحة الفيسبوك الرسمية */}
<a
  href={facebookUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-4 rounded-2xl transition group"
>
  <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20 group-hover:scale-110 transition">
    <svg className="size-6 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </div>
  <div>
    <h4 className="text-white font-bold text-sm">صفحة الفيسبوك الرسمية</h4>
    <span className="text-blue-400 text-xs block mt-0.5">Elrayes Real Estate</span>
  </div>
</a>
          </div>
        </div>

        {/* نموذج الاستشارة */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="bg-emerald-500/10 text-emerald-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="size-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">تم إرسال طلبك بنجاح!</h3>
              <p className="text-slate-400 text-sm">سيتواصل معك فريق المبيعات في أقرب وقت ممكن.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-slate-800 text-slate-300 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
              >
                إرسال استشارة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">اطلب استشارة عقارية مجانية</h3>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  required
                  placeholder="رقم الهاتف للتواصل..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">ملاحظات أو استفسار</label>
                <textarea
                  rows={3}
                  placeholder="اكتب تفاصيل العقار أو الاستفسار المطلوب..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gold text-slate-950 font-bold py-3.5 rounded-xl hover:bg-gold/80 transition text-sm shadow-lg shadow-gold/10"
              >
                إرسال الطلب
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}