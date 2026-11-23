'use client';
import { useEffect, useRef, useState } from 'react';
import { company, quoteServices, waHref } from '@/content/site';

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT || '';
const DRAFT = 'delma-quote-draft';
const COOLDOWN = 'delma-quote-last';
const MAX_FILES = 5, MAX_MB = 10;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

type F = { name: string; phone: string; service: string; city: string; details: string; sizes: string };
const empty: F = { name: '', phone: '', service: '', city: 'الرياض', details: '', sizes: '' };

/** Accepts 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX, 9665XXXXXXXX (spaces/dashes ignored, Arabic digits converted) */
export function normalizeSaudiMobile(raw: string): string | null {
  const d = raw.replace(/[٠-٩]/g, (c) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\s\-()]/g, '');
  const m = d.match(/^(?:\+?966|00966|0)?(5\d{8})$/);
  return m ? '0' + m[1] : null;
}

export function QuoteForm() {
  const [f, setF] = useState<F>(empty);
  const [files, setFiles] = useState<File[]>([]);
  const [err, setErr] = useState<Partial<Record<keyof F | 'files' | 'form', string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'whatsapp'>('idle');
  const started = useRef(Date.now());
  const fileInput = useRef<HTMLInputElement>(null);

  // keep what the visitor typed if the page reloads or an error happens
  useEffect(() => { try { const d = sessionStorage.getItem(DRAFT); if (d) setF({ ...empty, ...JSON.parse(d) }); } catch {} }, []);
  useEffect(() => { try { sessionStorage.setItem(DRAFT, JSON.stringify(f)); } catch {} }, [f]);

  const set = (k: keyof F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF((s) => ({ ...s, [k]: e.target.value })); if (err[k]) setErr((x) => ({ ...x, [k]: undefined }));
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const file of Array.from(list)) {
      if (!ACCEPT.includes(file.type) && !/\.(heic|heif)$/i.test(file.name)) { setErr((x) => ({ ...x, files: `الملف «${file.name}» غير مدعوم. المسموح: صور أو PDF.` })); continue; }
      if (file.size > MAX_MB * 1024 * 1024) { setErr((x) => ({ ...x, files: `حجم «${file.name}» أكبر من ${MAX_MB} ميجابايت.` })); continue; }
      if (next.length >= MAX_FILES) { setErr((x) => ({ ...x, files: `الحد الأقصى ${MAX_FILES} ملفات.` })); break; }
      next.push(file);
    }
    setFiles(next); if (fileInput.current) fileInput.current.value = '';
  };

  const validate = () => {
    const e: typeof err = {};
    if (f.name.trim().length < 2) e.name = 'اكتب الاسم.';
    if (!normalizeSaudiMobile(f.phone)) e.phone = 'اكتب رقم جوال سعودي صحيح، مثل 05XXXXXXXX.';
    if (!f.service) e.service = 'اختر نوع الخدمة.';
    if (f.city.trim().length < 2) e.city = 'اكتب المدينة.';
    if (f.details.trim().length < 10) e.details = 'صف طلبك باختصار (10 أحرف على الأقل).';
    return e;
  };

  const message = () => [
    'السلام عليكم، طلب عرض سعر من الموقع:',
    `الاسم: ${f.name.trim()}`,
    `الجوال: ${normalizeSaudiMobile(f.phone)}`,
    `الخدمة: ${f.service}`,
    `المدينة: ${f.city.trim()}`,
    f.sizes.trim() ? `المقاسات: ${f.sizes.trim()}` : '',
    `التفاصيل: ${f.details.trim()}`,
    files.length ? `(سأرسل ${files.length} ملف/صور في المحادثة)` : '',
  ].filter(Boolean).join('\n');

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    // bot traps: hidden field + minimum fill time
    if ((form.elements.namedItem('website') as HTMLInputElement)?.value) return;
    if (Date.now() - started.current < 3000) { setErr({ form: 'يرجى مراجعة البيانات ثم الإرسال.' }); return; }
    const e = validate(); setErr(e);
    if (Object.keys(e).length) { (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus(); return; }
    try { const last = Number(localStorage.getItem(COOLDOWN) || 0); if (Date.now() - last < 60_000) { setErr({ form: 'تم إرسال طلب قبل قليل. يرجى الانتظار دقيقة قبل إرسال طلب جديد.' }); return; } } catch {}

    if (!ENDPOINT) {
      // no server endpoint configured: hand the request over to WhatsApp (never pretend it was received)
      window.open(waHref(company.phones.whatsapp, message()), '_blank', 'noopener');
      setState('whatsapp'); return;
    }
    setState('sending');
    try {
      const fd = new FormData();
      Object.entries(f).forEach(([k, v]) => fd.append(k, k === 'phone' ? normalizeSaudiMobile(v)! : v.trim()));
      files.forEach((file) => fd.append('files', file, file.name));
      const r = await fetch(ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || j.ok === false || j.success === false) throw new Error(j.error || `HTTP ${r.status}`);
      try { localStorage.setItem(COOLDOWN, String(Date.now())); sessionStorage.removeItem(DRAFT); } catch {}
      setState('sent'); setF(empty); setFiles([]);
    } catch {
      setState('idle');
      setErr({ form: 'تعذّر إرسال الطلب الآن، وبياناتك محفوظة في النموذج. حاول مرة أخرى أو أرسله عبر واتساب.' });
    }
  };

  if (state === 'sent' || state === 'whatsapp') {
    return (
      <div className="border border-line bg-white p-8 sm:p-12" role="status">
        <span className="t-kicker">{state === 'sent' ? 'RECEIVED' : 'WHATSAPP'}</span>
        <h2 className="t-h2 mt-4 text-ink">{state === 'sent' ? 'وصلنا طلبك' : 'رسالتك جاهزة في واتساب'}</h2>
        <p className="t-lead mt-4 max-w-[56ch]">
          {state === 'sent'
            ? 'شكرًا لك. سيتواصل معك فريق المؤسسة على رقم الجوال المسجّل لمراجعة التفاصيل وتقديم عرض السعر.'
            : 'فتحنا لك محادثة واتساب مع المؤسسة وفيها تفاصيل طلبك. اضغط «إرسال» هناك لتصل الرسالة، وأرفق الصور أو المخططات في نفس المحادثة.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {state === 'whatsapp' ? <a href={waHref(company.phones.whatsapp, message())} target="_blank" rel="noopener noreferrer" className="inline-flex h-[52px] items-center bg-brand px-7 text-[15px] font-medium text-white hover:bg-navy">فتح واتساب مرة أخرى</a> : null}
          <button type="button" onClick={() => { setState('idle'); started.current = Date.now(); }} className="inline-flex h-[52px] items-center border border-ink/20 px-7 text-[15px] hover:border-ink">{state === 'sent' ? 'إرسال طلب آخر' : 'تعديل الطلب'}</button>
        </div>
      </div>
    );
  }

  const field = 'mt-2 block w-full border bg-white px-4 text-[16px] text-ink outline-none transition-colors duration-300 placeholder:text-muted/70 focus:border-brand';
  const bc = (k: keyof F) => (err[k] ? 'border-[#C0392B]' : 'border-line');
  const Msg = ({ k }: { k: keyof F | 'files' }) => err[k] ? <p id={`${k}-err`} className="mt-2 text-[13px] text-[#C0392B]">{err[k]}</p> : null;

  return (
    <form onSubmit={submit} noValidate className="relative border border-line bg-white p-6 sm:p-10" aria-describedby={err.form ? 'form-err' : undefined}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-[14px] font-medium text-ink">الاسم <span className="text-[#C0392B]">*</span></span>
          <input name="name" autoComplete="name" value={f.name} onChange={set('name')} aria-invalid={!!err.name} aria-describedby={err.name ? 'name-err' : undefined} className={`${field} h-[52px] ${bc('name')}`} />
          <Msg k="name" />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-ink">رقم الجوال <span className="text-[#C0392B]">*</span></span>
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="05XXXXXXXX" value={f.phone} onChange={set('phone')} aria-invalid={!!err.phone} aria-describedby={err.phone ? 'phone-err' : undefined} className={`${field} h-[52px] text-right ${bc('phone')}`} />
          <Msg k="phone" />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-ink">نوع الخدمة <span className="text-[#C0392B]">*</span></span>
          <select name="service" value={f.service} onChange={set('service')} aria-invalid={!!err.service} aria-describedby={err.service ? 'service-err' : undefined} className={`${field} h-[52px] ${bc('service')}`}>
            <option value="">اختر الخدمة</option>
            {quoteServices.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <Msg k="service" />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium text-ink">المدينة <span className="text-[#C0392B]">*</span></span>
          <input name="city" autoComplete="address-level2" value={f.city} onChange={set('city')} aria-invalid={!!err.city} aria-describedby={err.city ? 'city-err' : undefined} className={`${field} h-[52px] ${bc('city')}`} />
          <Msg k="city" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[14px] font-medium text-ink">وصف الطلب <span className="text-[#C0392B]">*</span></span>
          <textarea name="details" rows={4} value={f.details} onChange={set('details')} placeholder="مثال: 6 أبواب WPC لغرف فيلا، لون خشبي فاتح، مع التركيب." aria-invalid={!!err.details} aria-describedby={err.details ? 'details-err' : undefined} className={`${field} py-3 leading-8 ${bc('details')}`} />
          <Msg k="details" />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[14px] font-medium text-ink">المقاسات <span className="text-[13px] font-normal text-muted">(اختياري)</span></span>
          <input name="sizes" value={f.sizes} onChange={set('sizes')} placeholder="مثال: 90×210 سم — 4 أبواب" className={`${field} h-[52px] border-line`} />
        </label>
        <div className="sm:col-span-2">
          <span className="text-[14px] font-medium text-ink">صور أو مخططات <span className="text-[13px] font-normal text-muted">(اختياري — حتى {MAX_FILES} ملفات، {MAX_MB} ميجابايت لكل ملف)</span></span>
          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-mist px-4 py-8 text-center transition-colors hover:border-brand"
            onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
            <svg aria-hidden width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-brand"><path d="M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span className="text-[15px] text-ink">اسحب الملفات هنا أو اضغط للاختيار</span>
            <span className="text-[13px] text-muted">JPG · PNG · HEIC · PDF</span>
            <input ref={fileInput} type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={(e) => addFiles(e.target.files)} />
          </label>
          {files.length ? (
            <ul className="mt-3 divide-y divide-line border border-line">
              {files.map((file, i) => (
                <li key={file.name + i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
                  <span className="truncate" dir="ltr">{file.name}</span>
                  <button type="button" onClick={() => setFiles((x) => x.filter((_, k) => k !== i))} className="shrink-0 text-[13px] text-[#C0392B] hover:underline">إزالة</button>
                </li>
              ))}
            </ul>
          ) : null}
          <Msg k="files" />
          {!ENDPOINT && files.length ? <p className="mt-2 text-[13px] text-muted">سيُفتح واتساب برسالة طلبك؛ أرفق هذه الملفات في المحادثة نفسها.</p> : null}
        </div>
      </div>

      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>الموقع<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      {err.form ? <p id="form-err" role="alert" className="mt-6 border-r-2 border-[#C0392B] bg-[#FBEFEE] px-4 py-3 text-[14px] text-[#8E2B20]">{err.form}</p> : null}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={state === 'sending'} className="inline-flex h-[52px] items-center gap-3 bg-brand px-8 text-[15px] font-medium text-white transition-colors hover:bg-navy disabled:cursor-not-allowed disabled:opacity-60">
          {state === 'sending' ? 'جارٍ الإرسال…' : ENDPOINT ? 'إرسال الطلب' : 'إرسال الطلب عبر واتساب'}
        </button>
        <a href={waHref(company.phones.whatsapp)} target="_blank" rel="noopener noreferrer" className="ulink text-[14px] text-brand">أو راسلنا مباشرة على واتساب</a>
      </div>
    </form>
  );
}
