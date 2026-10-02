'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react'
import { Globe, Send, Share2 } from 'lucide-react'
import { navLinks } from '@/lib/data'
import { supabase } from '@/lib/supabase'

export function SiteFooter() {
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    async function fetchCities() {
      const { data } = await supabase.from('cities').select('name')
      if (data && data.length > 0) {
        setCities(data)
      } else {
        setCities([
          { name: 'القاهرة الجديدة' },
          { name: 'مدينة الشروق' },
          { name: 'العاصمة الإدارية' },
          { name: 'الشيخ زايد' }
        ])
      }
    }
    fetchCities()
  }, [])

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-right" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            {/* اللوجو والهوية مطابقة للهيدر */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gold/10 border border-gold/20 text-gold shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-gold">الريس</span>
                  <span className="text-xl font-normal text-gold/90">El Rayes</span>
                </div>
                <span className="text-xs tracking-widest text-slate-300 font-semibold -mt-0.5">M and M Realestate Marketing</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              شركة M and M Realestate Marketing - بوابتك الموثوقة. نساعدك في العثور على عقارك المناسب ونقدم لك تجربة بحث ومتابعة احترافية متكاملة.
            </p>
            
            <div className="mt-6 flex items-center gap-3">
              {[Share2, Globe, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="تابعنا على مواقع التواصل"
                  className="grid size-10 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

         <div>
            <h3 className="text-sm font-bold text-white">روابط سريعة</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">المدن</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {cities.map((city, idx) => (
                <li key={idx}>
                  <a
                    href="#properties"
                    className="text-sm text-slate-400 transition-colors hover:text-gold"
                  >
                    {city.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} M and M Realestate Marketing. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-colors hover:text-gold">
              سياسة الخصوصية
            </a>
            <a href="#" className="transition-colors hover:text-gold">
              الشروط والأحكام
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}