import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold">
          Renewable Grid Simulator
        </h1>
        <p className="text-gray-400 text-sm">
          Copenhagen Region Model - Development Preview
        </p>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">
              🚧 Project Initialized
            </h2>
            <p className="text-gray-300 mb-4">
              The frontend is running! This is the foundation for the grid simulation platform.
            </p>
            
            <div className="bg-gray-700 rounded p-4 mb-4">
              <h3 className="font-semibold mb-2">✅ Completed:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Project structure created</li>
                <li>React + TypeScript configured</li>
                <li>Tailwind CSS integrated</li>
                <li>Development environment ready</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded p-4">
              <h3 className="font-semibold mb-2">📋 Next Steps:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                <li>Build backend simulation engine (Phase 1)</li>
                <li>Create split-screen layout</li>
                <li>Implement visual scene components</li>
                <li>Add technical dashboard</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            See <code className="bg-gray-800 px-2 py-1 rounded">README.md</code> for full development roadmap
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
