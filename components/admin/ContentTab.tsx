'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Globe, Building, PhoneCall, MapPin } from 'lucide-react'

export default function ContentTab() {
  const [siteTexts, setSiteTexts] = useState({
    // الرئيسية
    hero_title: '',
    hero_title_size: 'text-4xl md:text-6xl',
    hero_title_color: 'text-white',
    hero_title_font: 'font-[family-name:var(--font-cairo)]',

    hero_subtitle: '',
    hero_subtitle_size: 'text-lg',
    hero_subtitle_color: 'text-slate-400',
    hero_subtitle_font: 'font-[family-name:var(--font-tajawal)]',

    // عنوان قسم العقارات والمشاريع في الصفحة الرئيسية
    properties_section_title: '',
    properties_section_title_size: 'text-3xl',
    properties_section_title_color: 'text-white',
    properties_section_title_font: 'font-[family-name:var(--font-cairo)]',

    properties_section_subtitle: '',
    properties_section_subtitle_size: 'text-base',
    properties_section_subtitle_color: 'text-slate-400',
    properties_section_subtitle_font: 'font-[family-name:var(--font-tajawal)]',

    // عن الشركة
    about_title_part1: '',
    about_title_part1_color: 'text-white',
    about_title_part2: '',
    about_title_part2_color: 'text-[#D4AF37]',
    about_main_title_size: 'text-3xl sm:text-5xl',
    about_main_title_font: 'font-[family-name:var(--font-cairo)]',

    about_description: '',
    about_description_size: 'text-sm sm:text-base',
    about_description_color: 'text-slate-400',
    about_description_font: 'font-[family-name:var(--font-tajawal)]',

    // تواصل معنا
    contact_title: '',
    contact_title_size: 'text-3xl',
    contact_title_color: 'text-white',
    contact_title_font: 'font-[family-name:var(--font-cairo)]',

    contact_subtitle: '',
    contact_subtitle_size: 'text-base',
    contact_subtitle_color: 'text-slate-400',
    contact_subtitle_font: 'font-[family-name:var(--font-tajawal)]',

    // المدن
    cities_section_title: '',
    cities_section_title_size: 'text-3xl',
    cities_section_title_color: 'text-white',
    cities_section_title_font: 'font-[family-name:var(--font-cairo)]',

    cities_section_subtitle: '',
    cities_section_subtitle_size: 'text-base',
    cities_section_subtitle_color: 'text-slate-400',
    cities_section_subtitle_font: 'font-[family-name:var(--font-tajawal)]',
  })

  const [savingContent, setSavingContent] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'cities'>('home')

  const fetchSiteContent = async () => {
    const { data } = await supabase.from('site_content').select('*')
    if (data) {
      const textObj: any = {}
      data.forEach((item: any) => {
        textObj[item.key] = item.value
      })
      setSiteTexts(prev => ({ ...prev, ...textObj }))
    }
  }

  useEffect(() => {
    fetchSiteContent()
  }, [])

  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingContent(true)
    try {
      for (const [key, value] of Object.entries(siteTexts)) {
        await supabase.from('site_content').upsert({ key, value })
      }
      alert('تم حفظ كافة التعديلات بنجاح!')
    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء الحفظ')
    } finally {
      setSavingContent(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-6" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
          <FileText className="size-5" /> تخصيص النصوص والألوان لجميع الصفحات
        </h2>

        {/* أزرار التنقل الأربعة */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'home' ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="size-3.5" /> الرئيسية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'about' ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Building className="size-3.5" /> عن الشركة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'contact' ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="size-3.5" /> تواصل معنا
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'cities' ? 'bg-gold text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="size-3.5" /> المدن
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSiteContent} className="space-y-6">
        
        {/* 1. الرئيسية */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gold border-r-2 border-gold pr-2">تنسيقات نصوص الصفحة الرئيسية</h3>
            
            {/* العنوان الرئيسي */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-gold">العنوان الرئيسي</label>
              <input
                type="text"
                value={siteTexts.hero_title || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, hero_title: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.hero_title_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_title_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-3xl md:text-5xl">حجم صغير</option>
                  <option value="text-4xl md:text-6xl">حجم متوسط</option>
                  <option value="text-5xl md:text-7xl">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.hero_title_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_title_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.hero_title_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_title_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                </select>
              </div>
            </div>

            {/* العنوان الفرعي */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-gold">العنوان الفرعي (تحت الرئيسي)</label>
              <input
                type="text"
                value={siteTexts.hero_subtitle || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, hero_subtitle: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.hero_subtitle_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_subtitle_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-sm">حجم صغير</option>
                  <option value="text-lg">حجم متوسط</option>
                  <option value="text-xl">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.hero_subtitle_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_subtitle_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-slate-400">لون رمادي</option>
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.hero_subtitle_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, hero_subtitle_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                </select>
              </div>
            </div>

            {/* عنوان قسم العقارات */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-gold">عنوان قسم العقارات (اللي فوق الكروت)</label>
              <input
                type="text"
                value={siteTexts.properties_section_title || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_title: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.properties_section_title_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_title_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-xl">حجم صغير</option>
                  <option value="text-2xl sm:text-3xl">حجم متوسط</option>
                  <option value="text-4xl">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.properties_section_title_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_title_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.properties_section_title_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_title_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                </select>
              </div>

              <input
                type="text"
                value={siteTexts.properties_section_subtitle || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_subtitle: e.target.value })}
                placeholder="النص الفرعي تحت العنوان"
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none mt-2"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.properties_section_subtitle_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_subtitle_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-xs">حجم صغير جداً</option>
                  <option value="text-sm">حجم صغير</option>
                  <option value="text-base">حجم متوسط</option>
                </select>
                <select
                  value={siteTexts.properties_section_subtitle_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_subtitle_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-slate-400">لون رمادي</option>
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.properties_section_subtitle_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, properties_section_subtitle_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 2. صفحة عن الشركة */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gold border-r-2 border-gold pr-2">تنسيقات عنوان وصفحة عن الشركة</h3>
            
            {/* الجزء الرئيسي من العنوان */}
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">الجزء الأول من العنوان</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={siteTexts.about_title_part1 || ''}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_title_part1: e.target.value })}
                    className="w-3/4 bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none"
                  />
                  <select
                    value={siteTexts.about_title_part1_color}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_title_part1_color: e.target.value })}
                    className="w-1/4 bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="text-white">أبيض</option>
                    <option value="text-[#D4AF37]">ذهبي</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400">الجزء الثاني من العنوان</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={siteTexts.about_title_part2 || ''}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_title_part2: e.target.value })}
                    className="w-3/4 bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none"
                  />
                  <select
                    value={siteTexts.about_title_part2_color}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_title_part2_color: e.target.value })}
                    className="w-1/4 bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="text-[#D4AF37]">ذهبي</option>
                    <option value="text-white">أبيض</option>
                  </select>
                </div>
              </div>

              {/* اختيار حجم العنوان ونوع الخط لصفحة عن الشركة */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">حجم العنوان الرئيسي</label>
                  <select
                    value={siteTexts.about_main_title_size}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_main_title_size: e.target.value })}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="text-2xl sm:text-4xl">حجم صغير</option>
                    <option value="text-3xl sm:text-5xl">حجم متوسط</option>
                    <option value="text-4xl sm:text-6xl">حجم كبير</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">نوع الخط للعنوان</label>
                  <select
                    value={siteTexts.about_main_title_font}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_main_title_font: e.target.value })}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                    <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                  </select>
                </div>
              </div>

              {/* النبذة التعريفية (الوصف) مع حجم الخط ولونه ونوعه */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <label className="block text-xs text-slate-400">نص الوصف (النبذة التعريفية)</label>
                <textarea
                  value={siteTexts.about_description || ''}
                  onChange={(e) => setSiteTexts({ ...siteTexts, about_description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={siteTexts.about_description_size}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_description_size: e.target.value })}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="text-xs sm:text-sm">حجم صغير</option>
                    <option value="text-sm sm:text-base">حجم متوسط</option>
                    <option value="text-base sm:text-lg">حجم كبير</option>
                  </select>
                  <select
                    value={siteTexts.about_description_color}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_description_color: e.target.value })}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="text-slate-400">لون رمادي</option>
                    <option value="text-white">لون أبيض</option>
                    <option value="text-[#D4AF37]">لون ذهبي</option>
                  </select>
                  <select
                    value={siteTexts.about_description_font}
                    onChange={(e) => setSiteTexts({ ...siteTexts, about_description_font: e.target.value })}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                  >
                    <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                    <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. تواصل معنا */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gold border-r-2 border-gold pr-2">تنسيقات صفحة تواصل معنا</h3>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-gold">عنوان الصفحة</label>
              <input
                type="text"
                value={siteTexts.contact_title || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, contact_title: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.contact_title_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_title_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-2xl">حجم صغير</option>
                  <option value="text-3xl">حجم متوسط</option>
                  <option value="text-4xl">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.contact_title_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_title_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.contact_title_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_title_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                </select>
              </div>

              {/* العنوان الفرعي لصفحة تواصل معنا */}
              <label className="block text-xs text-slate-400 mt-3">العنوان الفرعي (الوصفي)</label>
              <input
                type="text"
                value={siteTexts.contact_subtitle || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, contact_subtitle: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.contact_subtitle_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_subtitle_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-sm">حجم صغير</option>
                  <option value="text-base">حجم متوسط</option>
                  <option value="text-lg">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.contact_subtitle_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_subtitle_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-slate-400">لون رمادي</option>
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.contact_subtitle_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, contact_subtitle_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 4. المدن */}
        {activeTab === 'cities' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-gold border-r-2 border-gold pr-2">تنسيقات صفحة المدن</h3>
            <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-sm font-bold text-gold">العنوان الرئيسي</label>
              <input
                type="text"
                value={siteTexts.cities_section_title || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_title: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.cities_section_title_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_title_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-2xl">حجم صغير</option>
                  <option value="text-3xl">حجم متوسط</option>
                  <option value="text-4xl">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.cities_section_title_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_title_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.cities_section_title_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_title_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                </select>
              </div>

              {/* العنوان الفرعي لصفحة المدن */}
              <label className="block text-xs text-slate-400 mt-3">العنوان الفرعي</label>
              <input
                type="text"
                value={siteTexts.cities_section_subtitle || ''}
                onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_subtitle: e.target.value })}
                className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={siteTexts.cities_section_subtitle_size}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_subtitle_size: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-sm">حجم صغير</option>
                  <option value="text-base">حجم متوسط</option>
                  <option value="text-lg">حجم كبير</option>
                </select>
                <select
                  value={siteTexts.cities_section_subtitle_color}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_subtitle_color: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="text-slate-400">لون رمادي</option>
                  <option value="text-white">لون أبيض</option>
                  <option value="text-[#D4AF37]">لون ذهبي</option>
                </select>
                <select
                  value={siteTexts.cities_section_subtitle_font}
                  onChange={(e) => setSiteTexts({ ...siteTexts, cities_section_subtitle_font: e.target.value })}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs"
                >
                  <option value="font-[family-name:var(--font-tajawal)]">خط تجوال</option>
                  <option value="font-[family-name:var(--font-cairo)]">خط القاهرة</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={savingContent}
          className="w-full bg-gold text-slate-950 font-bold py-3.5 rounded-xl hover:bg-gold/80 transition text-sm shadow-lg"
        >
          {savingContent ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  )
}