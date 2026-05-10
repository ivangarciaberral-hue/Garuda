#include <Arduino_Modulino.h>
#include <Arduino_RouterBridge.h>

ModulinoPixels   pixels;
ModulinoDistance distanceSensor;
ModulinoThermo   thermo;
ModulinoBuzzer   buzzer;

const int MAX_DISTANCE_MM = 1000;
const int NUM_LEDS        = 8;

uint8_t LED_R[8] = {255, 255, 255, 220, 140,   0,   0,   0};
uint8_t LED_G[8] = {  0,  60, 140, 200, 220, 255, 200, 150};
uint8_t LED_B[8] = {  0,   0,   0,   0,   0,   0,  80, 150};

// ── Buzzer no bloqueante ──────────────────────────────────────────────────────
const int    NOTE_FREQS[3]     = {440, 880, 1320};
const int    NOTE_DURATIONS[3] = {200, 200, 400};
const int    NOTE_GAP          = 50;
const int    MELODY_GAP        = 300;
const unsigned long BUZZER_TOTAL_MS = 10000;

bool          buzzerActive = false;
unsigned long buzzerStart  = 0;
unsigned long noteStart    = 0;
int           noteIndex    = 0;
bool          inGap        = false;

// ── Timers para envío periódico ───────────────────────────────────────────────
unsigned long lastSensorSend   = 0;
unsigned long lastDistanceSend = 0;
const unsigned long SENSOR_INTERVAL   = 10000;  // 10 s
const unsigned long DISTANCE_INTERVAL = 1000;    // 1000 ms 

// ── Última distancia válida (para los LEDs) ───────────────────────────────────
float lastDistanceMM = MAX_DISTANCE_MM;

// ─────────────────────────────────────────────────────────────────────────────

void updatePixels(float mm) {
  mm = max(0.0f, min(mm, (float)MAX_DISTANCE_MM));
  int n = round(NUM_LEDS * (1.0f - mm / MAX_DISTANCE_MM));
  for (int i = 0; i < NUM_LEDS; i++) {
    if (i < n) pixels.set(i, ModulinoColor(LED_R[i], LED_G[i], LED_B[i]));
    else        pixels.clear(i);
  }
  pixels.show();
}

void updateBuzzer() {
  if (!buzzerActive) return;
  unsigned long now = millis();
  if (now - buzzerStart >= BUZZER_TOTAL_MS) {
    buzzer.noTone();
    buzzerActive = false;
    return;
  }
  unsigned long elapsed = now - noteStart;
  if (inGap) {
    if (elapsed >= (unsigned long)MELODY_GAP) {
      inGap = false; noteIndex = 0; noteStart = now;
      buzzer.tone(NOTE_FREQS[0], NOTE_DURATIONS[0]);
    }
  } else {
    if (elapsed >= (unsigned long)(NOTE_DURATIONS[noteIndex] + NOTE_GAP)) {
      buzzer.noTone();
      noteIndex++;
      if (noteIndex >= 3) { inGap = true; noteStart = now; }
      else { noteStart = now; buzzer.tone(NOTE_FREQS[noteIndex], NOTE_DURATIONS[noteIndex]); }
    }
  }
}

// ── Callbacks desde Python ────────────────────────────────────────────────────

// Llamar SOLO cuando Python confirme especie == "gorrion"
int onGorrionDetected() {
  if (buzzerActive) return 0;      // ya sonando, ignorar hasta que termine
  buzzerActive = true;
  buzzerStart  = millis();
  noteStart    = millis();
  noteIndex    = 0;
  inGap        = false;
  buzzer.tone(NOTE_FREQS[0], NOTE_DURATIONS[0]);
  return 1;
}

// Llamar para interrumpir el buzzer (ej: cuando el gorrión se va)
int stopSound() {
  buzzer.noTone();
  buzzerActive = false;
  return 1;
}

// ─────────────────────────────────────────────────────────────────────────────

void setup() {
  Modulino.begin(Wire1);
  pixels.begin();
  distanceSensor.begin();
  thermo.begin();
  buzzer.begin();
  for (int i = 0; i < NUM_LEDS; i++) pixels.clear(i);
  pixels.show();

  Bridge.begin();
  Bridge.provide("on_gorrion_detected", onGorrionDetected);  // ← renombrado
  Bridge.provide("stop_sound",          stopSound);          // ← nuevo
}

void loop() {
  Bridge.update();
  unsigned long now = millis();

  
  lastDistanceMM = distanceSensor.get();  // mm, float
  updatePixels(lastDistanceMM);

  if (now - lastDistanceSend >= DISTANCE_INTERVAL) {
    lastDistanceSend = now;
    Bridge.call("on_distance", lastDistanceMM);
  }

  if (now - lastSensorSend >= SENSOR_INTERVAL) {
    lastSensorSend = now;
    float temp = thermo.getTemperature();
    float hum  = thermo.getHumidity();
    Bridge.call("on_thermo", temp, hum);
  }

  updateBuzzer();
  delay(10);
}