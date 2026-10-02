'use client'

import React, { useState } from 'react';
import { X, Sparkles, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ClientAddPropertyModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('شقة');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('properties').insert([
        {
          title: title || 'عقاري المضاف',
          city: city,
          type: type,
          price: price ? Number(price) : null,
          status: 'pending',
          client_name: clientName,
          client_phone: clientPhone,
          client_email: clientEmail,
        }
      ]);

      if (error) {
        alert('حدث خطأ أثناء إرسال العقار: ' + error.message);
      } else {
        alert('تم إرسال عقارك بنجاح وهو قيد المراجعة والنشر!');
        onClose();
      }
    } catch (err: any) {
      alert('حدث خطأ غير متوقع: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative my-4 sm:my-8 text-right" dir="rtl">
        
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-5 left-5 text-slate-400 hover:text-white transition p-2 bg-slate-800/50 rounded-full z-10 cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-bold border border-gold/20">
            <Sparkles className="size-3.5" /> أضف عقارك مجاناً معنا
          </span>
          <h2 className="text-2xl font-black text-white">اعرض عقارك للبيع أو الإيجار</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            املأ بيانات التواصل وتفاصيل العقار كاملة، وسيتواصل معك فريقنا قريباً.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-1">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider">بيانات التواصل الخاصة بك</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">رقم الهاتف (واتساب)</label>
                <input
                  type="tel"
                  required
                  placeholder="01000000000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider">تفاصيل العقار الأساسية</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">عنوان أو وصف مختصر للعقار</label>
                <input
                  type="text"
                  required
                  placeholder="شقة للبيع في التجمع الخامس..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">المدينة / المنطقة</label>
                  <input
                    type="text"
                    required
                    placeholder="القاهرة الجديدة"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">نوع العقار</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                  >
                    <option value="شقة">شقة</option>
                    <option value="فيلا">فيلا</option>
                    <option value="بينتهاوس">بينتهاوس</option>
                    <option value="تجاري">تجاري / إداري</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">السعر التقريبي (ج.م)</label>
                  <input
                    type="number"
                    placeholder="5000000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold hover:bg-gold/80 text-slate-950 font-extrabold py-3.5 rounded-xl transition text-sm mt-4 shadow-lg shadow-gold/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'جاري إرسال العقار...' : 'إرسال العقار للمراجعة والنشر'}
          </button>
        </form>
      </div>
    </div>
  );
}