import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Save, Edit3, User } from 'lucide-react';
// مكون جدول تقارير المتابعة والمبيعات مع خاصية الإسناد والتعديل المباشر وربط العقارات
function LeadsReportTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [editEmployee, setEditEmployee] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editInspection, setEditInspection] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        properties (
          id,
          title,
          price
        )
      `)
      .order('created_at', { ascending: false });
      
    if (!error) {
      setLeads(data || []);
    }
    setLoading(false);
  }

  const startEditing = (lead: any) => {
    setEditingId(lead.id);
    setEditEmployee(lead.employee_name || '');
    setEditStatus(lead.interaction_status || 'جديد');
    setEditInspection(lead.has_inspection || false);
    setEditNotes(lead.last_notes || '');
  };

  const saveChanges = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .update({
        employee_name: editEmployee,
        interaction_status: editStatus,
        has_inspection: editInspection === true || editInspection === 'تمت المعاينة' as any,
        last_notes: editNotes,
        updated_at: new Date()
      })
      .eq('id', id);

    if (error) {
      alert('حدث خطأ أثناء التحديث: ' + error.message);
    } else {
      setEditingId(null);
      fetchLeads();
    }
  };

  if (loading) return <div className="text-gold text-center py-8 text-xs">جاري تحميل تقارير المتابعة...</div>;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white">متابعة أداء فريق المبيعات والعملاء</h3>
          <p className="text-slate-400 text-xs mt-1">تابع حالة العملاء، الموظف المسؤول، ومعاينات الأرض لحساب العمولات بدقة.</p>
        </div>
        <span className="bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full text-xs font-bold">
          إجمالي العملاء: {leads.length}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs">
                <th className="p-4">اسم العميل / البيانات / العقار</th>
                <th className="p-4">الموظف المسؤول</th>
                <th className="p-4">حالة العميل</th>
                <th className="p-4">المعاينة</th>
                <th className="p-4">آخر ملاحظة</th>
                <th className="p-4">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {leads.length > 0 ? (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-bold text-white">
                      {lead.name || lead.title || 'عميل بدون اسم'}
                      <span className="block text-[10px] text-emerald-400 font-normal mt-0.5">{lead.phone || lead.email}</span>
                      {lead.properties ? (
                        <a 
                          href={`/properties/${lead.properties.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block text-[11px] text-gold hover:underline mt-1 font-semibold truncate max-w-[220px]"
                          title={lead.properties.title}
                        >
                          العقار: {lead.properties.title}
                        </a>
                      ) : (
                        <span className="block text-[10px] text-slate-500 mt-1">استشارة عامة</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {editingId === lead.id ? (
                        <input
                          type="text"
                          value={editEmployee}
                          onChange={(e) => setEditEmployee(e.target.value)}
                          placeholder="اسم الموظف..."
                          className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white w-full"
                        />
                      ) : (
                        <div className="flex items-center gap-1.5 text-gold font-semibold">
                          <User className="size-3.5" />
                          <span>{lead.employee_name || 'غير مسند'}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {editingId === lead.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                        >
                          <option value="جديد">جديد</option>
                          <option value="قيّد المتابعة">قيّد المتابعة</option>
                          <option value="مهتم جداً">مهتم جداً</option>
                          <option value="تم البيع">تم البيع</option>
                          <option value="غير مهتم">غير مهتم</option>
                        </select>
                      ) : (
                        <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                          {lead.interaction_status || 'جديد'}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      {editingId === lead.id ? (
                        <select
                          value={editInspection ? 'تمت المعاينة' : 'لم تتم'}
                          onChange={(e) => setEditInspection(e.target.value === 'تمت المعاينة')}
                          className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                        >
                          <option value="لم تتم">لم تتم</option>
                          <option value="تمت المعاينة">تمت المعاينة</option>
                        </select>
                      ) : (
                        lead.has_inspection === true ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                            <CheckCircle className="size-3.5" /> تمت المعاينة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                            <XCircle className="size-3.5" /> لم تتم
                          </span>
                        )
                      )}
                    </td>

                    <td className="p-4 max-w-xs truncate text-slate-400">
                      {editingId === lead.id ? (
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="اكتب ملاحظة..."
                          className="bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white w-full"
                        />
                      ) : (
                        lead.last_notes || 'لا توجد ملاحظات'
                      )}
                    </td>

                    <td className="p-4">
                      {editingId === lead.id ? (
                        <button
                          onClick={() => saveChanges(lead.id)}
                          className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Save className="size-3.5" /> حفظ
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(lead)}
                          className="bg-gold/10 text-gold hover:bg-gold hover:text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Edit3 className="size-3.5" /> إسناد وتعديل
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    لا توجد بيانات مسجلة حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}