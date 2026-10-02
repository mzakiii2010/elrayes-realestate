'use client'

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MapPin, Check, ArrowRight, Bed, Bath, Maximize, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PropertyActions } from "@/components/property-actions";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    async function fetchProp() {
      const resolvedParams = await params;
      const { data } = await supabase
        .from("properties")
        .select(`*, cities (name)`)
        .eq("id", resolvedParams.id)
        .single();

      if (data) {
        setProperty(data);
        setActiveImage(data.image_url || "");
      }
      setLoading(false);
    }
    fetchProp();
  }, [params]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">جاري التحميل...</div>;
  }

  if (!property) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">العقار غير موجود</div>;
  }

  // معالجة الصور الإضافية والرئيسية
  let parsedImages: string[] = [];
  if (Array.isArray(property.images)) {
    parsedImages = property.images;
  } else if (typeof property.images === 'string') {
    try {
      parsedImages = JSON.parse(property.images);
    } catch {
      parsedImages = property.images.split(',').map((s: string) => s.trim());
    }
  }

  const allImages = Array.from(
    new Set([property.image_url, ...parsedImages].filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-gold mb-6 transition text-sm font-medium"
        >
          <ArrowRight className="size-4" /> العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* الصورة الرئيسية الكبرى المتفاعلة */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl bg-slate-900">
              <img
                src={activeImage || property.image_url}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-4 right-4 bg-slate-900/90 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                {property.type || "عقار فاخر"}
              </span>
            </div>

            {/* معرض الصور الإضافية */}
            {allImages.length > 1 && (
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-200">معرض الصور ({allImages.length})</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((imgUrl, index) => (
                    <button
                      key={`gallery-img-${index}-${imgUrl}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveImage(imgUrl);
                      }}
                      className={`relative w-28 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                        activeImage === imgUrl ? 'border-[#D4AF37] scale-105 shadow-lg' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 text-gold text-sm font-semibold">
                <MapPin className="size-4" /> {property.cities?.name || property.location || "المدينة غير محددة"}
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {property.title}
              </h1>

              {/* تفاصيل العقار الحقيقية (الغرف، الحمامات، المساحة، الدور، التشطيب) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-800 py-6">
                {property.bedrooms && (
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <Bed className="size-5 text-gold" />
                    <div>
                      <span className="block text-[11px] text-slate-400">الغرف</span>
                      <span className="text-sm font-bold text-white">{property.bedrooms} غرف</span>
                    </div>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <Bath className="size-5 text-gold" />
                    <div>
                      <span className="block text-[11px] text-slate-400">الحمامات</span>
                      <span className="text-sm font-bold text-white">{property.bathrooms} حمامات</span>
                    </div>
                  </div>
                )}

                {property.area && (
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <Maximize className="size-5 text-gold" />
                    <div>
                      <span className="block text-[11px] text-slate-400">المساحة</span>
                      <span className="text-sm font-bold text-white">{property.area} م²</span>
                    </div>
                  </div>
                )}

                {property.floor && (
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <Layers className="size-5 text-gold" />
                    <div>
                      <span className="block text-[11px] text-slate-400">الدور</span>
                      <span className="text-sm font-bold text-white">{property.floor}</span>
                    </div>
                  </div>
                )}

                {property.finishing && (
                  <div className="flex items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-2">
                    <ShieldCheck className="size-5 text-gold" />
                    <div>
                      <span className="block text-[11px] text-slate-400">التشطيب</span>
                      <span className="text-sm font-bold text-white">{property.finishing}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-200 mb-3">مميزات إضافية</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-400 text-sm">
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> موقع متميز بالكمبوند</li>
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> خطط سداد وتسهيلات حصرية</li>
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> استلام فوري / تبعا للاتفاق</li>
                  <li className="flex items-center gap-2"><Check className="size-4 text-emerald-400" /> حراسة وأمن 24 ساعة</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <PropertyActions property={property} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}