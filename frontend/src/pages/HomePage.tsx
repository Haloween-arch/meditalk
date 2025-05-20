import { Link } from 'react-router-dom'
import './HomePage.css'

const tools = [
  { path: '/ocr', label: '🖼️ OCR (Image to Text)' },
  { path: '/summarize', label: '📝 Text Summarizer' },
  { path: '/qa', label: '❓ Question Answering' },
  { path: '/tts', label: '🔊 Text to Speech' },
]

export default function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to MEDITALK</h1>
      <p className="home-subtitle">Choose one of the smart tools to get started:</p>
      <div className="home-grid">
        {tools.map(({ path, label }) => (
          <Link className="home-card" to={path} key={path}>
            <span>{label.split(' ')[0]}</span>
            {label.slice(label.indexOf(' ') + 1)}
          </Link>
        ))}
      </div>
    </div>
  )
}
