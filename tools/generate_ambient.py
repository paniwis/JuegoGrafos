#!/usr/bin/env python3
"""
Generador de música ambiental simulada para NECROFORGE.
Crea un archivo de audio loop ambiental simple usando osciladores Web Audio API.
Se recomienda reemplazarlo con una pista de música real.
"""

import wave
import struct
import math

def generate_ambient_loop(filename="ambient-loop.wav", duration_seconds=3, sample_rate=44100):
    """
    Genera un loop ambiental simple usando tonos sinusoidales.
    Simula una atmósfera oscura/misteriosa para el juego.
    """
    num_samples = duration_seconds * sample_rate
    
    # Osciladores base para atmósfera
    base_freq = 55  # Nota A1 (muy baja)
    harmonic_freqs = [
        (base_freq * 1, 0.15),      # Fundamental (55 Hz)
        (base_freq * 1.5, 0.10),    # Quinta inferior (82.5 Hz)
        (base_freq * 0.5, 0.12),    # Octava abajo (27.5 Hz)
    ]
    
    samples = []
    
    for sample_idx in range(num_samples):
        t = sample_idx / sample_rate
        
        # Osciladores armónicos
        value = 0
        for freq, amplitude in harmonic_freqs:
            # Onda sinusoidal suave
            wave_val = math.sin(2 * math.pi * freq * t)
            # Envolvente ADSR simulada
            envelope = min(t, 2.0) / 2.0 * math.exp(-t / (duration_seconds - 0.5))
            value += wave_val * amplitude * envelope
        
        # Ruido ambiental suave (LFO)
        lfo_depth = 0.05
        lfo = math.sin(2 * math.pi * 0.3 * t)  # 0.3 Hz modulation
        value += lfo * lfo_depth
        
        # Limitar y convertir a 16-bit
        value = max(-1.0, min(1.0, value))
        value = int(value * 32767)
        samples.append(value)
    
    # Escribir archivo WAV
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)   # 16-bit
        wav_file.setframerate(sample_rate)
        for sample in samples:
            wav_file.writeframes(struct.pack('<h', sample))
    
    print(f"✓ Generado: {filename} ({duration_seconds}s @ {sample_rate} Hz)")
    return filename

if __name__ == "__main__":
    # Generar versión WAV
    generate_ambient_loop("assets/ambient-loop.wav", duration_seconds=3)
    
    # Nota: Para MP3, usar ffmpeg:
    # ffmpeg -i assets/ambient-loop.wav -q:a 5 assets/ambient-loop.mp3
    print("\nPara convertir a MP3:")
    print("  ffmpeg -i assets/ambient-loop.wav -q:a 5 assets/ambient-loop.mp3")
    print("\nO descarga una pista ambiental libre de derechos y colócala en:")
    print("  assets/ambient-loop.mp3")
