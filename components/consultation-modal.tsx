'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function ConsultationModal({ propertyId, isOpen, onClose }: { propertyId: string, isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('leads').insert([
      { name, phone, property_id: propertyId }
    ])

    setLoading(false)
    if (!error) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        onClose()
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full relative space-y-4">
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-white">✕</button>
        
        {submitted ? (
          <div className="text-center py-6 text-emerald-400 font-bold">
            تم استلام طلبك بنجاح! سيتواصل معك أحد مستشارينا قريباً.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-bold text-white text-right">طلب استشارة عقارية</h3>
            <p className="text-xs text-slate-400 text-right">اترك بياناتك وسنقوم بالتواصل معك لتوفير كافة التفاصيل.</p>

            <input
              type="text"
              placeholder="الاسم بالكامل"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />

            <input
              type="tel"
              placeholder="رقم الهاتف / الواتساب"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-slate-950 font-bold py-3 rounded-xl hover:bg-gold/80 transition text-sm"
            >
              {loading ? 'جاري الإرسال...' : 'تأكيد الطلب'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}