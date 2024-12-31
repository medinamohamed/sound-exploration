'use client';
import Soundscape from '../components/Soundscape';
import Synthesizer from '../components/Synthesizer';

export default function Home() {
  return (
    <main className="container">
      <header className="header">
        <h1>Exploring Sound with Claude</h1>
        <p className="intro">A journey through digital sound synthesis, from basic waveforms to complex soundscapes</p>
      </header>

      <section className="section">
        <h2>Understanding Digital Sound</h2>
        <div className="concept-box">
          <p>At its core, digital sound is created through mathematical manipulation of waves. We can generate these waves in two primary ways:</p>
          <ul>
            <li>
              <strong>Oscillators:</strong> Generate pure tones using different waveforms:
              <ul>
                <li>Sine waves - Pure, smooth tones (like a flute)</li>
                <li>Square waves - Rich in harmonics (like 8-bit games)</li>
                <li>Sawtooth waves - Bright, sharp (like brass instruments)</li>
                <li>Triangle waves - Soft, hollow (like woodwinds)</li>
              </ul>
            </li>
            <li>
              <strong>Noise Generators:</strong> Create random values that we shape into different sounds using filters
            </li>
          </ul>
        </div>
      </section>

      <section className="section">
        <h2>Interactive Soundscape</h2>
        <p>Our first exploration combines different sound sources to create an ambient environment. Try adjusting the sliders to mix:</p>
        <ul>
          <li>Wind - Filtered white noise with a lowpass filter</li>
          <li>Rain - Bandpass filtered noise for that pitter-patter effect</li>
          <li>Birds - Frequency-modulated oscillators creating chirp-like sounds</li>
        </ul>
        <div className="demo-container">
          <Soundscape />
        </div>
      </section>

      <section className="section">
        <h2>Simple Synthesizer</h2>
        <p>Explore musical sound generation with basic waveforms. Each key represents a specific frequency, and you can change the waveform type to hear different timbres:</p>
        <div className="demo-container">
          <Synthesizer />
        </div>
      </section>

      <section className="section">
        <h2>How It Works</h2>
        <div className="knowledge-grid">
          <div className="knowledge-card">
            <h3>Sound Building Blocks</h3>
            <p>Every sound in this demo is built from:</p>
            <ul>
              <li>Source Generators (oscillators or noise)</li>
              <li>Filters to shape the sound</li>
              <li>Amplitude control for volume</li>
              <li>Modulation for movement and interest</li>
            </ul>
          </div>
          <div className="knowledge-card">
            <h3>Web Audio API</h3>
            <p>We're using the Web Audio API, which provides:</p>
            <ul>
              <li>Low-level audio processing</li>
              <li>Real-time sound generation</li>
              <li>Audio routing and effects</li>
              <li>Precise timing control</li>
            </ul>
          </div>
        </div>
      </section>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 4rem;
          padding: 3rem 0;
          background: linear-gradient(135deg, #2a2a72, #009ffd);
          color: white;
          border-radius: 12px;
        }

        .intro {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 1rem auto;
        }

        .section {
          margin: 4rem 0;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: #2a2a72;
        }

        .concept-box {
          background: rgba(42, 42, 114, 0.1);
          border-left: 4px solid #2a2a72;
          padding: 1.5rem;
          margin: 1.5rem 0;
          border-radius: 0 8px 8px 0;
        }

        .demo-container {
          margin: 2rem 0;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .knowledge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .knowledge-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h3 {
          color: #2a2a72;
          margin-bottom: 1rem;
        }

        ul {
          padding-left: 1.5rem;
        }

        li {
          margin: 0.5rem 0;
        }

        p {
          margin: 1rem 0;
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}