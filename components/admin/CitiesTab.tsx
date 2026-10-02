'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

export default function CitiesTab() {
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [editingCity, setEditingCity] = useState<any | null>(null);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    // تم تعديل الاستعلام لجلب البيانات بناءً على الـ id مباشرة لمنع خطأ 400 لحين إضافة عمود الترتيب في قاعدة البيانات
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('id', { ascending: true });
      
    if (!error) {
      setCities(data || []);
    } else {
      console.error('Error fetching cities:', error.message);
    }
    setLoading(false);
  }

  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !slug) return alert('يرجى إدخال اسم المدينة والـ Slug');

    const { error } = await supabase.from('cities').insert([{ 
      name, 
      slug, 
      description, 
      image, 
      display_order: parseInt(displayOrder) || 0 
    }]);

    if (error) {
      alert('حدث خطأ أثناء الإضافة: ' + error.message);
    } else {
      alert('تم إضافة المدينة بنجاح');
      setName(''); 
      setSlug(''); 
      setDescription(''); 
      setImage(''); 
      setDisplayOrder('0');
      fetchCities();
    }
  }

  async function handleUpdateCity(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCity || !name) return;

    const { error } = await supabase.from('cities').update({ 
      name, 
      slug, 
      description, 
      image, 
      display_order: parseInt(displayOrder) || 0 
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
      setDisplayOrder('0');
      fetchCities();
    }
  }

  async function handleDeleteCity(id: number) {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;
    const { error } = await supabase.from('cities').delete().eq('id', id);
    if (error) {
      alert('لا يمكن حذف المدينة لارتباطها بعقارات موجودة.');
    } else {
      alert('تم حذف المدينة بنجاح');
      fetchCities();
    }
  }

  function startEditing(city: any) {
    setEditingCity(city);
    setName(city.name || '');
    setSlug(city.slug || '');
    setDescription(city.description || '');
    setImage(city.image || '');
    setDisplayOrder(city.display_order?.toString() || '0');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gold flex items-center gap-2">
          <Building2 className="size-6" /> إدارة وترتيب المدن
        </h2>
      </div>

      {/* نموذج الإضافة أو التعديل */}
      <form onSubmit={editingCity ? handleUpdateCity : handleAddCity} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-200">
          {editingCity ? `تعديل مدينة: ${editingCity.name}` : 'إضافة مدينة جديدة'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-slate-400">اسم المدينة</label>
            <input
              type="text"
              placeholder="مثلاً: العاصمة الإدارية"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">الرابط المختصر (Slug)</label>
            <input
              type="text"
              placeholder="مثلاً: new-cairo"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">رقم الترتيب في الموقع</label>
            <input
              type="number"
              placeholder="مثلاً: 1, 2, 3..."
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              className="w-full border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-gold font-bold text-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">رابط الصورة (Image URL)</label>
            <input
              type="text"
              placeholder="رابط صورة المدينة"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs text-slate-400">وصف مختصر للمدينة</label>
            <input
              type="text"
              placeholder="اكتب وصفاً مختصراً..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-700 bg-slate-800 p-3 rounded-xl text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>
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
                setDisplayOrder('0'); 
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
        <h3 className="text-lg font-bold p-6 border-b border-slate-800 text-slate-200">المدن الحالية وترتيبها في النظام</h3>
        {loading ? (
          <p className="p-6 text-center text-slate-400">جاري تحميل المدن...</p>
        ) : cities.length === 0 ? (
          <p className="p-6 text-center text-slate-400">لا توجد مدن مضافة حالياً.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-400">
                  <th className="p-4">الترتيب</th>
                  <th className="p-4">اسم المدينة</th>
                  <th className="p-4">الرابط (Slug)</th>
                  <th className="p-4">الوصف</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {cities.map((city) => (
                  <tr key={city.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-gold">{city.display_order ?? 0}</td>
                    <td className="p-4 font-semibold text-white">{city.name}</td>
                    <td className="p-4 text-slate-400">{city.slug}</td>
                    <td className="p-4 text-slate-400 truncate max-w-xs">{city.description || 'لا يوجد وصف'}</td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => startEditing(city)}
                        className="bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1"
                      >
                        <Edit className="size-3.5" /> تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteCity(city.id)}
                        className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1"
                      >
                        <Trash2 className="size-3.5" /> حذف
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