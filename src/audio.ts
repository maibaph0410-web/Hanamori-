/**
 * Pure Web Audio procedural Solo Instrumental Piano Synthesizer for HANAMORI
 * Features authentic acoustic piano harmonics, wooden soundboard lowpass filtering,
 * hammer strike transients, and mood-adaptive musical compositions.
 * No vocals, no drums, no external MP3 dependencies — 100% reliable and zero latency.
 */

import { MoodType } from './types';

// Standard piano note frequencies (Hz)
const NOTE_FREQS: Record<string, number> = {
  // Octave 2
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  // Octave 3
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  // Octave 4
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  // Octave 5
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  // Octave 6
  C6: 1046.50, D6: 1174.66, E6: 1318.51,
  // Sharps / Flats
  Db3: 138.59, Eb3: 155.56, Fs3: 185.00, Ab3: 207.65, Bb3: 233.08,
  Db4: 277.18, Eb4: 311.13, Fs4: 369.99, Ab4: 415.30, Bb4: 466.16,
  Db5: 554.37, Eb5: 622.25, Fs5: 739.99, Ab5: 830.61, Bb5: 932.33,
};

interface PianoNoteEvent {
  notes: string[]; // Notes to trigger simultaneously (chords/dyads) or singly
  delay: number;   // Delay from previous event in beats
  duration: number; // Sustain duration in seconds
  velocity?: number; // 0.1 to 1.0
}

// Mood compositions (sequences of piano chords and expressive melodies)
const PIANO_COMPOSITIONS: Record<MoodType, { tempoBpm: number; sequence: PianoNoteEvent[] }> = {
  happy: {
    tempoBpm: 92,
    sequence: [
      { notes: ['C3', 'G3'], delay: 0, duration: 2.2, velocity: 0.4 },
      { notes: ['E4', 'G4'], delay: 0.5, duration: 1.2, velocity: 0.45 },
      { notes: ['C5'], delay: 0.5, duration: 1.0, velocity: 0.5 },
      { notes: ['D5'], delay: 0.5, duration: 1.0, velocity: 0.48 },
      { notes: ['E5'], delay: 0.5, duration: 1.6, velocity: 0.52 },

      { notes: ['A2', 'E3'], delay: 1.0, duration: 2.2, velocity: 0.4 },
      { notes: ['C4', 'E4'], delay: 0.5, duration: 1.2, velocity: 0.45 },
      { notes: ['G4'], delay: 0.5, duration: 1.0, velocity: 0.46 },
      { notes: ['A4'], delay: 0.5, duration: 1.2, velocity: 0.48 },
      { notes: ['C5'], delay: 0.5, duration: 1.8, velocity: 0.5 },

      { notes: ['F2', 'C3'], delay: 1.0, duration: 2.2, velocity: 0.4 },
      { notes: ['A3', 'C4'], delay: 0.5, duration: 1.2, velocity: 0.45 },
      { notes: ['E4'], delay: 0.5, duration: 1.0, velocity: 0.46 },
      { notes: ['F4'], delay: 0.5, duration: 1.0, velocity: 0.48 },
      { notes: ['G4'], delay: 0.5, duration: 1.6, velocity: 0.5 },

      { notes: ['G2', 'D3'], delay: 1.0, duration: 2.0, velocity: 0.4 },
      { notes: ['B3', 'D4'], delay: 0.5, duration: 1.2, velocity: 0.45 },
      { notes: ['G4'], delay: 0.5, duration: 1.2, velocity: 0.48 },
      { notes: ['B4'], delay: 0.5, duration: 1.4, velocity: 0.5 },
      { notes: ['C5'], delay: 0.5, duration: 2.5, velocity: 0.55 },
    ],
  },
  sad: {
    tempoBpm: 56,
    sequence: [
      { notes: ['D3', 'A3'], delay: 0, duration: 3.5, velocity: 0.32 },
      { notes: ['F4'], delay: 1.0, duration: 2.5, velocity: 0.34 },
      { notes: ['E4'], delay: 1.0, duration: 2.0, velocity: 0.3 },
      { notes: ['D4'], delay: 1.0, duration: 3.0, velocity: 0.32 },

      { notes: ['Bb2', 'F3'], delay: 1.5, duration: 3.5, velocity: 0.3 },
      { notes: ['D4'], delay: 1.0, duration: 2.5, velocity: 0.32 },
      { notes: ['C4'], delay: 1.0, duration: 2.0, velocity: 0.28 },
      { notes: ['A3'], delay: 1.0, duration: 3.0, velocity: 0.3 },

      { notes: ['G2', 'D3'], delay: 1.5, duration: 3.5, velocity: 0.28 },
      { notes: ['Bb3'], delay: 1.0, duration: 2.5, velocity: 0.3 },
      { notes: ['A3'], delay: 1.0, duration: 2.0, velocity: 0.28 },
      { notes: ['F3'], delay: 1.0, duration: 3.2, velocity: 0.3 },

      { notes: ['A2', 'E3'], delay: 1.5, duration: 3.8, velocity: 0.28 },
      { notes: ['Cs4'], delay: 1.0, duration: 2.5, velocity: 0.3 },
      { notes: ['D4'], delay: 1.0, duration: 4.0, velocity: 0.34 },
    ],
  },
  calm: {
    tempoBpm: 52,
    sequence: [
      { notes: ['G2', 'D3'], delay: 0, duration: 4.0, velocity: 0.3 },
      { notes: ['B3', 'D4'], delay: 1.2, duration: 3.0, velocity: 0.3 },
      { notes: ['G4'], delay: 1.0, duration: 2.8, velocity: 0.32 },
      { notes: ['A4'], delay: 1.2, duration: 2.5, velocity: 0.3 },
      { notes: ['B4'], delay: 1.2, duration: 3.5, velocity: 0.32 },

      { notes: ['E2', 'B2'], delay: 1.8, duration: 4.0, velocity: 0.28 },
      { notes: ['G3', 'B3'], delay: 1.2, duration: 3.0, velocity: 0.3 },
      { notes: ['E4'], delay: 1.0, duration: 2.8, velocity: 0.3 },
      { notes: ['D4'], delay: 1.2, duration: 3.2, velocity: 0.28 },

      { notes: ['C3', 'G3'], delay: 1.8, duration: 4.0, velocity: 0.28 },
      { notes: ['E4'], delay: 1.2, duration: 3.0, velocity: 0.3 },
      { notes: ['G4'], delay: 1.0, duration: 2.8, velocity: 0.32 },
      { notes: ['D4'], delay: 1.2, duration: 3.5, velocity: 0.3 },

      { notes: ['D2', 'A2'], delay: 1.8, duration: 4.2, velocity: 0.28 },
      { notes: ['Fs3', 'A3'], delay: 1.2, duration: 3.0, velocity: 0.3 },
      { notes: ['G3'], delay: 1.2, duration: 4.0, velocity: 0.3 },
    ],
  },
  lonely: {
    tempoBpm: 54,
    sequence: [
      { notes: ['B2', 'Fs3'], delay: 0, duration: 3.8, velocity: 0.3 },
      { notes: ['D4'], delay: 1.2, duration: 2.8, velocity: 0.3 },
      { notes: ['Fs4'], delay: 1.0, duration: 2.5, velocity: 0.32 },
      { notes: ['E4'], delay: 1.2, duration: 3.0, velocity: 0.28 },

      { notes: ['G2', 'D3'], delay: 1.6, duration: 3.8, velocity: 0.28 },
      { notes: ['B3'], delay: 1.2, duration: 2.6, velocity: 0.3 },
      { notes: ['D4'], delay: 1.0, duration: 2.5, velocity: 0.3 },
      { notes: ['A4'], delay: 1.2, duration: 3.2, velocity: 0.32 },

      { notes: ['E2', 'B2'], delay: 1.6, duration: 3.8, velocity: 0.28 },
      { notes: ['G3'], delay: 1.2, duration: 2.5, velocity: 0.3 },
      { notes: ['B3'], delay: 1.0, duration: 2.8, velocity: 0.28 },
      { notes: ['Fs4'], delay: 1.2, duration: 3.5, velocity: 0.3 },

      { notes: ['Fs2', 'Cs3'], delay: 1.6, duration: 4.0, velocity: 0.28 },
      { notes: ['A3'], delay: 1.2, duration: 3.0, velocity: 0.28 },
      { notes: ['B3'], delay: 1.2, duration: 4.0, velocity: 0.3 },
    ],
  },
  loved: {
    tempoBpm: 64,
    sequence: [
      { notes: ['F2', 'C3'], delay: 0, duration: 3.5, velocity: 0.35 },
      { notes: ['A3', 'C4'], delay: 0.8, duration: 2.5, velocity: 0.36 },
      { notes: ['E4'], delay: 0.8, duration: 2.0, velocity: 0.38 },
      { notes: ['F4'], delay: 0.8, duration: 2.5, velocity: 0.4 },

      { notes: ['D3', 'A3'], delay: 1.2, duration: 3.5, velocity: 0.34 },
      { notes: ['F4'], delay: 0.8, duration: 2.2, velocity: 0.36 },
      { notes: ['E4'], delay: 0.8, duration: 2.0, velocity: 0.35 },
      { notes: ['D4'], delay: 0.8, duration: 2.6, velocity: 0.38 },

      { notes: ['Bb2', 'F3'], delay: 1.2, duration: 3.5, velocity: 0.34 },
      { notes: ['D4'], delay: 0.8, duration: 2.2, velocity: 0.36 },
      { notes: ['C4'], delay: 0.8, duration: 2.0, velocity: 0.38 },
      { notes: ['A4'], delay: 0.8, duration: 2.8, velocity: 0.4 },

      { notes: ['C3', 'G3'], delay: 1.2, duration: 3.8, velocity: 0.34 },
      { notes: ['E4'], delay: 0.8, duration: 2.5, velocity: 0.36 },
      { notes: ['G4'], delay: 0.8, duration: 2.2, velocity: 0.4 },
      { notes: ['F4'], delay: 0.8, duration: 3.8, velocity: 0.42 },
    ],
  },
  angry: {
    tempoBpm: 72,
    sequence: [
      { notes: ['C2', 'G2'], delay: 0, duration: 2.8, velocity: 0.45 },
      { notes: ['Eb3', 'G3'], delay: 0.8, duration: 1.8, velocity: 0.42 },
      { notes: ['C4'], delay: 0.6, duration: 1.5, velocity: 0.45 },
      { notes: ['D4'], delay: 0.6, duration: 1.5, velocity: 0.42 },

      { notes: ['Ab2', 'Eb3'], delay: 1.0, duration: 2.8, velocity: 0.44 },
      { notes: ['C4'], delay: 0.8, duration: 1.8, velocity: 0.42 },
      { notes: ['Bb3'], delay: 0.6, duration: 1.5, velocity: 0.4 },
      { notes: ['G3'], delay: 0.6, duration: 2.0, velocity: 0.42 },

      { notes: ['F2', 'C3'], delay: 1.0, duration: 2.8, velocity: 0.44 },
      { notes: ['Ab3'], delay: 0.8, duration: 1.8, velocity: 0.4 },
      { notes: ['G3'], delay: 0.6, duration: 1.5, velocity: 0.4 },
      { notes: ['Eb3'], delay: 0.6, duration: 2.2, velocity: 0.42 },

      { notes: ['G2', 'D3'], delay: 1.0, duration: 3.2, velocity: 0.44 },
      { notes: ['B3'], delay: 0.8, duration: 2.0, velocity: 0.4 },
      { notes: ['C4'], delay: 0.8, duration: 3.5, velocity: 0.45 },
    ],
  },
  hopeful: {
    tempoBpm: 80,
    sequence: [
      { notes: ['D3', 'A3'], delay: 0, duration: 3.0, velocity: 0.38 },
      { notes: ['Fs4'], delay: 0.7, duration: 2.0, velocity: 0.4 },
      { notes: ['G4'], delay: 0.7, duration: 1.8, velocity: 0.42 },
      { notes: ['A4'], delay: 0.7, duration: 2.2, velocity: 0.45 },

      { notes: ['A2', 'E3'], delay: 1.0, duration: 3.0, velocity: 0.38 },
      { notes: ['Cs4'], delay: 0.7, duration: 2.0, velocity: 0.4 },
      { notes: ['D4'], delay: 0.7, duration: 1.8, velocity: 0.42 },
      { notes: ['E4'], delay: 0.7, duration: 2.4, velocity: 0.44 },

      { notes: ['B2', 'Fs3'], delay: 1.0, duration: 3.0, velocity: 0.38 },
      { notes: ['D4'], delay: 0.7, duration: 2.0, velocity: 0.4 },
      { notes: ['Fs4'], delay: 0.7, duration: 1.8, velocity: 0.42 },
      { notes: ['B4'], delay: 0.7, duration: 2.5, velocity: 0.46 },

      { notes: ['G2', 'D3'], delay: 1.0, duration: 3.5, velocity: 0.4 },
      { notes: ['B3'], delay: 0.7, duration: 2.0, velocity: 0.42 },
      { notes: ['Cs4'], delay: 0.7, duration: 2.0, velocity: 0.44 },
      { notes: ['D4'], delay: 0.7, duration: 3.8, velocity: 0.48 },
    ],
  },
  tired: {
    tempoBpm: 46,
    sequence: [
      { notes: ['C3', 'G3'], delay: 0, duration: 4.5, velocity: 0.24 },
      { notes: ['E4'], delay: 1.5, duration: 3.5, velocity: 0.24 },
      { notes: ['D4'], delay: 1.2, duration: 3.2, velocity: 0.22 },
      { notes: ['C4'], delay: 1.5, duration: 4.0, velocity: 0.24 },

      { notes: ['A2', 'E3'], delay: 2.0, duration: 4.5, velocity: 0.22 },
      { notes: ['C4'], delay: 1.5, duration: 3.5, velocity: 0.22 },
      { notes: ['B3'], delay: 1.2, duration: 3.0, velocity: 0.2 },
      { notes: ['A3'], delay: 1.5, duration: 4.0, velocity: 0.22 },

      { notes: ['F2', 'C3'], delay: 2.0, duration: 4.8, velocity: 0.22 },
      { notes: ['A3'], delay: 1.5, duration: 3.5, velocity: 0.22 },
      { notes: ['G3'], delay: 1.2, duration: 3.0, velocity: 0.2 },
      { notes: ['E3'], delay: 1.5, duration: 4.5, velocity: 0.24 },
    ],
  },
  excited: {
    tempoBpm: 108,
    sequence: [
      { notes: ['G3', 'D4'], delay: 0, duration: 1.8, velocity: 0.48 },
      { notes: ['B4'], delay: 0.4, duration: 1.0, velocity: 0.5 },
      { notes: ['C5'], delay: 0.4, duration: 0.9, velocity: 0.52 },
      { notes: ['D5'], delay: 0.4, duration: 1.4, velocity: 0.54 },

      { notes: ['E3', 'B3'], delay: 0.8, duration: 1.8, velocity: 0.46 },
      { notes: ['G4'], delay: 0.4, duration: 1.0, velocity: 0.5 },
      { notes: ['A4'], delay: 0.4, duration: 0.9, velocity: 0.52 },
      { notes: ['B4'], delay: 0.4, duration: 1.4, velocity: 0.52 },

      { notes: ['C3', 'G3'], delay: 0.8, duration: 1.8, velocity: 0.46 },
      { notes: ['E4'], delay: 0.4, duration: 1.0, velocity: 0.5 },
      { notes: ['G4'], delay: 0.4, duration: 0.9, velocity: 0.52 },
      { notes: ['C5'], delay: 0.4, duration: 1.5, velocity: 0.55 },

      { notes: ['D3', 'A3'], delay: 0.8, duration: 2.0, velocity: 0.48 },
      { notes: ['Fs4'], delay: 0.4, duration: 1.0, velocity: 0.5 },
      { notes: ['A4'], delay: 0.4, duration: 1.2, velocity: 0.52 },
      { notes: ['G4'], delay: 0.4, duration: 2.5, velocity: 0.56 },
    ],
  },
  relaxed: {
    tempoBpm: 60,
    sequence: [
      { notes: ['Eb3', 'Bb3'], delay: 0, duration: 3.8, velocity: 0.32 },
      { notes: ['G4'], delay: 1.0, duration: 2.8, velocity: 0.34 },
      { notes: ['F4'], delay: 0.8, duration: 2.2, velocity: 0.32 },
      { notes: ['Eb4'], delay: 0.8, duration: 3.0, velocity: 0.35 },

      { notes: ['C3', 'G3'], delay: 1.4, duration: 3.8, velocity: 0.3 },
      { notes: ['Eb4'], delay: 1.0, duration: 2.8, velocity: 0.32 },
      { notes: ['D4'], delay: 0.8, duration: 2.2, velocity: 0.3 },
      { notes: ['Bb3'], delay: 0.8, duration: 3.2, velocity: 0.32 },

      { notes: ['Ab2', 'Eb3'], delay: 1.4, duration: 4.0, velocity: 0.3 },
      { notes: ['C4'], delay: 1.0, duration: 2.8, velocity: 0.32 },
      { notes: ['Bb3'], delay: 0.8, duration: 2.2, velocity: 0.3 },
      { notes: ['G3'], delay: 0.8, duration: 3.5, velocity: 0.34 },

      { notes: ['Bb2', 'F3'], delay: 1.4, duration: 4.2, velocity: 0.32 },
      { notes: ['D4'], delay: 1.0, duration: 3.0, velocity: 0.34 },
      { notes: ['Eb4'], delay: 1.0, duration: 4.2, velocity: 0.36 },
    ],
  },
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private musicEnabled = false;

  // Master music gain node for cross-fading and smooth level control
  private musicMasterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private currentMood: MoodType = 'happy';
  private currentSeqTimer: number | null = null;
  private stepIndex = 0;
  private musicVolume = 0.35; // Default 35% volume

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSfxEnabled(val: boolean) {
    this.sfxEnabled = val;
  }

  public setMusicEnabled(val: boolean) {
    this.musicEnabled = val;
    if (val) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  public isMusicOn(): boolean {
    return this.musicEnabled;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicMasterGain && this.ctx && this.isMusicPlaying) {
      const now = this.ctx.currentTime;
      this.musicMasterGain.gain.cancelScheduledValues(now);
      this.musicMasterGain.gain.linearRampToValueAtTime(this.musicVolume, now + 0.1);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Set or change mood atmosphere for the solo instrumental piano music
   */
  public setMood(mood: MoodType) {
    if (this.currentMood === mood && this.isMusicPlaying) return;
    this.currentMood = mood;

    if (this.musicEnabled) {
      this.crossFadeToMood(mood);
    }
  }

  public getMood(): MoodType {
    return this.currentMood;
  }

  // ---------------------------------------------------------------------------
  // PROCEDURAL SOLO ACOUSTIC PIANO NOTE SYNTHESIS
  // ---------------------------------------------------------------------------
  private triggerPianoNote(freq: number, duration: number, velocity: number = 0.4) {
    if (!this.ctx || !this.musicMasterGain) return;
    try {
      const now = this.ctx.currentTime;
      const actualVelocity = Math.max(0.1, Math.min(1.0, velocity));

      // 1. Acoustic Soundboard Lowpass Filter
      // Brighter on higher velocities, warmer and softer on lower velocities
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoffFreq = Math.min(6500, freq * 3.8 + actualVelocity * 2200);
      filter.frequency.setValueAtTime(cutoffFreq, now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(400, cutoffFreq * 0.35), now + duration);
      filter.Q.setValueAtTime(1.1, now);

      // Note Main Gain (Envelope)
      const noteGain = this.ctx.createGain();
      const peakGain = actualVelocity * 0.28;

      // Piano Envelope: rapid attack, gentle decay, sustained tail
      noteGain.gain.setValueAtTime(0.0001, now);
      noteGain.gain.linearRampToValueAtTime(peakGain, now + 0.008); // 8ms hammer attack
      noteGain.gain.exponentialRampToValueAtTime(peakGain * 0.65, now + 0.18); // Initial felt decay
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Natural string release

      // 2. Fundamental & Overtones (Rich acoustic string resonance)
      // Harmonic 1 (Fundamental)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Harmonic 2 (Octave overtone, slightly detuned +0.7 cents for natural chorus beating)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(0.8, now);
      gain2.gain.setValueAtTime(0.42, now);
      osc2.connect(gain2);

      // Harmonic 3 (Fifth overtone, -0.9 cents detuned)
      const osc3 = this.ctx.createOscillator();
      const gain3 = this.ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);
      osc3.detune.setValueAtTime(-0.9, now);
      gain3.gain.setValueAtTime(0.18, now);
      osc3.connect(gain3);

      // 3. Felt Hammer Transient Attack (Quick, soft felt strike)
      const hammer = this.ctx.createOscillator();
      const hammerGain = this.ctx.createGain();
      hammer.type = 'triangle';
      hammer.frequency.setValueAtTime(freq * 4.5, now);
      hammerGain.gain.setValueAtTime(actualVelocity * 0.08, now);
      hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      hammer.connect(hammerGain);

      // Routing
      osc1.connect(noteGain);
      gain2.connect(noteGain);
      gain3.connect(noteGain);
      hammerGain.connect(noteGain);

      noteGain.connect(filter);
      filter.connect(this.musicMasterGain);

      // Timing
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      hammer.start(now);

      const stopTime = now + duration + 0.1;
      osc1.stop(stopTime);
      osc2.stop(stopTime);
      osc3.stop(stopTime);
      hammer.stop(now + 0.02);
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // MUSIC SEQUENCER & CROSSFADE
  // ---------------------------------------------------------------------------
  private startMusic() {
    this.initCtx();
    if (!this.ctx) return;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;

    // Create / connect master music gain
    if (!this.musicMasterGain) {
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.connect(this.ctx.destination);
    }

    // Fade in
    const now = this.ctx.currentTime;
    this.musicMasterGain.gain.cancelScheduledValues(now);
    this.musicMasterGain.gain.setValueAtTime(0.001, now);
    this.musicMasterGain.gain.linearRampToValueAtTime(this.musicVolume, now + 1.2);

    this.stepIndex = 0;
    this.scheduleNextPianoNote();
  }

  private stopMusic() {
    if (this.currentSeqTimer !== null) {
      clearTimeout(this.currentSeqTimer);
      this.currentSeqTimer = null;
    }
    if (this.musicMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicMasterGain.gain.cancelScheduledValues(now);
      this.musicMasterGain.gain.linearRampToValueAtTime(0.001, now + 0.6);
    }
    this.isMusicPlaying = false;
  }

  public crossFadeToMood(newMood: MoodType) {
    this.currentMood = newMood;
    if (!this.musicEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    if (!this.isMusicPlaying) {
      this.startMusic();
      return;
    }

    if (!this.musicMasterGain) return;
    const now = this.ctx.currentTime;

    // Gentle fade down old atmosphere
    this.musicMasterGain.gain.cancelScheduledValues(now);
    this.musicMasterGain.gain.linearRampToValueAtTime(Math.min(0.04, this.musicVolume * 0.15), now + 0.6);

    setTimeout(() => {
      if (!this.isMusicPlaying) return;
      this.stepIndex = 0;
      if (this.musicMasterGain && this.ctx) {
        const nextNow = this.ctx.currentTime;
        // Fade up new atmosphere
        this.musicMasterGain.gain.linearRampToValueAtTime(this.musicVolume, nextNow + 1.0);
      }
    }, 650);
  }

  private scheduleNextPianoNote() {
    if (!this.isMusicPlaying || !this.musicEnabled) return;

    const comp = PIANO_COMPOSITIONS[this.currentMood] || PIANO_COMPOSITIONS.happy;
    const seq = comp.sequence;
    if (seq.length === 0) return;

    const event = seq[this.stepIndex % seq.length];
    this.stepIndex++;

    // Play all notes in the event
    event.notes.forEach((noteName) => {
      const freq = NOTE_FREQS[noteName];
      if (freq) {
        this.triggerPianoNote(freq, event.duration, event.velocity);
      }
    });

    // Compute delay in ms based on tempo
    const secondsPerBeat = 60 / comp.tempoBpm;
    const delayMs = Math.max(180, Math.round(event.delay * secondsPerBeat * 1000));

    this.currentSeqTimer = window.setTimeout(() => {
      this.scheduleNextPianoNote();
    }, delayMs);
  }

  // ---------------------------------------------------------------------------
  // INTERFACE & GAMEPLAY SFX
  // ---------------------------------------------------------------------------
  public playClick() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {}
  }

  public playBump() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playStep() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const pitch = 220 + Math.random() * 40;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  public playPlantMemory() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Arpeggiated solo piano chord chime
      const notes = [NOTE_FREQS.C4, NOTE_FREQS.E4, NOTE_FREQS.G4, NOTE_FREQS.B4, NOTE_FREQS.C5, NOTE_FREQS.E5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.16, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.55);
      });
    } catch {}
  }

  public playTreeInteract() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [NOTE_FREQS.E4, NOTE_FREQS.A4, NOTE_FREQS.C5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch {}
  }

  public playChime(freq = 523.25, duration = 0.4) {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration + 0.05);
    } catch {}
  }

  public playNote(freq = 523.25, duration = 0.4) {
    this.playChime(freq, duration);
  }

  public playDayNightToggle(isNight: boolean) {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      if (isNight) {
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(290, now + 0.25);
      } else {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.25);
      }
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  public playLetterSeal() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Deep resonant stamp thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      // Golden wax shimmer chimes (E5, G#5, B5, E6)
      const shimmerNotes = [659.25, 830.61, 987.77, 1318.51];
      shimmerNotes.forEach((f, i) => {
        const sOsc = this.ctx!.createOscillator();
        const sGain = this.ctx!.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(f, now + 0.08 + i * 0.05);
        sGain.gain.setValueAtTime(0.12, now + 0.08 + i * 0.05);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + i * 0.05 + 0.45);
        sOsc.connect(sGain);
        sGain.connect(this.ctx!.destination);
        sOsc.start(now + 0.08 + i * 0.05);
        sOsc.stop(now + 0.08 + i * 0.05 + 0.5);
      });
    } catch {}
  }

  public playLetterOpen() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle harp unroll (G4, C5, E5, G5, C6)
      const harpNotes = [392.00, 523.25, 659.25, 783.99, 1046.50];
      harpNotes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.13, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.45);
      });
    } catch {}
  }

  public playMailboxDrop() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Soft metallic chute chime
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.08); // A5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);
    } catch {}
  }

  public playGentlePop() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // -------------------------------------------------------------
  // COMPANION PET SFX
  // -------------------------------------------------------------
  public playPetHappy() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Sweet two-tone trill (G5 -> C6)
      const freqs = [783.99, 1046.50];
      freqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.12, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.25);
      });
    } catch {}
  }

  public playPetChirp() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.09);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  public playPetEat() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // 3 gentle cute crunchy bites
      [0, 0.1, 0.2].forEach((offset) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440 + Math.random() * 80, now + offset);
        gain.gain.setValueAtTime(0.1, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.08);
      });
    } catch {}
  }

  public playPetToy() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // High cheerful squeak
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playPetCelebration() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Joyous 5-chord arpeggio (C5, E5, G5, B5, C6)
      const fanfare = [523.25, 659.25, 783.99, 987.77, 1046.50];
      fanfare.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.09);
        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.65);
      });
    } catch {}
  }

  public playBell() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Gentle meditation bell chime (E5 + harmonics)
      [659.25, 1318.51].forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(i === 0 ? 0.15 : 0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {}
  }

  public playSparkle() {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // 4 ascending starry chimes (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.4);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();
