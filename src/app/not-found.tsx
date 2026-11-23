import { Button } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-mist pt-[88px]">
      <div className="wrap">
        <span className="num t-kicker">404</span>
        <h1 className="t-h1 mt-5 text-ink">الصفحة غير موجودة</h1>
        <p className="t-lead mt-4">ربما تغيّر رابط الصفحة. يمكنك العودة إلى الرئيسية أو تصفح منتجاتنا.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Button href="/">الرئيسية</Button><Button href="/products/" variant="ghost">منتجاتنا وخدماتنا</Button></div>
      </div>
    </section>
  );
}
