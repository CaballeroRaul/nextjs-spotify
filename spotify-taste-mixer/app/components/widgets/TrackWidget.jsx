'use client';

import { useState, useEffect } from 'react';
import { Music, Search, X } from 'lucide-react';
import { getAccessToken } from '@/lib/auth';

export default function TrackWidget({ selected, onSelect }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTracks = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const token = getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=10`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.tracks.items);
      }
    } catch (error) {
      console.error('Error buscando canciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => searchTracks(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleTrack = (track) => {
    if (selected.find(t => t.id === track.id)) {
      onSelect(selected.filter(t => t.id !== track.id));
    } else {
      onSelect([...selected, track]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-green-500" />
        Canciones Favoritas
      </h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar canciones..."
          className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Seleccionadas ({selected.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(track => (
              <div key={track.id} className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm truncate max-w-[150px]">{track.name}</span>
                <button onClick={() => toggleTrack(track)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-gray-400 text-sm">Buscando...</p>}
      
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {results.map(track => (
          <button
            key={track.id}
            onClick={() => toggleTrack(track)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg transition ${
              selected.find(t => t.id === track.id)
                ? 'bg-green-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {track.album.images[0] ? (
              <img 
                src={track.album.images[0].url} 
                alt={track.name}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center">
                <Music className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-medium truncate">{track.name}</p>
              <p className="text-gray-400 text-xs truncate">
                {track.artists.map(a => a.name).join(', ')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}