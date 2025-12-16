'use client';

import { TrendingUp } from 'lucide-react';

export default function PopularityWidget({ value, onChange }) {
  const getCategory = () => {
    if (value < 33) return { emoji: '🎸', label: 'Underground', color: 'text-purple-400' };
    if (value < 67) return { emoji: '⭐', label: 'Popular', color: 'text-blue-400' };
    return { emoji: '🔥', label: 'Mainstream', color: 'text-red-400' };
  };

  const category = getCategory();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        Popularidad
      </h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Nivel de popularidad</span>
          <span className="text-green-500 font-bold text-lg">{value}</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Category Display */}
      <div className="space-y-2">
        <div className={`p-4 bg-gray-700 rounded-lg border-2 ${
          value < 33 ? 'border-purple-500' : value < 67 ? 'border-blue-500' : 'border-red-500'
        }`}>
          <p className={`text-center font-bold text-xl ${category.color}`}>
            {category.emoji} {category.label}
          </p>
        </div>

        <div className="p-3 bg-gray-700/50 rounded-lg">
          <p className="text-gray-300 text-sm">
            {value < 33 ? '🎸 Descubre joyas ocultas y artistas independientes' :
             value < 67 ? '⭐ Mix equilibrado de éxitos y descubrimientos' :
             '🔥 Los hits más populares del momento'}
          </p>
        </div>
      </div>

      {/* Quick Selection Buttons */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => onChange(15)}
          className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/40 rounded-lg text-xs transition"
        >
          Underground
        </button>
        <button
          onClick={() => onChange(50)}
          className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 rounded-lg text-xs transition"
        >
          Popular
        </button>
        <button
          onClick={() => onChange(85)}
          className="px-3 py-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-xs transition"
        >
          Mainstream
        </button>
      </div>
    </div>
  );
}