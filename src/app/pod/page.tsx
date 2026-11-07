import { redirect } from 'next/navigation';

export default function PodPage() {
  redirect('/dashboard?tab=pod');
}
