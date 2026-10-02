'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Building, Upload } from 'lucide-react'

export default function AddPropertyTab() {
  const [citiesList, setCitiesList] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [cityId, setCityId] = useState('')
  const [type, setType] = useState('شقة')
  const [price, setPrice] = useState('')
  
  // الحقول التفصيلية الجديدة
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [area, setArea] = useState('')
  const [floor, setFloor] = useState('')
  const [finishing, setFinishing] = useState('تشطيب كامل')

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase.from('cities').select('*').order('name', { ascending: true })
      if (data) setCitiesList(data)
    }
    fetchCities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile) {
      alert('الرجاء اختيار صورة الواجهة الرئيسية للعقار')
      return
    }
    setSubmitting(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('properties-images')
        .upload(fileName, imageFile)
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('properties-images')
        .getPublicUrl(fileName)

      const extraImagesUrls: string[] = []
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i]
          const ext = file.name.split('.').pop()
          const extraName = `gallery-${Date.now()}-${i}-${Math.random()}.${ext}`
          const { error: extraUploadErr } = await supabase.storage
            .from('properties-images')
            .upload(extraName, file)
          if (!extraUploadErr) {
            const { data: extraUrlData } = supabase.storage
              .from('properties-images')
              .getPublicUrl(extraName)
            if (extraUrlData?.publicUrl) {
              extraImagesUrls.push(extraUrlData.publicUrl)
            }
          }
        }
      }

      // 1. إضافة العقار في جدول properties
      const { error: insertError } = await supabase.from('properties').insert([
        {
          title,
          city_id: cityId,
          type,
          price: Number(price),
          bedrooms: bedrooms ? Number(bedrooms) : null,
          bathrooms: bathrooms ? Number(bathrooms) : null,
          area: area ? Number(area) : null,
          floor: floor || null,
          finishing: finishing || null,
          image_url: publicUrlData.publicUrl,
          images: extraImagesUrls,
          status: 'pending',
        },
      ])
      if (insertError) throw insertError

      // 2. إضافته تلقائياً كطلب/عميل في جدول متابعة المبيعات (leads)
      await supabase.from('leads').insert([
        {
          name: title,
          phone: 'غير متوفر',
          status: 'جديد',
          notes: `تم إضافة عقار جديد بسعر: ${price} جنيه - النوع: ${type}`,
          has_inspection: false,
          employee_name: 'غير مسند'
        },
      ])

      alert('تم رفع الصور وإضافة العقار وإرساله لتبويب المتابعة بنجاح')
      setTitle('')
      setPrice('')
      setBedrooms('')
      setBathrooms('')
      setArea('')
      setFloor('')
      setImageFile(null)
      setImageFiles(null)
    } catch (err) {
      console.error(err)
      alert('حدث خطأ أثناء رفع الصور أو إضافة العقار')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl space-y-6" dir="rtl">
      <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
        <Building className="size-5" /> إضافة عقار جديد مع التفاصيل الكاملة
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">عنوان العقار</label>
          <input
            type="text"
            required
            placeholder="مثال: فيلا مستقلة بإطلالة على اللاندسكيب"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">المدينة / المنطقة</label>
            <select
              required
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            >
              <option value="">اختر المدينة</option>
              {citiesList.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">نوع العقار</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            >
              <option value="شقة">شقة</option>
              <option value="فيلا">فيلا</option>
              <option value="بينتهاوس">بينتهاوس</option>
            </select>
          </div>
        </div>

        {/* تفاصيل العقار */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">عدد الغرف</label>
            <input
              type="number"
              placeholder="مثال: 3"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">عدد الحمامات</label>
            <input
              type="number"
              placeholder="مثال: 2"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">المساحة (م²)</label>
            <input
              type="number"
              placeholder="مثال: 180"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">الدور</label>
            <input
              type="text"
              placeholder="مثال: الثالث أو الأرضي"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />
          </div>

          <div className="col-span.2">
            <label className="block text-xs text-slate-400 mb-1">التشطيب</label>
            <input
              type="text"
              placeholder="مثال: تشطيب كامل / نصف تشطيب"
              value={finishing}
              onChange={(e) => setFinishing(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">السعر (بالجنيه المصري)</label>
          <input
            type="number"
            required
            placeholder="مثال: 8900000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">صورة الواجهة الرئيسية (Thumbnail)</label>
            <div className="flex items-center gap-3 bg-slate-800 rounded-xl border border-slate-700 p-2">
              <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                <Upload className="size-4" /> اختر صورة الواجهة
                <input type="file" accept="image/*" required onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              <span className="text-xs text-slate-400 truncate">
                {imageFile ? imageFile.name : 'لم يتم اختيار صورة الواجهة'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">صور المعرض الإضافية (اختياري)</label>
            <div className="flex items-center gap-3 bg-slate-800 rounded-xl border border-slate-700 p-2">
              <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                <Upload className="size-4" /> اختر صور متعددة
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files || null)} className="hidden" />
              </label>
              <span className="text-xs text-slate-400 truncate">
                {imageFiles && imageFiles.length > 0 ? `تم اختيار ${imageFiles.length} صور` : 'لم يتم اختيار صور إضافية'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold text-slate-950 font-bold py-3.5 rounded-xl hover:bg-gold/80 transition text-sm mt-4 cursor-pointer"
        >
          {submitting ? 'جاري الرفع وإضافة العقار...' : 'إضافة العقار والصورة والتفاصيل'}
        </button>
      </form>
    </div>
  )
}