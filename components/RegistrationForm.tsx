'use client';

import { useState } from 'react';
import { submitRegistration } from '@/app/actions/submitRegistration';

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await submitRegistration(formData);

      if (!result.success) {
        setError(result.error || 'Error desconocido');
        return;
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      // Mostrar éxito (opcional: redirect después de 2s)
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la solicitud');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Nombre *</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="phone">Teléfono</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">
          ✓ Registro exitoso
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Guardando...' : 'Registrarse'}
      </button>
    </form>
  );
}