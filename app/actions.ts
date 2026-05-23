'use server';

import { supabase } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

export async function submitRegistration(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const servicio = formData.get('servicio') as string;

  if (!nombre?.trim() || !whatsapp?.trim() || !servicio?.trim()) {
    return { success: false, error: 'Todos los campos son requeridos.' };
  }

  const { error } = await supabase.from('registrations').insert({
    nombre: nombre.trim(),
    whatsapp: whatsapp.trim(),
    servicio: servicio.trim(),
  });

  if (error) {
    return { success: false, error: 'Error al guardar el registro.' };
  }

  const now = new Date().toLocaleString('es-ES', {
    timeZone: 'America/Bogota',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  await sendTelegramNotification(
    `<b>Nueva Visita Registrada</b>\n\n` +
    `<b>Nombre:</b> ${nombre.trim()}\n` +
    `<b>WhatsApp:</b> ${whatsapp.trim()}\n` +
    `<b>Servicio:</b> ${servicio.trim()}\n` +
    `<b>Fecha:</b> ${now}\n\n` +
    `<i>Ministerio El Renuevo</i>`
  );

  return { success: true };
}
