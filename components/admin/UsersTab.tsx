'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserPlus, Users, User, Trash2, Edit, X } from 'lucide-react'

// قائمة الصلاحيات الشاملة كاملة ومرتبطة بالأقسام والتابات الخاصة بها
const AVAILABLE_PERMISSIONS = [
  // صلاحيات تب متابعة تقارير المبيعات والعملاء (LeadsReportTab)
  { id: 'view_leads', label: 'عرض طلبات العملاء (Leads)' },
  { id: 'assign_leads', label: 'إسناد العملاء للموظفين (متابعة المبيعات)' },
  { id: 'lead_inspections', label: 'إدارة المعاينات (متابعة المبيعات)' },
  { id: 'lead_notes', label: 'إضافة وتعديل الملاحظات (متابعة المبيعات)' },
  { id: 'leads_report', label: 'متابعة تقارير المبيعات والعملاء' },

  // صلاحيات تب إدارة العقارات
  { id: 'view_properties', label: 'عرض العقارات' },
  { id: 'add_property', label: 'إضافة عقار جديد' },
  { id: 'edit_property', label: 'تعديل العقارات' },
  { id: 'delete_property', label: 'حذف العقارات' },
  { id: 'pending_properties', label: 'مراجعة العقارات المعلقة' },

  // صلاحيات عامة وإدارة النظام
  { id: 'manage_users', label: 'إدارة المستخدمين والصلاحيات' },
  { id: 'manage_cities', label: 'إدارة المدن والمناطق' },
  { id: 'manage_content', label: 'تعديل النصوص والمحتوى' },
]

export default function UsersTab() {
  const [isMounted, setIsMounted] = useState(false)
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const [creatingUser, setCreatingUser] = useState(false)

  // حالات النموذج للإضافة
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newRole, setNewRole] = useState('admin')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // حالات وضع التعديل
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editJobTitle, setEditJobTitle] = useState('')
  const [editRole, setEditRole] = useState('admin')
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching users:', error)
    }
    if (data) setAdminUsers(data)
  }

  if (!isMounted) {
    return null
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreatingUser(true)
    try {
      const payload: any = {
        username: newUsername.trim(),
        password: newPassword.trim(),
        email: newEmail.trim() || null,
        job_title: newJobTitle.trim() || null,
        role: newRole,
        permissions: newRole === 'super_admin' ? [] : selectedPermissions,
      }

      const { error } = await supabase.from('admins').insert([payload])
      if (error) throw error

      alert('تم إنشاء المستخدم وتحديد الصلاحيات بنجاح')
      setNewUsername('')
      setNewPassword('')
      setNewEmail('')
      setNewJobTitle('')
      setNewRole('admin')
      setSelectedPermissions([])
      fetchUsers()
    } catch (err: any) {
      console.error('Create user error object:', err)
      alert('حدث خطأ أثناء إضافة المستخدم: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setCreatingUser(false)
    }
  }

  const handleOpenEdit = (usr: any) => {
    setEditingUser(usr)
    setEditUsername(usr.username || '')
    setEditPassword('')
    setEditEmail(usr.email || '')
    setEditJobTitle(usr.job_title || '')
    setEditRole(usr.role || 'admin')
    setEditPermissions(usr.permissions || [])
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setUpdating(true)

    try {
      const updateData: any = {
        username: editUsername.trim(),
        email: editEmail.trim() || null,
        job_title: editJobTitle.trim() || null,
        role: editRole,
        permissions: editRole === 'super_admin' ? [] : editPermissions,
      }

      if (editPassword.trim() !== '') {
        updateData.password = editPassword.trim()
      }

      const { error } = await supabase
        .from('admins')
        .update(updateData)
        .eq('id', editingUser.id)

      if (error) throw error

      alert('تم تحديث بيانات المستخدم بنجاح')
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      console.error('Update user error object:', err)
      alert('حدث خطأ أثناء التحديث: ' + (err?.message || JSON.stringify(err)))
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteUser = async (usr: any) => {
    if (usr.username === 'admin' || usr.role === 'super_admin') {
      alert('لا يمكن حذف المدير الرئيسي أو المدير العام الأساسي!')
      return
    }
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${usr.username}"؟`)) return
    const { error } = await supabase.from('admins').delete().eq('id', usr.id)
    if (error) {
      console.error('Delete error:', error)
      alert('حدث خطأ أثناء الحذف: ' + (error.message || JSON.stringify(error)))
    } else {
      alert('تم الحذف بنجاح')
      fetchUsers()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right relative" dir="rtl">
      {/* جدول عرض المستخدمين في اليمين */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <Users className="text-gold size-5" /> قائمة المستخدمين المسجلين ({adminUsers.length})
        </h2>
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-800/60 text-slate-400">
            <tr>
              <th className="p-3 rounded-r-lg">المستخدم والوظيفة</th>
              <th className="p-3">الصلاحيات والنوع</th>
              <th className="p-3 rounded-l-lg text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {adminUsers.map((usr) => (
              <tr key={usr.id} className="hover:bg-slate-800/30 transition align-top">
                <td className="p-3 font-semibold text-white pt-4">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-gold" /> {usr.username}
                  </div>
                  {usr.job_title && <div className="text-xs text-slate-400 mt-1 mr-6">{usr.job_title}</div>}
                  {usr.email && <div className="text-xs text-slate-500 mt-0.5 mr-6">{usr.email}</div>}
                </td>

                <td className="p-3 py-4">
                  <div className="flex flex-wrap gap-1 max-w-sm">
                    {usr.role === 'super_admin' ? (
                      <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded text-[11px] font-bold">
                        مدير عام (صلاحيات مطلقة)
                      </span>
                    ) : (
                      usr.permissions?.map((pId: string) => {
                        const found = AVAILABLE_PERMISSIONS.find((x) => x.id === pId)
                        return (
                          <span key={pId} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                            {found?.label || pId}
                          </span>
                        )
                      })
                    )}
                  </div>
                </td>

                <td className="p-3 text-center py-4 space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleOpenEdit(usr)}
                    className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Edit className="size-3.5" /> تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteUser(usr)}
                    className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" /> حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نموذج إضافة مستخدم جديد في اليسار */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 lg:col-span-1">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gold">
          <UserPlus className="size-5" /> إضافة مستخدم جديد
        </h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">اسم المستخدم</label>
            <input
              type="text"
              required
              placeholder="مثال: sales_mohamed"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              placeholder="كلمة المرور..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              placeholder="example@domain.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">المسمى الوظيفي (اختياري)</label>
            <input
              type="text"
              placeholder="مثال: Sales Manager"
              value={newJobTitle}
              onChange={(e) => setNewJobTitle(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">نوع الصلاحية العامة</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:border-gold/50"
            >
              <option value="admin">مشرف / أدمن (صلاحيات محددة)</option>
              <option value="super_admin">مدير عام (صلاحيات مطلقة)</option>
              <option value="custom">مخصص</option>
            </select>
          </div>

          {newRole !== 'super_admin' && (
            <div>
              <label className="block text-xs text-slate-400 mb-2">تحديد الصلاحيات التفصيلية:</label>
              <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700 max-h-60 overflow-y-auto">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, perm.id])
                        } else {
                          setSelectedPermissions(selectedPermissions.filter((id) => id !== perm.id))
                        }
                      }}
                      className="size-4 accent-gold rounded cursor-pointer"
                    />
                    {perm.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={creatingUser}
            className="w-full bg-gold text-slate-950 font-bold py-3.5 rounded-xl hover:bg-gold/90 transition text-sm cursor-pointer shadow-lg"
          >
            {creatingUser ? 'جاري الإضافة...' : 'حفظ المستخدم'}
          </button>
        </form>
      </div>

      {/* نافذة تعديل المستخدم (Modal) */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-gold flex items-center gap-2">
                <Edit className="size-5" /> تعديل بيانات المستخدم: {editingUser.username}
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم المستخدم</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">كلمة المرور الجديدة (اتركها فارغة إذا لم ترد تغييرها)</label>
                <input
                  type="password"
                  placeholder="أدخل كلمة مرور جديدة أو اتركه فارغاً"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={editJobTitle}
                  onChange={(e) => setEditJobTitle(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">نوع الصلاحية العامة</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 text-sm focus:outline-none"
                >
                  <option value="admin">مشرف / أدمن (صلاحيات محددة)</option>
                  <option value="super_admin">مدير عام (صلاحيات مطلقة)</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              {editRole !== 'super_admin' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-2">تحديد الصلاحيات التفصيلية:</label>
                  <div className="space-y-2 bg-slate-800/60 p-4 rounded-xl border border-slate-700 max-h-60 overflow-y-auto">
                    {AVAILABLE_PERMISSIONS.map((perm) => (
                      <label key={perm.id} className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditPermissions([...editPermissions, perm.id])
                            } else {
                              setEditPermissions(editPermissions.filter((id) => id !== perm.id))
                            }
                          }}
                          className="size-4 accent-gold rounded cursor-pointer"
                        />
                        {perm.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-gold text-slate-950 font-bold py-3 rounded-xl hover:bg-gold/90 transition text-sm cursor-pointer"
                >
                  {updating ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="bg-slate-800 text-slate-300 px-5 py-3 rounded-xl hover:bg-slate-700 transition text-sm cursor-pointer"
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