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

  // Intentamos guardar en la base de datos
  const { error } = await supabase.from('registrations').insert({
    nombre: nombre.trim(),
    whatsapp: whatsapp.trim(),
    servicio: servicio.trim(),
  });

  if (error) {
    // Si falla, mostramos el error técnico en la terminal de Oracle
    console.error("DETALLE DEL ERROR SUPABASE:", error);
    return { 
      success: false, 
      error: 'Error al guardar: ' + (error.message || 'Error desconocido') 
    };
  }

  // Si se guardó correctamente, enviamos la notificación
  const now = new Date().toLocaleString('es-ES', {
    timeZone: 'America/Bogota',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  try {
    await sendTelegramNotification(
      `<b>Nueva Visita Registrada</b>\n\n` +
      `<b>Nombre:</b> ${nombre.trim()}\n` +
      `<b>WhatsApp:</b> ${whatsapp.trim()}\n` +
      `<b>Servicio:</b> ${servicio.trim()}\n` +
      `<b>Fecha:</b> ${now}\n\n` +
      `<i>Ministerio El Renuevo</i>`
    );
  } catch (tgError) {
    console.error("Error enviando a Telegram:", tgError);
    // Aunque falle Telegram, el registro ya se guardó en Supabase
  }

  return { success: true };
}