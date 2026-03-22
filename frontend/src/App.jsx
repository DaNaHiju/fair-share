import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold max-w-4xl mx-auto"><a href="/">FairShare</a></h1>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/group/:id" element={<GroupDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
