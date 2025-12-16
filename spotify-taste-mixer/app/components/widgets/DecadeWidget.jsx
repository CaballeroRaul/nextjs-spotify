'use client';

import { Calendar, X } from 'lucide-react';

const DECADES = [
  { label: '1950s', value: '1950-1959', years: [1950, 1959] },
  { label: '1960s', value: '1960-1969', years: [1960, 1969] },
  { label: '1970s', value: '1970-1979', years: [1970, 1979] },
  { label: '1980s', value: '1980-1989', years: [1980, 1989] },
  { label: '1990s', value: '1990-1999', years: [1990, 1999] },
  { label: '2000s', value: '2000-2009', years: [2000, 2009] },
  { label: '2010s', value: '2010-2019', years: [2010, 2019] },
  { label: '2020s', value: '2020-2029', years: [2020, 2029] }
];

export default function DecadeWidget({ selected, onSelect }) {
  const toggleDecade = (decade) => {
    if (selected.includes(decade)) {
      onSelect(selected.filter(d => d !== decade));
    } else {
      onSelect([...selected, decade]);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-green-500" />
        Décadas
      </h3>
      
      {selected.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400 mb-2">Seleccionadas ({selected.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map(decade => (
              <div key={decade} className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <span className="text-sm">{DECADES.find(d => d.value === decade)?.label}</span>
                <button onClick={() => toggleDecade(decade)}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {DECADES.map(decade => (
          <button
            key={decade.value}
            onClick={() => toggleDecade(decade.value)}
            className={`px-4 py-3 rounded-lg font-semibold transition ${
              selected.includes(decade.value)
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {decade.label}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm">
            📅 Buscando música de: {selected.map(d => DECADES.find(dec => dec.value === d)?.label).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}