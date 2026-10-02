import Link from 'next/link';
import { MapPin, Bed, Bath, Ruler, Layers, Sparkles } from 'lucide-react';

export interface Property {
  id: string;
  title: string;
  location: string;
  cities?: {
    name: string;
  };
  type: string;
  price: number;
  image_url?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: string | number;
  finishing?: string;
}

const statusStyles: Record<string, string> = {
  'متاح': 'border-emerald/40 bg-emerald/15 text-emerald',
  'بيع سريع': 'border-gold/40 bg-gold/15 text-gold',
  'قريباً': 'border-border bg-secondary text-muted-foreground',
}

export function FeaturedProjects({ 
  projects = [], 
  title, 
  subtitle 
}: { 
  projects?: Property[], 
  title?: string, 
  subtitle?: string 
}) {
  return (
    <section id="projects" className="border-y border-border/60 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-emerald">
            مشاريع مختارة
          </span>
          
          <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
            {title || "وحدات فاخرة بانتظارك"}
          </h2>
          
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {subtitle || "مجموعة منتقاة بعناية من أفضل الفرص العقارية بأسعار تنافسية وخطط سداد مرنة."}
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-gold/50 hover:shadow-2xl"
            >
              {/* صورة العقار والحالة */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800'}
                  alt={item.title}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${statusStyles[item.status || 'متاح'] || statusStyles['متاح']}`}
                >
                  {item.status || 'متاح'}
                </span>
              </div>

              {/* تفاصيل العقار */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MapPin className="size-3.5 text-gold" />
                  {item.cities?.name || item.location} • {item.type}
                </div>

                <h3 className="mt-2 text-lg font-bold text-foreground group-hover:text-gold transition-colors">
                  {item.title}
                </h3>

                {/* شبكة تفاصيل العقار الجديدة (غرف، حمامات، مساحة، دور، تشطيب) */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-secondary/50 p-3 text-xs text-muted-foreground border border-border/40">
                  {item.bedrooms !== undefined && item.bedrooms !== null && (
                    <div className="flex items-center gap-1.5">
                      <Bed className="size-3.5 text-gold" />
                      <span>{item.bedrooms} غرف</span>
                    </div>
                  )}
                  {item.bathrooms !== undefined && item.bathrooms !== null && (
                    <div className="flex items-center gap-1.5">
                      <Bath className="size-3.5 text-gold" />
                      <span>{item.bathrooms} حمام</span>
                    </div>
                  )}
                  {item.area !== undefined && item.area !== null && (
                    <div className="flex items-center gap-1.5">
                      <Ruler className="size-3.5 text-gold" />
                      <span>{item.area} م²</span>
                    </div>
                  )}
                  {item.floor !== undefined && item.floor !== null && (
                    <div className="flex items-center gap-1.5">
                      <Layers className="size-3.5 text-gold" />
                      <span>الدور {item.floor}</span>
                    </div>
                  )}
                  {item.finishing && (
                    <div className="col-span-2 flex items-center gap-1.5 border-t border-border/40 pt-2 mt-1">
                      <Sparkles className="size-3.5 text-gold" />
                      <span>{item.finishing}</span>
                    </div>
                  )}
                </div>

                {/* السعر وزر التفاصيل */}
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                  <div>
                    <span className="block text-[10px] text-muted-foreground">تبدأ الأسعار من</span>
                    <span className="text-base font-bold text-gold">
                      {item.price ? `${item.price.toLocaleString('ar-EG')} ج.م` : "عند الطلب"}
                    </span>
                  </div>
                  <Link 
                    href={`/properties/${item.id}`} 
                    className="rounded-lg bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold hover:text-slate-950 transition"
                  >
                    التفاصيل
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}