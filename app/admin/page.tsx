'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Building, Users, FileText, ShieldAlert, Home, PlusCircle, Building2, ClipboardList, CheckCircle, XCircle, User, Edit3, Save, LayoutDashboard, Menu, X } from 'lucide-react';
import AddPropertyTab from '@/components/admin/AddPropertyTab';
import PropertiesTab from '@/components/admin/PropertiesTab';
import UsersTab from '@/components/admin/UsersTab';
import ContentTab from '@/components/admin/ContentTab';
import PendingPropertiesTab from '@/components/admin/PendingPropertiesTab';
import CitiesTab from '@/components/admin/CitiesTab';
import { supabase } from '@/lib/supabase';

// مكون الصفحة الرئيسية لإحصائيات لوحة التحكم وجداول البيانات لملء المساحة الفارغة
function DashboardOverviewTab({ changeTab, permissions, role }: { changeTab: (tab: string) => void; permissions: string[]; role: string }) {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingProperties: 0,
    totalLeads: 0,
    totalCities: 0
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const canShow = (perm: string) => role === 'super_admin' || !permissions || permissions.length === 0 || permissions.includes(perm);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const { count: propCount } = await supabase.from('properties').select('*', { count: 'exact', head: true });
        const { count: pendingCount } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending');
        const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
        const { count: citiesCount } = await supabase.from('cities').select('*', { count: 'exact', head: true });

        setStats({
          totalProperties: propCount || 0,
          pendingProperties: pendingCount || 0,
          totalLeads: leadsCount || 0,
          totalCities: citiesCount || 0
        });

        const { data: propData } = await supabase.from('properties').select('id, title, price, city, status, created_at').order('created_at', { ascending: false }).limit(5);
        if (propData) setRecentProperties(propData);

        const { data: leadData } = await supabase.from('leads').select('id, name, phone, interaction_status, created_at').order('created_at', { ascending: false }).limit(5);
        if (leadData) setRecentLeads(leadData);

      } catch (error) {
        console.error('خطأ في جلب بيانات لوحة التحكم:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 text-right pb-10" dir="rtl">
      {/* رأس لوحة التحكم */}
      <div className="bg-gradient-to-l from-slate-900 to-slate-900/80 border border-slate-800 p-5 sm:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute left-0 top-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">مرحباً بك في لوحة تحكم المنصة العقارية</h2>
          <p className="text-slate-400 text-xs sm:text-sm">نظرة عامة ومؤشرات الأداء السريعة لإدارة العقارات والمشاريع والعملاء بكفاءة واحترافية.</p>
        </div>
        <div className="z-10 w-full md:w-auto">
          {canShow('add_property') && (
            <button
              onClick={() => changeTab('add')}
              className="w-full md:w-auto bg-gold hover:bg-gold/90 text-slate-950 font-bold px-6 py-3 rounded-2xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="size-5" /> إضافة عقار جديد
            </button>
          )}
        </div>
      </div>

      {/* بطاقات الإحصائيات بترتيب وعرض منظم جداً */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div 
          onClick={() => canShow('view_properties') && changeTab('properties')}
          className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl cursor-pointer hover:border-gold/60 hover:bg-slate-900/80 transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">إجمالي العقارات</span>
            <div className="p-3 bg-gold/10 text-gold rounded-2xl group-hover:scale-110 transition-transform">
              <Home className="size-6" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-white">{loading ? '...' : stats.totalProperties}</h3>
            <p className="text-xs text-slate-500 mt-1.5 font-medium">العقارات والمشاريع المسجلة بالمنصة</p>
          </div>
        </div>

        <div 
          onClick={() => canShow('view_properties') && changeTab('pending')}
          className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl cursor-pointer hover:border-amber-500/60 hover:bg-slate-900/80 transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">العقارات المعلقة</span>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <ShieldAlert className="size-6" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-white">{loading ? '...' : stats.pendingProperties}</h3>
            <p className="text-xs text-amber-400/80 mt-1.5 font-medium">بانتظار المراجعة والنشر</p>
          </div>
        </div>

        <div 
          onClick={() => canShow('view_leads') && changeTab('leads-report')}
          className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl cursor-pointer hover:border-emerald-500/60 hover:bg-slate-900/80 transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">استفسارات وطلبات العملاء</span>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
              <ClipboardList className="size-6" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-white">{loading ? '...' : stats.totalLeads}</h3>
            <p className="text-xs text-emerald-400/80 mt-1.5 font-medium">عملاء محتملون ومتابعات مبيعات</p>
          </div>
        </div>

        <div 
          onClick={() => canShow('view_properties') && changeTab('cities')}
          className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl cursor-pointer hover:border-blue-500/60 hover:bg-slate-900/80 transition-all duration-300 shadow-xl group flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">المدن والمناطق</span>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
              <Building2 className="size-6" />
            </div>
          </div>
          <div className="mt-4 sm:mt-6">
            <h3 className="text-3xl sm:text-4xl font-black text-white">{loading ? '...' : stats.totalCities}</h3>
            <p className="text-xs text-blue-400/80 mt-1.5 font-medium">المدن المتاحة للتصفية والبحث</p>
          </div>
        </div>
      </div>

      {/* جداول لملء الفراغ بشكل احترافي */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* جدول أحدث العقارات */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Home className="text-gold size-5" /> أحدث العقارات المضافة
            </h3>
            <button onClick={() => changeTab('properties')} className="text-xs text-gold hover:underline font-semibold cursor-pointer">عرض الكل</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs min-w-[450px]">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="p-3 rounded-r-xl">العنوان</th>
                  <th className="p-3">المدينة</th>
                  <th className="p-3">السعر</th>
                  <th className="p-3 rounded-l-xl text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentProperties.length > 0 ? (
                  recentProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white truncate max-w-[150px]">{p.title}</td>
                      <td className="p-3 text-slate-300">{p.city || 'غير محدد'}</td>
                      <td className="p-3 text-gold font-semibold">{p.price ? `${p.price} ج.م` : 'غير متوفر'}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                          {p.status === 'pending' ? 'معلق' : 'منشور'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-500">لا توجد عقارات مضافة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* جدول أحدث العملاء */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <ClipboardList className="text-emerald-400 size-5" /> أحدث استفسارات العملاء (Leads)
            </h3>
            <button onClick={() => changeTab('leads-report')} className="text-xs text-gold hover:underline font-semibold cursor-pointer">عرض الكل</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs min-w-[400px]">
              <thead className="bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="p-3 rounded-r-xl">اسم العميل</th>
                  <th className="p-3">رقم الهاتف</th>
                  <th className="p-3 rounded-l-xl text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentLeads.length > 0 ? (
                  recentLeads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/30">
                      <td className="p-3 font-bold text-white truncate max-w-[120px]">{l.name || l.title || 'بدون اسم'}</td>
                      <td className="p-3 text-emerald-400 font-mono" dir="ltr">{l.phone || 'غير مسجل'}</td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded-lg text-[10px] font-medium border border-slate-700">
                          {l.interaction_status || 'جديد'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-slate-500">لا توجد استفسارات جديدة</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// مكون جدول تقارير المتابعة والمبيعات
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
      .select('*, properties (id, title, price)')
      .order('created_at', { ascending: false });
      
    if (!error) setLeads(data || []);
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
        has_inspection: editInspection, 
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

  if (loading) return <div className="text-gold text-center py-12 text-sm font-semibold">جاري تحميل تقارير المتابعة...</div>;

  return (
    <div className="space-y-6 text-right pb-10" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">متابعة أداء فريق المبيعات والعملاء</h3>
          <p className="text-slate-400 text-xs mt-1">تابع حالة العملاء، الموظف المسؤول، ومعاينات الأرض لحساب العمولات بدقة.</p>
        </div>
        <span className="bg-gold/10 text-gold border border-gold/20 px-4 py-2 rounded-2xl text-xs font-bold shadow-inner">
          إجمالي العملاء: {leads.length}
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 sm:p-5">اسم العميل / البيانات / العقار</th>
                <th className="p-4 sm:p-5">الموظف المسؤول</th>
                <th className="p-4 sm:p-5">حالة العميل</th>
                <th className="p-4 sm:p-5">المعاينة</th>
                <th className="p-4 sm:p-5">آخر ملاحظة</th>
                <th className="p-4 sm:p-5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {leads.length > 0 ? (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition align-middle">
                    <td className="p-4 sm:p-5 font-bold text-white">
                      {lead.name || lead.title || 'عميل بدون اسم'}
                      <span className="block text-[11px] text-emerald-400 font-normal mt-1">{lead.phone || lead.email}</span>
                      {lead.properties && (
                        <a href={`/properties/${lead.properties.id}`} target="_blank" rel="noopener noreferrer" className="block text-[11px] text-gold hover:underline mt-1.5 font-semibold truncate max-w-[200px]">
                          العقار: {lead.properties.title}
                        </a>
                      )}
                    </td>
                    
                    <td className="p-4 sm:p-5">
                      {editingId === lead.id ? (
                        <input type="text" value={editEmployee} onChange={(e) => setEditEmployee(e.target.value)} placeholder="اسم الموظف..." className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white w-full focus:outline-none focus:border-gold" />
                      ) : (
                        <div className="flex items-center gap-2 text-gold font-semibold">
                          <User className="size-4 shrink-0" />
                          <span className="truncate">{lead.employee_name || 'غير مسند'}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4 sm:p-5">
                      {editingId === lead.id ? (
                        <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold">
                          <option value="جديد">جديد</option>
                          <option value="قيّد المتابعة">قيّد المتابعة</option>
                          <option value="مهتم جداً">مهتم جداً</option>
                          <option value="تم البيع">تم البيع</option>
                          <option value="غير مهتم">غير مهتم</option>
                        </select>
                      ) : (
                        <span className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 font-medium inline-block">
                          {lead.interaction_status || 'جديد'}
                        </span>
                      )}
                    </td>

                    <td className="p-4 sm:p-5">
                      {editingId === lead.id ? (
                        <select value={editInspection ? 'تمت المعاينة' : 'لم تتم'} onChange={(e) => setEditInspection(e.target.value === 'تمت المعاينة')} className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold">
                          <option value="لم تتم">لم تتم</option>
                          <option value="تمت المعاينة">تمت المعاينة</option>
                        </select>
                      ) : (
                        lead.has_inspection === true ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 whitespace-nowrap">
                            <CheckCircle className="size-4 shrink-0" /> تمت المعاينة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 whitespace-nowrap">
                            <XCircle className="size-4 shrink-0" /> لم تتم
                          </span>
                        )
                      )}
                    </td>

                    <td className="p-4 sm:p-5 max-w-[150px] truncate text-slate-400">
                      {editingId === lead.id ? (
                        <input type="text" value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="اكتب ملاحظة..." className="bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white w-full focus:outline-none focus:border-gold" />
                      ) : (
                        lead.last_notes || 'لا توجد ملاحظات'
                      )}
                    </td>

                    <td className="p-4 sm:p-5 text-center">
                      {editingId === lead.id ? (
                        <button onClick={() => saveChanges(lead.id)} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-lg">
                          <Save className="size-4" /> حفظ
                        </button>
                      ) : (
                        <button onClick={() => startEditing(lead)} className="bg-gold/10 text-gold hover:bg-gold hover:text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-md whitespace-nowrap">
                          <Edit3 className="size-4" /> تعديل
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">لا توجد بيانات مسجلة حتى الآن.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>('admin');
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserPermissions(parsed.permissions || []);
        setUserRole(parsed.role || 'admin');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const changeTab = (tabName: string) => {
    router.push(`/admin?tab=${tabName}`);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const hasPermission = (permissionName: string) => {
    if (userRole === 'super_admin') return true;
    if (!userPermissions || userPermissions.length === 0) return true;
    return userPermissions.includes(permissionName);
  };

  const navItems = [
    { id: 'overview', label: 'الرئيسية', icon: LayoutDashboard, perm: null },
    { id: 'properties', label: 'إدارة العقارات', icon: Home, perm: 'view_properties' },
    { id: 'add', label: 'إضافة عقار', icon: PlusCircle, perm: 'add_property' },
    { id: 'cities', label: 'إدارة المدن', icon: Building2, perm: 'view_properties' },
    { id: 'users', label: 'إدارة المستخدمين', icon: Users, perm: 'manage_users' },
    { id: 'content', label: 'تعديل النصوص', icon: FileText, perm: 'manage_users' },
    { id: 'pending', label: 'العقارات المعلقة', icon: ShieldAlert, perm: 'view_properties' },
    { id: 'leads-report', label: 'متابعة المبيعات', icon: ClipboardList, perm: 'view_leads' },
  ];

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold font-bold">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row overflow-x-hidden" dir="rtl">
      
      {/* شريط علوي للموبايل فقط لإظهار زر القائمة وعنوان اللوحة */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <h1 className="text-base font-black text-gold tracking-wide">لوحة التحكم العقارية</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/60 border border-slate-700 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* خلفية معتمة تظهر عند فتح القائمة على الموبايل */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* القائمة الجانبية (Sidebar) متجاوبة مع الموبايل والشاشات الكبيرة */}
      <aside className={`
        fixed lg:static top-0 right-0 h-full lg:h-auto z-50
        w-72 bg-slate-900 border-l border-slate-800 p-6 
        flex flex-col justify-between shrink-0 shadow-2xl
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8 overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-none">
          <div className="hidden lg:flex items-center justify-between px-2 pt-2">
            <h1 className="text-xl font-black text-gold tracking-wide">لوحة التحكم العقارية</h1>
          </div>

          <div className="flex lg:hidden items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-sm font-bold text-gold">القائمة الرئيسية</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2.5">
            {navItems.map((item) => {
              if (item.perm && !hasPermission(item.perm)) return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => changeTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive ? 'bg-gold text-slate-950 shadow-lg shadow-gold/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon size={20} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-slate-950 overflow-y-auto">
        {activeTab === 'overview' && <DashboardOverviewTab changeTab={changeTab} permissions={userPermissions} role={userRole} />}
        {activeTab === 'properties' && <PropertiesTab userRole={userRole} userPermissions={userPermissions} />}
        {activeTab === 'add' && <AddPropertyTab />}
        {activeTab === 'cities' && <CitiesTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'content' && <ContentTab />}
        {activeTab === 'pending' && <PendingPropertiesTab />}
        {activeTab === 'leads-report' && <LeadsReportTab />}
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-gold font-bold">جاري التحميل...</div>}>
      <AdminContent />
    </Suspense>
  );
}