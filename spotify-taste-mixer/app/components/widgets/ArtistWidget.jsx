'use client';

import { useState, useEffect } from 'react';
import { Music, Search, X } from 'lucide-react';
import { getAccessToken } from '@/lib/auth';

export default function ArtistWidget({ selected, onSelect }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchArtists = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.artists.items);
      }
    } catch (error) {
      console.error('Error buscando artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchArtists(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleArtist = (artist) => {
    if (selected.find(a => a.id === artist.id)) {
      onSelect(selected.filter(a => a.id !== artist.id));
    } else if (selected.length < 5) {
      onSelect([...selected, artist]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-green-500" />
        Artistas Favoritos
      </h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar artistas..."
          className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Seleccionados ({selected.length}/5):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(artist => (
              <div key={artist.id} className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm">{artist.name}</span>
                <button onClick={() => toggleArtist(artist)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-gray-400 text-sm">Buscando...</p>}
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {results.map(artist => (
          <button
            key={artist.id}
            onClick={() => toggleArtist(artist)}
            disabled={selected.length >= 5 && !selected.find(a => a.id === artist.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              selected.find(a => a.id === artist.id)
                ? 'bg-green-600'
                : selected.length >= 5
                ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {artist.images[0] ? (
              <img 
                src={artist.images[0].url} 
                alt={artist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="text-white font-medium">{artist.name}</p>
              <p className="text-gray-400 text-xs">
                {artist.followers?.total?.toLocaleString()} seguidores
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}