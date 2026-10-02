'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldAlert, CheckCircle, Trash2, Building } from 'lucide-react'

export default function PendingPropertiesTab() {
  const [pendingList, setPendingList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPendingProperties = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        cities (
          name
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (data) {
      setPendingList(data)
    }
    if (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPendingProperties()
  }, [])

  // دالة الموافقة على العقار ونشره
  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('properties')
      .update({ status: 'approved' })
      .eq('id', id)

    if (error) {
      alert('حدث خطأ أثناء الموافقة على العقار')
    } else {
      alert('تم الموافقة على العقار ونشره بنجاح!')
      fetchPendingProperties()
    }
  }

  // دالة رفض/حذف العقار
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رفض وحذف هذا العقار نهائياً؟')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      alert('حدث خطأ أثناء حذف العقار')
    } else {
      alert('تم رفض وحذف العقار بنجاح')
      fetchPendingProperties()
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
          <ShieldAlert className="size-6" /> مراجعة العقارات المعلقة (قيد الانتظار)
        </h2>
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-bold">
          {pendingList.length} عقارات تنتظر المراجعة
        </span>
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-8">جاري تحميل العقارات المعلقة...</p>
      ) : pendingList.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Building className="size-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">لا توجد عقارات جديدة معلقة للمراجعة حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingList.map((property) => (
            <div key={property.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div className="flex gap-4">
                {property.image_url && (
                  <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-24 h-24 object-cover rounded-lg border border-slate-800 flex-shrink-0"
                  />
                )}
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{property.title}</h3>
                  <p className="text-xs text-slate-400">المدينة: {property.cities?.name || 'غير محددة'}</p>
                  <p className="text-xs text-slate-400">النوع: {property.type}</p>
                  <p className="text-xs text-gold font-semibold">السعر: {property.price?.toLocaleString()} جنيه</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => handleApprove(property.id)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="size-4" /> موافقة ونشر
                </button>
                <button
                  onClick={() => handleDelete(property.id)}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 border border-rose-500/30"
                >
                  <Trash2 className="size-4" /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}