'use client';

import { Smile, Sliders } from 'lucide-react';

export default function MoodWidget({ mood, onMoodChange }) {
  const getMoodEmoji = () => {
    const { energy, valence } = mood;
    
    if (energy > 70 && valence > 70) return '🎉 Festivo';
    if (energy > 70 && valence < 30) return '😤 Intenso';
    if (energy < 30 && valence > 70) return '😌 Relajado';
    if (energy < 30 && valence < 30) return '😢 Melancólico';
    if (energy > 50 && valence > 50) return '😊 Alegre';
    if (energy > 50 && valence < 50) return '💪 Enérgico';
    if (energy < 50 && valence > 50) return '🌅 Calmado';
    return '😐 Neutral';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Smile className="w-5 h-5 text-green-500" />
        Mood & Energía
      </h3>
      
      <div className="space-y-6">
        {/* Energy Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-300 text-sm font-medium">
              ⚡ Energía
            </label>
            <span className="text-green-500 font-bold">{mood.energy}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood.energy}
            onChange={(e) => onMoodChange({ ...mood, energy: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>🛌 Relajado</span>
            <span>🔥 Enérgico</span>
          </div>
        </div>

        {/* Valence Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-300 text-sm font-medium">
              😊 Positividad
            </label>
            <span className="text-green-500 font-bold">{mood.valence}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood.valence}
            onChange={(e) => onMoodChange({ ...mood, valence: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>😢 Triste</span>
            <span>😄 Alegre</span>
          </div>
        </div>
      </div>

      {/* Mood Display */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-green-600/30 rounded-lg border border-green-500/30">
        <p className="text-center text-white font-medium text-lg">
          {getMoodEmoji()}
        </p>
      </div>
    </div>
  );
}