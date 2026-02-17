'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EntryPage() {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');

    if (!token) {
      router.replace('/auth/login');
      return;
    }

    if (role === 'User') {
      router.replace('/');   // PUBLIC SITE
      return;
    }

    if (['Admin', 'Editor', 'Viewer'].includes(role)) {
      router.replace('/dashboard');
      return;
    }

    router.replace('/auth/login');

  }, []);

  return null;
}