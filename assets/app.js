// SPDX-FileCopyrightText: Copyright (C) ARDUINO SRL (http://www.arduino.cc)
//
// SPDX-License-Identifier: MPL-2.0
//

// ── Socket.IO ────────────────────────────────────────────────
const socket = io(`http://${window.location.host}`);

// ── Contador interno para IDs de detección en tiempo real ───
let _rtDetCount = 0;

// ── Inicialización principal ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSocketIO();
    initializeConfidenceSlider();
});

// ── Conexión Socket.IO ────────────────────────────────────────
function initSocketIO() {

    socket.on('connect', () => {
        setSysStatus('online');
    });

    socket.on('disconnect', () => {
        setSysStatus('offline');
    });

    /**
     * Evento de detección enviado por el Arduino.
     * Formato esperado:
     *   { content: 'cotorra'|'gorrion', confidence: 0.0–1.0, timestamp: ISO_string }
     *
     * Se traduce al modelo de BirdWatch v5 y se añade al array
     * global `detections`, actualizando el mapa y la interfaz.
     */
    socket.on('detection', (message) => {
        const det = buildDetection(message);
        if (!det) return;

        // Insertar al principio para que la lista quede en orden
        // cronológico inverso (más reciente primero)
        detections.unshift(det);

        // Redibujar todas las capas que dependen de detections[]
        renderBirdMarkers();
        renderHeatmaps();
        renderDetectionList();
        renderStats();

        // Si el panel de detalle está abierto, refrescar
        if (document.getElementById('detail-panel').classList.contains('open')) {
            updateDetailPanel();
        }
    });
}

// ── Construye un objeto de detección compatible con v5 ────────
/**
 * @param {{ content: string, confidence: number, timestamp: string }} msg
 * @returns {{ id, timestamp, species, lat, lng, confidence } | null}
 */
function buildDetection(msg) {
    const KNOWN = new Set(['cotorra', 'gorrion']);
    const species = (msg.content || '').trim().toLowerCase();

    if (!KNOWN.has(species)) return null;

    const confidence = parseFloat(msg.confidence);
    if (isNaN(confidence)) return null;

    // El Arduino no envía coordenadas GPS; situamos la detección
    // cerca de la caseta con un pequeño desplazamiento aleatorio
    // (~±15 m) para que cada punto sea visible en el mapa.
    const jitter = () => (Math.random() - 0.5) * 0.00027; // ≈15 m
    const lat = DEVICE.lat + jitter();
    const lng = DEVICE.lng + jitter();

    _rtDetCount++;

    return {
        id:         `rt-${String(_rtDetCount).padStart(4, '0')}`,
        timestamp:  new Date(msg.timestamp || Date.now()),
        species,
        lat,
        lng,
        confidence
    };
}

// ── Actualiza el estado del sistema en el sidebar ─────────────
function setSysStatus(state) {
    const pill  = document.getElementById('sys-pill');
    const label = document.getElementById('sys-label');
    if (!pill || !label) return;

    if (state === 'online') {
        pill.classList.remove('offline');
        label.textContent = 'Sistema activo';
    } else {
        pill.classList.add('offline');
        label.textContent = 'Conexión perdida';
    }
}

// ── Control de umbral de confianza ───────────────────────────
/**
 * Si el HTML incluye los elementos del slider (confidenceSlider,
 * confidenceInput, confidenceValueDisplay, sliderProgress,
 * confidenceResetButton) el control queda completamente funcional
 * y emite 'override_th' al backend.
 * Si los elementos no existen (como en v5 por defecto) las
 * funciones simplemente no hacen nada, sin generar errores.
 */
function initializeConfidenceSlider() {
    const confidenceSlider      = document.getElementById('confidenceSlider');
    const confidenceInput       = document.getElementById('confidenceInput');
    const confidenceResetButton = document.getElementById('confidenceResetButton');

    if (!confidenceSlider || !confidenceInput) return; // elementos opcionales

    confidenceSlider.addEventListener('input', updateConfidenceDisplay);
    confidenceInput.addEventListener('input', handleConfidenceInputChange);
    confidenceInput.addEventListener('blur', validateConfidenceInput);
    updateConfidenceDisplay();

    if (confidenceResetButton) {
        confidenceResetButton.addEventListener('click', (e) => {
            if (e.target.classList.contains('reset-icon') || e.target.closest('.reset-icon')) {
                resetConfidence();
            }
        });
    }
}

function handleConfidenceInputChange() {
    const confidenceInput  = document.getElementById('confidenceInput');
    const confidenceSlider = document.getElementById('confidenceSlider');
    if (!confidenceInput || !confidenceSlider) return;

    let value = parseFloat(confidenceInput.value);
    if (isNaN(value)) value = 0.5;
    if (value < 0)    value = 0;
    if (value > 1)    value = 1;

    confidenceSlider.value = value;
    updateConfidenceDisplay();
}

function validateConfidenceInput() {
    const confidenceInput = document.getElementById('confidenceInput');
    if (!confidenceInput) return;

    let value = parseFloat(confidenceInput.value);
    if (isNaN(value)) value = 0.5;
    if (value < 0)    value = 0;
    if (value > 1)    value = 1;

    confidenceInput.value = value.toFixed(2);
    handleConfidenceInputChange();
}

function updateConfidenceDisplay() {
    const confidenceSlider      = document.getElementById('confidenceSlider');
    const confidenceInput       = document.getElementById('confidenceInput');
    const confidenceValueDisplay = document.getElementById('confidenceValueDisplay');
    const sliderProgress        = document.getElementById('sliderProgress');

    if (!confidenceSlider) return;

    const value = parseFloat(confidenceSlider.value);
    socket.emit('override_th', value); // Envía umbral al backend

    const percentage  = (value - confidenceSlider.min) / (confidenceSlider.max - confidenceSlider.min) * 100;
    const displayValue = value.toFixed(2);

    if (confidenceValueDisplay) {
        confidenceValueDisplay.textContent = displayValue;
        confidenceValueDisplay.style.left  = percentage + '%';
    }
    if (confidenceInput && document.activeElement !== confidenceInput) {
        confidenceInput.value = displayValue;
    }
    if (sliderProgress) {
        sliderProgress.style.width = percentage + '%';
    }
}

function resetConfidence() {
    const confidenceSlider = document.getElementById('confidenceSlider');
    const confidenceInput  = document.getElementById('confidenceInput');
    if (!confidenceSlider) return;

    confidenceSlider.value = '0.5';
    if (confidenceInput) confidenceInput.value = '0.50';
    updateConfidenceDisplay();
}

// ── Bug fix v5: resize listener faltante ─────────────────────
// En v5 el cuerpo del handler de resize estaba huérfano;
// aquí lo registramos correctamente.
window.addEventListener('resize', () => {
    if (typeof map !== 'undefined') map.invalidateSize();
    if (document.getElementById('second-view').classList.contains('open')) {
        if (typeof resizeSim === 'function') resizeSim();
    }
});