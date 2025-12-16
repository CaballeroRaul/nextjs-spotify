'use client';

import { useState } from 'react';
import { Music, X, Search } from 'lucide-react';

const AVAILABLE_GENRES = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
  'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
  'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
  'children', 'chill', 'classical', 'club', 'comedy',
  'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
  'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo',
  'folk', 'forro', 'french', 'funk', 'garage',
  'german', 'gospel', 'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
  'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian',
  'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz',
  'k-pop', 'kids', 'latin', 'latino', 'malay',
  'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera',
  'pagode', 'party', 'philippines-opm', 'piano', 'pop',
  'pop-film', 'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock',
  'punk', 'punk-rock', 'r-n-b', 'rainy-day', 'reggae',
  'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa', 'samba', 'sertanejo',
  'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter',
  'soul', 'soundtracks', 'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango', 'techno', 'trance',
  'trip-hop', 'turkish', 'work-out', 'world-music'
];

// Mapeo para búsqueda - EXPORTADO para usar en dashboard
export const GENRE_SEARCH_TERMS = {
  'acoustic': 'acoustic guitar',
  'afrobeat': 'afrobeat african',
  'alt-rock': 'alternative rock',
  'alternative': 'alternative indie',
  'ambient': 'ambient electronic',
  'anime': 'anime soundtrack',
  'black-metal': 'black metal',
  'bluegrass': 'bluegrass country',
  'blues': 'blues rock',
  'bossanova': 'bossa nova jazz',
  'brazil': 'brazilian music',
  'breakbeat': 'breakbeat electronic',
  'british': 'british rock',
  'cantopop': 'cantopop chinese',
  'chicago-house': 'chicago house',
  'children': 'children kids music',
  'chill': 'chill lofi',
  'classical': 'classical music',
  'club': 'club dance',
  'comedy': 'comedy funny',
  'country': 'country music',
  'dance': 'dance pop',
  'dancehall': 'dancehall reggae',
  'death-metal': 'death metal',
  'deep-house': 'deep house',
  'detroit-techno': 'detroit techno',
  'disco': 'disco funk',
  'disney': 'disney soundtrack',
  'drum-and-bass': 'drum and bass dnb',
  'dub': 'dub reggae',
  'dubstep': 'dubstep bass',
  'edm': 'edm electronic',
  'electro': 'electro house',
  'electronic': 'electronic music',
  'emo': 'emo rock',
  'folk': 'folk acoustic',
  'forro': 'forro brazilian',
  'french': 'french pop',
  'funk': 'funk soul',
  'garage': 'garage rock',
  'german': 'german pop',
  'gospel': 'gospel music',
  'goth': 'gothic rock',
  'grindcore': 'grindcore metal',
  'groove': 'groove funk',
  'grunge': 'grunge rock',
  'guitar': 'guitar instrumental',
  'happy': 'happy pop',
  'hard-rock': 'hard rock',
  'hardcore': 'hardcore punk',
  'hardstyle': 'hardstyle',
  'heavy-metal': 'heavy metal',
  'hip-hop': 'hip hop rap',
  'house': 'house music',
  'idm': 'idm electronic',
  'indian': 'indian music bollywood',
  'indie': 'indie rock',
  'indie-pop': 'indie pop',
  'industrial': 'industrial metal',
  'iranian': 'iranian persian music',
  'j-dance': 'japanese dance',
  'j-idol': 'j-pop idol',
  'j-pop': 'jpop japanese',
  'j-rock': 'japanese rock',
  'jazz': 'jazz music',
  'k-pop': 'kpop korean',
  'kids': 'kids children music',
  'latin': 'latin pop',
  'latino': 'latino reggaeton',
  'malay': 'malay pop',
  'mandopop': 'mandopop chinese',
  'metal': 'metal rock',
  'metal-misc': 'metal',
  'metalcore': 'metalcore',
  'minimal-techno': 'minimal techno',
  'movies': 'movie soundtrack',
  'mpb': 'mpb brazilian',
  'new-age': 'new age',
  'new-release': 'new music',
  'opera': 'opera classical',
  'pagode': 'pagode samba',
  'party': 'party dance',
  'philippines-opm': 'opm filipino',
  'piano': 'piano instrumental',
  'pop': 'pop music',
  'pop-film': 'pop soundtrack',
  'post-dubstep': 'post dubstep',
  'power-pop': 'power pop',
  'progressive-house': 'progressive house',
  'psych-rock': 'psychedelic rock',
  'punk': 'punk rock',
  'punk-rock': 'punk rock',
  'r-n-b': 'rnb soul',
  'rainy-day': 'rainy chill',
  'reggae': 'reggae music',
  'reggaeton': 'reggaeton latino',
  'road-trip': 'road trip',
  'rock': 'rock music',
  'rock-n-roll': 'rock and roll',
  'rockabilly': 'rockabilly',
  'romance': 'romantic love',
  'sad': 'sad emotional',
  'salsa': 'salsa latin',
  'samba': 'samba brazilian',
  'sertanejo': 'sertanejo brazilian',
  'show-tunes': 'musical theatre',
  'singer-songwriter': 'singer songwriter',
  'ska': 'ska punk',
  'sleep': 'sleep calm',
  'songwriter': 'songwriter acoustic',
  'soul': 'soul music',
  'soundtracks': 'soundtrack music',
  'spanish': 'spanish pop',
  'study': 'study focus',
  'summer': 'summer vibes',
  'swedish': 'swedish pop',
  'synth-pop': 'synth pop',
  'tango': 'tango argentino',
  'techno': 'techno electronic',
  'trance': 'trance electronic',
  'trip-hop': 'trip hop',
  'turkish': 'turkish pop',
  'work-out': 'workout gym',
  'world-music': 'world music'
};

export default function GenreWidget({ selected, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredGenres = AVAILABLE_GENRES.filter(g => 
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGenre = (genre) => {
    if (selected.includes(genre)) {
      onSelect(selected.filter(g => g !== genre));
    } else if (selected.length < 5) {
      onSelect([...selected, genre]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-green-500" />
        Géneros Musicales
      </h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar géneros..."
          className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Seleccionados ({selected.length}/5):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(genre => (
              <div key={genre} className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm capitalize">{genre}</span>
                <button onClick={() => toggleGenre(genre)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {filteredGenres.map(genre => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            disabled={selected.length >= 5 && !selected.includes(genre)}
            className={`px-3 py-2 rounded-lg text-sm capitalize transition ${
              selected.includes(genre)
                ? 'bg-green-600 text-white'
                : selected.length >= 5
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
}