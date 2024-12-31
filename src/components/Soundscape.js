import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

const Soundscape = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [nodes, setNodes] = useState({});
  const [volumes, setVolumes] = useState({
    wind: 0.5,
    rain: 0.5,
    birds: 0.5
  });

  const createNoiseBuffer = useCallback((duration = 1) => {
    if (!audioContext) return null;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }, [audioContext]);

  const createSound = useCallback((type) => {
    if (!audioContext) return null;

    const configs = {
      wind: {
        sourceType: 'noise',
        bufferDuration: 2,
        filter: {
          type: 'lowpass',
          frequency: 400,
          Q: 0.9
        }
      },
      rain: {
        sourceType: 'noise',
        bufferDuration: 1,
        filter: {
          type: 'bandpass',
          frequency: 2000,
          Q: 0.2
        }
      },
      birds: {
        sourceType: 'oscillator',
        oscillatorType: 'sine',
        baseFrequency: 440,
        chirp: true
      }
    };

    const config = configs[type];
    const gainNode = audioContext.createGain();

    if (config.sourceType === 'noise') {
      const bufferSource = audioContext.createBufferSource();
      const filter = audioContext.createBiquadFilter();
      
      bufferSource.buffer = createNoiseBuffer(config.bufferDuration);
      bufferSource.loop = true;
      
      filter.type = config.filter.type;
      filter.frequency.value = config.filter.frequency;
      filter.Q.value = config.filter.Q;
      
      bufferSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      return { source: bufferSource, gain: gainNode };
    } else if (config.sourceType === 'oscillator') {
      const oscillator = audioContext.createOscillator();
      
      oscillator.type = config.oscillatorType;
      oscillator.frequency.value = config.baseFrequency;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (config.chirp) {
        setInterval(() => {
          if (Math.random() < 0.1) {
            oscillator.frequency.setValueAtTime(
              config.baseFrequency + Math.random() * 200,
              audioContext.currentTime
            );
            gainNode.gain.setValueAtTime(volumes[type], audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
          }
        }, 500);
      }
      
      return { source: oscillator, gain: gainNode };
    }
    
    return null;
  }, [audioContext, createNoiseBuffer, volumes]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }
  }, []);

  const togglePlay = () => {
    if (!audioContext) return;

    if (!isPlaying) {
      const windNodes = createSound('wind');
      const rainNodes = createSound('rain');
      const birdNodes = createSound('birds');

      windNodes.source.start();
      rainNodes.source.start();
      birdNodes.source.start();

      setNodes({ wind: windNodes, rain: rainNodes, birds: birdNodes });
    } else {
      Object.values(nodes).forEach(node => {
        node.source.stop();
      });
      setNodes({});
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (nodes.wind) {
      nodes.wind.gain.gain.value = volumes.wind;
    }
    if (nodes.rain) {
      nodes.rain.gain.gain.value = volumes.rain;
    }
    if (nodes.birds) {
      nodes.birds.gain.gain.value = volumes.birds;
    }
  }, [volumes, nodes]);

  return (
    <div className="soundscape-container">
      <div className="header">
        <h2>Soundscape Generator</h2>
        <button onClick={togglePlay} className="play-button">
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </button>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Wind Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volumes.wind * 100}
            onChange={(e) => setVolumes(prev => ({ ...prev, wind: e.target.value / 100 }))}
          />
        </div>

        <div className="control-group">
          <label>Rain Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volumes.rain * 100}
            onChange={(e) => setVolumes(prev => ({ ...prev, rain: e.target.value / 100 }))}
          />
        </div>

        <div className="control-group">
          <label>Birds Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volumes.birds * 100}
            onChange={(e) => setVolumes(prev => ({ ...prev, birds: e.target.value / 100 }))}
          />
        </div>
      </div>
      
      <style jsx>{`
        .soundscape-container {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          max-width: 500px;
          margin: 20px auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .play-button {
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.3s;
        }

        .play-button:hover {
          background: #357abd;
        }

        .controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        input[type="range"] {
          flex: 1;
        }

        label {
          min-width: 100px;
        }
      `}</style>
    </div>
  );
};

export default Soundscape;