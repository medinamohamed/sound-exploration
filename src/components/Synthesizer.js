import React, { useState, useEffect, useCallback } from 'react';

const Synthesizer = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [gainNode, setGainNode] = useState(null);
  const [waveform, setWaveform] = useState('sine');
  
  // Notes for one octave (starting at middle C)
  const notes = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.value = 0;
      
      setAudioContext(ctx);
      setGainNode(gain);
    }
  }, []);

  const playNote = useCallback((frequency) => {
    if (!audioContext || !gainNode) return;

    // Stop previous note if any
    if (oscillator) {
      oscillator.stop();
      oscillator.disconnect();
    }

    // Create and configure new oscillator
    const osc = audioContext.createOscillator();
    osc.type = waveform;
    osc.frequency.value = frequency;
    osc.connect(gainNode);
    
    // Envelope
    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    
    osc.start();
    setOscillator(osc);
  }, [audioContext, gainNode, waveform, oscillator]);

  const stopNote = useCallback(() => {
    if (!gainNode || !oscillator) return;
    
    gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      setOscillator(null);
    }, 100);
  }, [audioContext, gainNode, oscillator]);

  return (
    <div className="synthesizer-container">
      <h2>Simple Synthesizer</h2>
      
      <div className="controls">
        <div className="waveform-select">
          <label>Waveform:</label>
          <select 
            value={waveform} 
            onChange={(e) => setWaveform(e.target.value)}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
        </div>
        
        <div className="keyboard">
          {Object.entries(notes).map(([note, frequency]) => (
            <button
              key={note}
              className="key"
              onMouseDown={() => playNote(frequency)}
              onMouseUp={stopNote}
              onMouseLeave={stopNote}
            >
              {note}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .synthesizer-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 800px;
          margin: 20px auto;
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .waveform-select {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        select {
          padding: 5px 10px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .keyboard {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 4px;
        }

        .key {
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 20px 0;
          cursor: pointer;
          transition: background 0.3s;
        }

        .key:hover {
          background: #357abd;
        }

        .key:active {
          background: #2b62a1;
        }
      `}</style>
    </div>
  );
};

export default Synthesizer;