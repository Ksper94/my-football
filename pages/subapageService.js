// pages/subapageService.js
import { useEffect, useState } from 'react';
import { supabaseService } from '../utils/supabaseService';

export default function SubapageService() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Exemple : Récupérer des données de la table 'services'
        const { data, error } = await supabaseService
          .from('services')
          .select('*');

        if (error) throw error;

        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-8">Chargement...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Erreur : {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Nos Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((service) => (
          <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
