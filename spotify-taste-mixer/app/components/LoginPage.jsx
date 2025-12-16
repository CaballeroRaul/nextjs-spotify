const LoginPage = ({ onLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-950 flex items-center justify-center p-4">
    <div className="text-center">
      <Music className="w-24 h-24 text-green-500 mx-auto mb-8 animate-pulse" />
      <h1 className="text-5xl font-bold text-white mb-4">Spotify Taste Mixer</h1>
      <p className="text-xl text-gray-300 mb-8">Crea playlists personalizadas basadas en tus preferencias</p>
      <button
        onClick={onLogin}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition transform hover:scale-105"
      >
        Conectar con Spotify
      </button>
    </div>
  </div>
);