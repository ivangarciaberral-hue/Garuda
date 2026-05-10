# SPDX-FileCopyrightText: Copyright (C) ARDUINO SRL (http://www.arduino.cc)
# SPDX-License-Identifier: MPL-2.0

import random
from datetime import datetime, UTC

from arduino.app_utils import App, Bridge
from arduino.app_bricks.web_ui import WebUI
from arduino.app_bricks.video_objectdetection import VideoObjectDetection

ui = WebUI()
detection_stream = VideoObjectDetection(confidence=0.90, debounce_sec=0.0)

DEVICE_LAT   = 41.38572
DEVICE_LNG   = 2.18714
GEO_JITTER   = 0.0005
BIRD_SPECIES = {"Gorrion", "Cotorra"}
MIN_CONFIDENCE = 0.90

ui.on_message(
    "override_th",
    lambda sid, threshold: detection_stream.override_threshold(threshold)
)

def play_gorrion_audio() -> None:
    try:
        Bridge.call("on_gorrion_detected")
    except Exception as exc:
        print(f"[Buzzer] Bridge error: {exc}")

def stop_gorrion_audio() -> None:
    try:
        Bridge.call("stop_sound")
    except Exception as exc:
        print(f"[Buzzer] Bridge error: {exc}")

def on_distance(mm: float) -> None:
    print(f"[Distance] {mm:.1f} mm")

def on_thermo(temp: float, hum: float) -> None:
    msg = {
        "temperature": round(temp, 1),
        "humidity": round(hum, 1),
        "timestamp": int(datetime.now(UTC).timestamp() * 1000),
    }
    ui.send_message("env", message=msg)
    print(f"[Thermo] {msg}")

Bridge.provide("on_distance", on_distance)
Bridge.provide("on_thermo", on_thermo)

def send_detections_to_ui(detections: dict):
    gorrion_detected = False
    cotorra_detected = False

    for key, values in detections.items():
        species = key.strip().title()

        for value in values:
            confidence = float(value.get("confidence", 0.0))

            if confidence < MIN_CONFIDENCE:
                continue

            timestamp = datetime.now(UTC).isoformat()

            ui.send_message("detection", message={
                "content": species,
                "confidence": confidence,
                "timestamp": timestamp,
            })

            if species == "Gorrion":
                gorrion_detected = True
                play_gorrion_audio()
            elif species == "Cotorra":
                cotorra_detected = True

            if species in BIRD_SPECIES:
                lat = DEVICE_LAT + random.uniform(-GEO_JITTER, GEO_JITTER)
                lng = DEVICE_LNG + random.uniform(-GEO_JITTER, GEO_JITTER)
                ts_iso = datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%S")
                payload = f"{ts_iso}|{species}|{lat:.5f}|{lng:.5f}|{confidence:.2f}"
                ui.send_message("bird_detection", message={"payload": payload})
                print(f"[BirdDetection] {payload}")

    if not gorrion_detected:
        stop_gorrion_audio()

    ui.send_message("VideoDetection", message={
        "GorrionIsDetected": gorrion_detected,
        "CotorraIsDetected": cotorra_detected
    })

detection_stream.on_detect_all(send_detections_to_ui)

ui.start()
App.run()