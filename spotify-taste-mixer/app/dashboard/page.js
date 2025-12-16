'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout, getAccessToken } from '@/lib/auth';
import { Music, LogOut } from 'lucide-react';
import ArtistWidget from '../components/widgets/ArtistWidget';
import TrackWidget from '../components/widgets/TrackWidget'
import GenreWidget, { GENRE_SEARCH_TERMS } from '../components/widgets/GenreWidget';
import DecadeWidget from '../components/widgets/DecadeWidget';
import MoodWidget from '../components/widgets/MoodWidget';
import PopularityWidget from '../components/widgets/PopularityWidget';
import PlaylistDisplay from '../components/PlaylistDisplay';


export default function Dashboard() {
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    artists: [],
    tracks: [],
    genres: [],
    decades: [],
    mood: { energy: 50, valence: 50 },
    popularity: 50
  });
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const generatePlaylist = async () => {
  console.log('🎵 Iniciando generación de playlist...');
  console.log('Preferencias:', preferences);
  
  setLoading(true);
  try {
    const token = getAccessToken();
    
    if (!token) {
      alert('No hay token de acceso. Por favor, vuelve a iniciar sesión.');
      router.push('/');
      return;
    }

    let allTracks = [];

    // 1. PRIORIDAD: Tracks seleccionados directamente
    if (preferences.tracks.length > 0) {
      console.log(`✅ Añadiendo ${preferences.tracks.length} tracks seleccionados`);
      allTracks.push(...preferences.tracks);
    }

    // 2. PRIORIDAD: Artistas seleccionados (top tracks)
    if (preferences.artists.length > 0) {
      console.log(`🎤 Obteniendo tracks de ${preferences.artists.length} artistas...`);
      for (const artist of preferences.artists) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=ES`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✓ ${data.tracks.length} tracks de ${artist.name}`);
            allTracks.push(...data.tracks.slice(0, 5)); // Top 5 de cada artista
          }
        } catch (error) {
          console.error(`Error con artista ${artist.name}:`, error);
        }
      }
    }

        // 3. Buscar por géneros
    if (preferences.genres.length > 0 && allTracks.length < 30) {
      console.log(`🎸 Buscando por ${preferences.genres.length} géneros...`);

      for (const genre of preferences.genres.slice(0, 3)) {
        try {
          const searchTerm = GENRE_SEARCH_TERMS[genre] || genre;
          console.log(`🔍 Buscando: "${searchTerm}" (género: ${genre})`);
          
          const response = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(searchTerm)}&market=ES&limit=10`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✓ ${data.tracks.items.length} tracks encontrados para "${genre}"`);
            allTracks.push(...data.tracks.items);
          }
        } catch (error) {
          console.error(`Error buscando género ${genre}:`, error);
        }
      }
    }

    // 4. Si aún faltan tracks, buscar populares
    /*if (allTracks.length < 15) {
      console.log('⚠️ Completando con tracks populares...');
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=top%20hits&market=ES&limit=20`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          allTracks.push(...data.tracks.items);
        }
      } catch (error) {
        console.error('Error obteniendo tracks populares:', error);
      }
    }*/

    console.log(`📊 Total de tracks obtenidos: ${allTracks.length}`);

    // 5. Filtrar y formatear
    /*let filteredTracks = allTracks
      .filter(track => track && track.id && track.album && track.artists)
      .map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        album: track.album.name,
        duration: track.duration_ms,
        image: track.album.images[0]?.url || 'https://via.placeholder.com/64',
        uri: track.uri,
        preview_url: track.preview_url,
        popularity: track.popularity || 50,
        release_date: track.album.release_date
      }))
      .filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id) // Eliminar duplicados
      );

    console.log(`📊 Tracks únicos: ${filteredTracks.length}`);*/

    // 6. FILTRAR POR DÉCADA
    if (preferences.decades.length > 0) {
      const originalLength = filteredTracks.length;
      
      filteredTracks = filteredTracks.filter(track => {
        if (!track.release_date) return true; // Si no tiene fecha, mantenerlo
        
        const year = parseInt(track.release_date.substring(0, 4));
        
        return preferences.decades.some(decade => {
          const [start, end] = decade.split('-').map(Number);
          return year >= start && year <= end;
        });
      });
      
      const filtered = originalLength - filteredTracks.length;
      console.log(`📅 Filtrado por década: eliminados ${filtered} tracks`);
      console.log(`Décadas seleccionadas: ${preferences.decades.join(', ')}`);
    }

    // 7. FILTRAR POR POPULARIDAD
    const minPop = Math.max(0, preferences.popularity - 25);
    const maxPop = Math.min(100, preferences.popularity + 25);
    
    const beforePop = filteredTracks.length;
    filteredTracks = filteredTracks.filter(track => 
      track.popularity >= minPop && track.popularity <= maxPop
    );
    
    console.log(`🔥 Filtrado por popularidad (${minPop}-${maxPop}): ${beforePop} → ${filteredTracks.length}`);

    // 8. Si quedaron muy pocos, relajar filtros
    if (filteredTracks.length < 10) {
      console.log('⚠️ Muy pocos resultados, relajando filtros...');
      
      // Volver a los tracks sin filtrar tanto
      filteredTracks = allTracks
        .filter(track => track && track.id && track.album && track.artists)
        .map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          duration: track.duration_ms,
          image: track.album.images[0]?.url || 'https://via.placeholder.com/64',
          uri: track.uri,
          preview_url: track.preview_url,
          popularity: track.popularity || 50,
          release_date: track.album.release_date
        }))
        .filter((track, index, self) => 
          index === self.findIndex(t => t.id === track.id)
        );
    }

    // 9. Ordenar por popularidad (si aplica) y limitar a 20
    filteredTracks.sort((a, b) => {
      // Priorizar tracks que coincidan mejor con la popularidad deseada
      const diffA = Math.abs(a.popularity - preferences.popularity);
      const diffB = Math.abs(b.popularity - preferences.popularity);
      return diffA - diffB;
    });

    const finalPlaylist = filteredTracks.slice(0, 20);

    console.log(`✅ Playlist final: ${finalPlaylist.length} tracks`);
    
    if (finalPlaylist.length > 0) {
      console.log('Muestra de canciones:');
      finalPlaylist.slice(0, 5).forEach((track, i) => {
        const year = track.release_date ? track.release_date.substring(0, 4) : '?';
        console.log(`  ${i+1}. ${track.name} - ${track.artist} (${year}) [Pop: ${track.popularity}]`);
      });
    }

    if (finalPlaylist.length === 0) {
      alert('No se encontraron canciones con tus preferencias. Intenta:\n- Seleccionar menos filtros\n- Elegir géneros más populares\n- Ajustar el rango de décadas');
    } else {
      setPlaylist(finalPlaylist);
    }

  } catch (error) {
    console.error('❌ Error generando playlist:', error);
    alert(`Error al generar la playlist: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  const removeTrack = (trackId) => {
    setPlaylist(playlist.filter(t => t.id !== trackId));
  };

  const addMoreTracks = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      let moreTracks = [];

      // Buscar más tracks similares
      if (preferences.genres.length > 0) {
        const randomGenre = preferences.genres[Math.floor(Math.random() * preferences.genres.length)];
        const response = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(randomGenre)}&market=ES&limit=10`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        if (response.ok) {
          const data = await response.json();
          moreTracks = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            duration: track.duration_ms,
            image: track.album.images[0]?.url || 'https://via.placeholder.com/64',
            uri: track.uri
          }));
        }
      }

      // Filtrar duplicados
      const newTracks = moreTracks.filter(
        newTrack => !playlist.find(existing => existing.id === newTrack.id)
      );

      setPlaylist([...playlist, ...newTracks.slice(0, 10)]);

    } catch (error) {
      console.error('Error añadiendo más tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl font-bold">Spotify Taste Mixer</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ArtistWidget
            selected={preferences.artists}
            onSelect={(artists) => setPreferences({ ...preferences, artists })}
          />
          <TrackWidget
            selected={preferences.tracks}
            onSelect={(tracks) => setPreferences({ ...preferences, tracks })}
          />
          <GenreWidget
            selected={preferences.genres}
            onSelect={(genres) => setPreferences({ ...preferences, genres })}
          />
          <DecadeWidget
            selected={preferences.decades}
            onSelect={(decades) => setPreferences({ ...preferences, decades })}
          />
          <MoodWidget
            mood={preferences.mood}
            onMoodChange={(mood) => setPreferences({ ...preferences, mood })}
          />
          <PopularityWidget
            value={preferences.popularity}
            onChange={(popularity) => setPreferences({ ...preferences, popularity })}
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={generatePlaylist}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition transform hover:scale-105 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '⏳ Generando...' : '🎵 Generar Playlist'}
          </button>
        </div>

        {playlist.length > 0 && (
          <PlaylistDisplay
            playlist={playlist}
            onRemoveTrack={removeTrack}
            onRefresh={generatePlaylist}
            onAddMore={addMoreTracks}
          />
        )}
      </div>
    </div>
  );
}