import { Music, LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Music className="w-8 h-8 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Spotify Taste Mixer</h1>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </header>
  );
}