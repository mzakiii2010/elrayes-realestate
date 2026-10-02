'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, Phone, X, PlusCircle } from 'lucide-react'
import ClientAddPropertyModal from './ClientAddPropertyModal';

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          
          {/* اللوجو والشعار الأصلي */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 text-gold shadow-sm">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-gold">الريس</span>
                <span className="text-xl sm:text-2xl font-normal text-gold/90">El Rayes</span>
              </div>
              <span className="text-xs tracking-widest text-slate-300 font-semibold -mt-0.5">M and M Realestate Marketing</span>
            </div>
          </div>

          {/* روابط التنقل للشاشات الكبيرة */}
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              الرئيسية
            </Link>
            <Link
              href="/cities"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              المدن
            </Link>
            <Link
              href="/about"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              عن الشركة
            </Link>
            <Link
              href="/contact"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
            >
              تواصل معنا
            </Link>
          </nav>

          {/* أزرار الإجراءات والمنيو */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gold hover:bg-gold/85 px-4 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 shadow-md shadow-gold/10 transition"
            >
              <PlusCircle className="size-4" />
              أضف عقارك مجاناً
            </button>

            <button
              type="button"
              onClick={() => setIsConsultationOpen(true)}
              className="hidden lg:flex items-center gap-2 rounded-full bg-gradient-to-l from-gold to-gold/80 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-gold/20 transition hover:opacity-90"
            >
              <Phone className="size-4" />
              احجز استشارة
            </button>
            
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

        </div>

        {/* قائمة الموبايل */}
        {open && (
          <nav className="border-b border-border bg-background px-4 py-4 lg:hidden shadow-xl">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-800 hover:text-white transition"
              >
                الرئيسية
              </Link>
              <Link
                href="/cities"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-800 hover:text-white transition"
              >
                المدن
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-800 hover:text-white transition"
              >
                عن الشركة
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-800 hover:text-white transition"
              >
                تواصل معنا
              </Link>
              
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setIsModalOpen(true)
                }}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-slate-950"
              >
                <PlusCircle className="size-4" />
                أضف عقارك مجاناً
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setIsConsultationOpen(true)
                }}
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-gold to-gold/80 px-5 py-2.5 text-sm font-bold text-slate-950"
              >
                <Phone className="size-4" />
                احجز استشارة
              </button>
            </div>
          </nav>
        )}
      </header>

      <ClientAddPropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {isConsultationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
            <button 
              onClick={() => setIsConsultationOpen(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
            <h3 className="text-xl font-bold text-gold text-center">طلب استشارة عقارية</h3>
            <p className="text-xs text-slate-400 text-center">اترك بياناتك وسنقوم بالتواصل معك لتوفير كافة التفاصيل</p>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              alert('تم استقبال طلبك بنجاح وسيتواصل معك فريق المبيعات قريباً!')
              setIsConsultationOpen(false)
            }} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">الاسم بالكامل</label>
                <input 
                  name="name" 
                  required 
                  placeholder="اكتب اسمك هنا"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">رقم الهاتف / الواتساب</label>
                <input 
                  name="phone" 
                  required 
                  placeholder="01xxxxxxxxx"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none" 
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gold text-slate-950 font-bold py-3 rounded-xl hover:bg-gold/90 transition text-sm"
              >
                تأكيد الطلب
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}