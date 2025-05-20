import { Routes, Route } from 'react-router-dom';
import OCRPage from './pages/OCRPage';
import SummarizePage from './pages/SummarizePage';
import QAPage from './pages/QAPage';
import TTSPage from './pages/TTSPage';
import HomePage from './pages/HomePage';
import React from 'react';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      {children}
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
}

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ocr" element={<OCRPage />} />
        <Route path="/summarize" element={<SummarizePage />} />
        <Route path="/qa" element={<QAPage />} />
        <Route path="/tts" element={<TTSPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
