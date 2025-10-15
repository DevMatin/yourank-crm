import { redirect } from 'next/navigation';

export default function RootPage() {
  // This will be handled by middleware, but we need this file for Next.js
  redirect('/dashboard');
}
