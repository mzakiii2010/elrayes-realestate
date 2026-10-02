'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminCitiesPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // حقول إضافة وتعديل المدينة
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  const [editingCity, setEditingCity] = useState<any | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    const { data, error } = await supabase.from('cities').select('*').order('id', { ascending: true });
    if (error) {
      console.error('Error fetching cities:', error);
    } else {
      setCities(data || []);
    }
    setLoading(false);
  }

  // إضافة مدينة جديدة
  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return alert('يرجى إدخال اسم المدينة والـ Slug');

    const { error } = await supabase.from('cities').insert([
      { name, slug, description, image }
    ]);

    if (error) {
      alert('حدث خطأ أثناء الإضافة: ' + error.message);
    } else {
      alert('تم إضافة المدينة بنجاح');
      setName('');
      setSlug('');
      setDescription('');
      setImage('');
      fetchCities();
    }
  }

  // حفظ التعديل على مدينة موجودة
  async function handleUpdateCity(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCity || !name) return;

    const { error } = await supabase.from('cities').update({
      name,
      slug,
      description,
      image
    }).eq('id', editingCity.id);

    if (error) {
      alert('حدث خطأ أثناء التعديل: ' + error.message);
    } else {
      alert('تم تعديل المدينة بنجاح');
      setEditingCity(null);
      setName('');
      setSlug('');
      setDescription('');
      setImage('');
      fetchCities();
    }
  }

  // حذف مدينة
  async function handleDeleteCity(id: number) {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;

    const { error } = await supabase.from('cities').delete().eq('id', id);
    if (error) {
      alert('لا يمكن حذف المدينة لارتباطها بعقارات موجودة، أو حدث خطأ: ' + error.message);
    } else {
      alert('تم حذف المدينة بنجاح');
      fetchCities();
    }
  }

  // تجهيز بيانات المدينة للتعديل
  function startEditing(city: any) {
    setEditingCity(city);
    setName(city.name || '');
    setSlug(city.slug || '');
    setDescription(city.description || '');
    setImage(city.image || '');
  }

  return (
    <div className="p-8 max-w-6xl mx-auto text-white" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gold">لوحة التحكم - إدارة المدن</h1>

      {/* نموذج الإضافة أو التعديل */}
      <form onSubmit={editingCity ? handleUpdateCity : handleAddCity} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-8 shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">
          {editingCity ? `تعديل مدينة: ${editingCity.name}` : 'إضافة مدينة جديدة'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="اسم المدينة (مثلاً: العاصمة الإدارية)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="الرابط المختصر Slug (مثلاً: new-cairo)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="رابط الصورة (Image URL)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm focus:outline-none"
          />
          <input
            type="text"
            placeholder="وصف مختصر للمدينة"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="bg-gold text-slate-950 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gold/80 transition">
            {editingCity ? 'حفظ التعديلات' : 'إضافة المدينة'}
          </button>
          {editingCity && (
            <button
              type="button"
              onClick={() => {
                setEditingCity(null);
                setName('');
                setSlug('');
                setDescription('');
                setImage('');
              }}
              className="bg-slate-800 text-slate-300 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition"
            >
              إلغاء التعديل
            </button>
          )}
        </div>
      </form>

      {/* جدول عرض المدن */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <h2 className="text-xl font-semibold p-6 border-b border-slate-800">المدن الحالية في النظام</h2>
        {loading ? (
          <p className="p-6 text-center text-slate-400">جاري تحميل المدن...</p>
        ) : cities.length === 0 ? (
          <p className="p-6 text-center text-slate-400">لا توجد مدن مضافة حالياً.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <th className="p-4">#</th>
                  <th className="p-4">اسم المدينة</th>
                  <th className="p-4">الرابط (Slug)</th>
                  <th className="p-4">الوصف</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 text-slate-400">{city.id}</td>
                    <td className="p-4 font-semibold text-white">{city.name}</td>
                    <td className="p-4 text-slate-400">{city.slug}</td>
                    <td className="p-4 text-slate-400 truncate max-w-xs">{city.description || 'لا يوجد وصف'}</td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => startEditing(city)}
                        className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteCity(city.id)}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}