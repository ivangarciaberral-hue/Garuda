# SPDX-FileCopyrightText: Copyright (C) ARDUINO SRL (http://www.arduino.cc)
#
# SPDX-License-Identifier: MPL-2.0

from arduino.app_utils import App
from datetime import datetime, UTC
#Web UI
from arduino.app_bricks.web_ui import WebUI
ui = WebUI()

# Sound Player:
from modulino import ModulinoBuzzer
def playSparrowAudio():
    for(i = 1; i <= 3; i++):
        frequency = 440*i  # Frequency of the tone in Hz
        duration = 1000*i  # Duration of the tone in milliseconds
        
        # Play the tone
        buzzer.tone(frequency, duration, blocking=True)
        sleep(0.5)  # Wait for 1 second
        # Stop the tone
        buzzer.tone(0, duration, blocking=True)

# Video AI:
from arduino.app_bricks.video_objectdetection import VideoObjectDetection
detection_stream = VideoObjectDetection(confidence=0.5, debounce_sec=0.0)

# Register a callback for when all objects are detected
def send_detections_to_ui(detections: dict):
  for key, values in detections.items():
    parrot = false
    sparrow = false
    for value in values:
        if(key == "Parrot")
            parrot = true
        else if(key = "Sparrow")
            sparrow = true
            playSparrowAudio()

    entry = {
        "parrotIsDetected": parrot,
        "SparrowIsDetected": sparrow
    }
    ui.send_message("VideoDetection", message=entry)

ui.on_message("override_th", lambda sid, threshold: detection_stream.override_threshold(threshold))

# Sound AI:
from arduino.app_bricks.audio_classification import AudioClassification
classifier = AudioClassification()
classifier.on_detect("Sparrow", lambda sid, threshold: ui.send_message("AudioDetection", message= {"SoundSource": "Sparrow"}))


detection_stream.on_detect_all(send_detections_to_ui)

App.run()