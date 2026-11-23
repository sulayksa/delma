import type { Metadata } from 'next';
import { DoorStudio } from '@/components/studio/DoorStudio';

export const metadata: Metadata = {
  title: 'استوديو الأبواب ثلاثي الأبعاد',
  description: 'جرّب أبواب WPC من دلما الجزيرة بتقنية ثلاثية الأبعاد: اختر الموديل من 4 موديلات واللون من 19 لونًا ولون المقبض، ودوّر الباب وافتحه.',
  alternates: { canonical: '/door-studio/' },
};

export default function Page() {
  return <DoorStudio />;
}
