import { ADMIN_ROUTES } from '@/lib/route';
import { redirect } from 'next/navigation';

export default function AdminPage() {
    redirect(ADMIN_ROUTES.login);
}
