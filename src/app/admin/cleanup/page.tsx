'use client';

import { useState } from 'react';

export default function CleanupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const cleanupUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'İstek başarısız oldu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🗑️ Kullanıcı Temizleme
        </h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Bu işlem tüm kullanıcıları silecek ve sadece admin kullanıcısını bırakacak.
          </p>
          
          <button
            onClick={cleanupUsers}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? '⏳ Temizleniyor...' : '🗑️ Kullanıcıları Temizle'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold mb-2">Sonuç:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
