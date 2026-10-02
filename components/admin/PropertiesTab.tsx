'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Building, Edit, Trash2, Upload, Check, X } from 'lucide-react'

export default function PropertiesTab({ userRole, userPermissions }: { userRole: string | null; userPermissions: string[] }) {
  const [properties, setProperties] = useState<any[]>([])
  const [citiesList, setCitiesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Edit State
  const [editingProp, setEditingProp] = useState<any | null>(null)
  const [newEditImages, setNewEditImages] = useState<FileList | null>(null)
  const [updating, setUpdating] = useState(false)

  const hasPermission = (permId: string) => {
    if (userRole === 'admin' && userPermissions.length === 0) return true
    return userPermissions.includes(permId)
  }

  const fetchData = async () => {
    setLoading(true)
    const { data: propsData } = await supabase
      .from('properties')
      .select('*, cities(name)')
      .order('created_at', { ascending: false })
    if (propsData) setProperties(propsData)

    const { data: citiesData } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true })
    if (citiesData) setCitiesList(citiesData)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العقار؟')) return
    const { error } = await supabase.from('properties').delete().eq('id', id)
    if (error) {
      alert('حدث خطأ أثناء الحذف')
    } else {
      alert('تم الحذف بنجاح')
      fetchData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Building className="text-gold size-5" /> كافة العقارات الحالية وعرضها ({properties.length})
        </h2>
        {loading ? (
          <p className="text-slate-400 text-sm text-center py-8">جاري تحميل العقارات...</p>
        ) : properties.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">لا توجد عقارات مضافة حتى الآن.</p>
        ) : (
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-800/60 text-slate-400">
              <tr>
                <th className="p-3 rounded-r-lg">العنوان</th>
                <th className="p-3">المُضيف / العميل</th>
                <th className="p-3">المنطقة</th>
                <th className="p-3">النوع</th>
                <th className="p-3">السعر</th>
                {(hasPermission('edit_property') || hasPermission('delete_property')) && (
                  <th className="p-3 rounded-l-lg text-center">الإجراءات</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-semibold text-white">{prop.title}</td>
                  <td className="p-3 text-gold text-xs">
                    {prop.added_by ? prop.added_by : <span className="text-slate-500">إدارة الموقع (Admin)</span>}
                  </td>
                  <td className="p-3 text-slate-300">{prop.cities?.name || prop.location || 'غير محدد'}</td>
                  <td className="p-3 text-slate-300">{prop.type}</td>
                  <td className="p-3 text-gold font-bold">{prop.price?.toLocaleString()} جنيه</td>
                  {(hasPermission('edit_property') || hasPermission('delete_property')) && (
                    <td className="p-3 text-center flex items-center justify-center gap-2">
                      {hasPermission('edit_property') && (
                        <button
                          onClick={() => {
                            setEditingProp({
                              ...prop,
                              images: Array.isArray(prop.images) ? prop.images : (prop.image_url ? [prop.image_url] : [])
                            })
                            setNewEditImages(null)
                          }}
                          className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          <Edit className="size-3.5" /> تعديل
                        </button>
                      )}
                      {hasPermission('delete_property') && (
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          <Trash2 className="size-3.5" /> حذف
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* نافذة تعديل العقار مع التفاصيل الكاملة */}
      {editingProp && hasPermission('edit_property') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-gold flex items-center gap-2">
                <Edit className="size-5" /> تعديل بيانات وصور العقار بالتفصيل
              </h3>
              <button onClick={() => setEditingProp(null)} className="text-slate-400 hover:text-white transition p-1">
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setUpdating(true)
                try {
                  const newlyUploadedUrls: string[] = []
                  if (newEditImages && newEditImages.length > 0) {
                    for (let i = 0; i < newEditImages.length; i++) {
                      const file = newEditImages[i]
                      const ext = file.name.split('.').pop()
                      const fileName = `edit-gallery-${Date.now()}-${i}-${Math.random()}.${ext}`
                      const { error: uploadError } = await supabase.storage
                        .from('properties-images')
                        .upload(fileName, file)

                      if (!uploadError) {
                        const { data: publicUrlData } = supabase.storage
                          .from('properties-images')
                          .getPublicUrl(fileName)
                        if (publicUrlData?.publicUrl) {
                          newlyUploadedUrls.push(publicUrlData.publicUrl)
                        }
                      }
                    }
                  }

                  const currentImages = editingProp.images || []
                  const updatedImagesList = [...currentImages, ...newlyUploadedUrls]

                  const { error } = await supabase
                    .from('properties')
                    .update({
                      title: editingProp.title,
                      price: Number(editingProp.price),
                      type: editingProp.type,
                      city_id: editingProp.city_id,
                      bedrooms: editingProp.bedrooms ? Number(editingProp.bedrooms) : null,
                      bathrooms: editingProp.bathrooms ? Number(editingProp.bathrooms) : null,
                      area: editingProp.area ? Number(editingProp.area) : null,
                      floor: editingProp.floor || null,
                      finishing: editingProp.finishing || null,
                      description: editingProp.description,
                      images: updatedImagesList,
                      added_by: editingProp.added_by,
                    })
                    .eq('id', editingProp.id)

                  if (error) throw error

                  alert('تم التعديل بنجاح!')
                  setEditingProp(null)
                  setNewEditImages(null)
                  fetchData()
                } catch (err: any) {
                  alert('حدث خطأ أثناء التعديل: ' + err.message)
                } finally {
                  setUpdating(false)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs text-slate-400 mb-1">عنوان العقار</label>
                <input
                  type="text"
                  value={editingProp.title}
                  onChange={(e) => setEditingProp({ ...editingProp, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">المدينة</label>
                  <select
                    value={editingProp?.city_id || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, city_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold"
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {citiesList.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">النوع</label>
                  <select
                    value={editingProp.type}
                    onChange={(e) => setEditingProp({ ...editingProp, type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="شقة">شقة</option>
                    <option value="فيلا">فيلا</option>
                    <option value="بينتهاوس">بينتهاوس</option>
                  </select>
                </div>
              </div>

              {/* الحقول التفصيلية في التعديل */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">عدد الغرف</label>
                  <input
                    type="number"
                    value={editingProp.bedrooms || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, bedrooms: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">عدد الحمامات</label>
                  <input
                    type="number"
                    value={editingProp.bathrooms || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, bathrooms: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">المساحة (م²)</label>
                  <input
                    type="number"
                    value={editingProp.area || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, area: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">الدور</label>
                  <input
                    type="text"
                    value={editingProp.floor || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, floor: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] text-slate-400 mb-1">التشطيب</label>
                  <input
                    type="text"
                    value={editingProp.finishing || ''}
                    onChange={(e) => setEditingProp({ ...editingProp, finishing: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">السعر (بالجنيه)</label>
                <input
                  type="number"
                  value={editingProp.price}
                  onChange={(e) => setEditingProp({ ...editingProp, price: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">بيانات العميل المُضيف (added_by)</label>
                <input
                  type="text"
                  value={editingProp.added_by || ''}
                  onChange={(e) => setEditingProp({ ...editingProp, added_by: e.target.value })}
                  placeholder="الاسم ورقم الهاتف والبريد"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-gold text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">صور المعرض الحالية</label>
                <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-950/50 rounded-xl border border-slate-800">
                  {editingProp.images && editingProp.images.length > 0 ? (
                    editingProp.images.map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden h-16 bg-slate-800">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImages = editingProp.images.filter((_: any, i: number) => i !== idx)
                            setEditingProp({ ...editingProp, images: updatedImages })
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-4 text-center text-xs text-slate-500 py-4">لا توجد صور مضافة</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">إضافة صور جديدة للمعرض (اختياري)</label>
                <div className="flex items-center gap-3 bg-slate-800 rounded-xl border border-slate-700 p-2">
                  <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                    <Upload className="size-4" /> اختر صور إضافية
                    <input type="file" accept="image/*" multiple onChange={(e) => setNewEditImages(e.target.files || null)} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-400 truncate">
                    {newEditImages && newEditImages.length > 0 ? `تم اختيار ${newEditImages.length} صور جديدة` : 'لم يتم اختيار صور جديدة'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gold text-slate-950 font-bold py-3 rounded-xl hover:bg-gold/80 transition text-sm flex items-center justify-center gap-2"
                >
                  <Check className="size-4" /> {updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProp(null)}
                  className="px-5 bg-slate-800 text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-700 transition text-sm"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}