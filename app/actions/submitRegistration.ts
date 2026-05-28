'use server';

import { createAuthenticatedSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

interface RegistrationData {
  email: string;
  name: string;
  phone?: string;
}

export async function submitRegistration(formData: FormData): Promise<{ 
  success: boolean; 
  error?: string;
  data?: any;
}> {
  try {
    // 1. Validación de datos
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string || null;

    if (!email || !name) {
      return { success: false, error: 'Email y nombre son requeridos' };
    }

    if (!email.match(/^[\w-.]+@[\w-.]+\.\w+$/)) {
      return { success: false, error: 'Email inválido' };
    }

    // 2. Crear cliente Supabase AUTENTICADO
    const supabase = await createAuthenticatedSupabaseClient();

    // 3. Verificar sesión del usuario
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return { success: false, error: 'No estás autenticado' };
    }

    // 4. Insertar en base de datos
    const { data, error } = await supabase
      .from('registrations')
      .insert({
        email,
        name,
        phone,
        user_id: userData.user.id, // ← Vincular al usuario autenticado
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return { 
        success: false, 
        error: `Error en BD: ${error.message}`
      };
    }

    // 5. Revalidar datos en caché (si usas ISR o similar)
    revalidatePath('/registrations');

    return { 
      success: true, 
      data: data?.[0]
    };

  } catch (err) {
    console.error('❌ Error en server action:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Error desconocido'
    };
  }
}