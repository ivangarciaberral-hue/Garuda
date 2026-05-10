# 🦅 Garuda - Smart Avian Ecosystem Management
**InterHack Barcelona 2026 | Qualcomm Challenge**

[![Hardware](https://img.shields.io/badge/Hardware-Arduino_Uno_Q-blue.svg)](#)
[![AI](https://img.shields.io/badge/Edge_AI-Edge_Impulse-orange.svg)](#)
[![IoT](https://img.shields.io/badge/IoT-Smart_City-green.svg)](#)
[![IA](https://studio.edgeimpulse.com/public/991569/live) (#)]
[![IA](https://studio.edgeimpulse.com/public/991753/live) (#)]

**Garuda** is an urban infrastructure technology initiative based on IoT (Internet of Things), designed specifically for the Barcelona of the future. Its main objective is to monitor, manage, and balance the city's avian ecosystem acting on three simultaneous fronts: real-time data collection, controlling the expansion of invasive exotic species, and actively promoting the recovery and reproduction of displaced native fauna.

## 🌍 Motivation & Environmental Context

In recent years, Barcelona has suffered a significant ecological impact due to exotic invasive species such as the **monk parakeet** (*Myiopsitta monachus*), whose population has increased by more than 5,000 individuals since 2015. 

This overpopulation poses a direct threat to local flora and fauna. The monk parakeet actively displaces native species such as the **house sparrow** (*Passer domesticus*), competing aggressively for food sources and nesting spaces. Garuda's mission is to fight against this imbalance, protecting vulnerable local species from the territorial rise of invasive ones through ethical and sustainable methods.

## ⚙️ How It Works

The core of Garuda is a network of smart, automated birdhouses. Its purpose is to reduce the population of invasive species through an ethical, sustainable, and completely painless birth control method.

The birdhouse features a **dual-compartment design**:
1. **Compartment A (Native):** Stocked with standard birdseed.
2. **Compartment B (Invasive):** Stocked with birdseed treated with chemical castrators (administered exclusively during the mating seasons of invasive species).

### Key Features:
* **👁️ Computer Vision & Access Management:** An integrated camera analyzes in real-time the type of bird that has landed. Using mechanical actuators, the system opens or closes the doors of the food compartments, ensuring modified birdseed is only consumed by the target invasive species.
* **🎙️ Acoustic Monitoring:** An environmental microphone captures and identifies the songs of nearby birds, generating a sound map and a detailed record of local species.
* **🔊 Native Auditory Stimulation:** An integrated speaker plays specific songs and calls designed to encourage the reproduction and safe settlement of sparrows and other threatened local species.
* **🔒 Privacy by Design:** The AI models are trained exclusively to detect birds. All images and audio are processed entirely locally. No data or metadata unrelated to birds is stored or transmitted.

## 🛠️ Prototype Architecture

### Hardware
The prototype's hardware architecture is powered by an **Arduino Uno Q** board (4 GB of RAM), leveraging Qualcomm's capabilities, and equipped with:
* **Modulinos:** 1 Buzzer, 2 RGB LED strips, and 1 motion detector.
* **Webcam:** Logitech Brio105 (1080p FullHD) with an integrated microphone.

### Software & AI Models
* **Local Processing:** The application developed for the Arduino Uno Q executes all functionalities and services locally.
* **Edge AI:** We use the Image Analysis and Audio Analysis modules developed via **Edge Impulse**. The models are specially trained to differentiate between monk parakeets and sparrows based on visual traits and bird songs.
* **Web Dashboard:** The *Garuda Project* website displays the birdhouses' locations on a map, showing real-time camera feeds and triggering the 3D model's mechanical systems based on AI detections.

## 🚀 Possible Future Implementations

* **Server Architecture:** Separate the architecture into independent servers (API/Database server and a dedicated Data Visualization web server).
* **API Integration:** Make each Arduino Uno Q board responsible for collecting data and controlling access to bird food, sending the information via API calls.
* **Power Optimization:** Optimize power consumption by making the camera turn on only when the presence detector senses motion.
* **Hardware Upgrades:** Replace the buzzer with a real speaker for high-fidelity bird song reproduction.
* **Expanded Database:** Train models to detect and manage a wider variety of bird species.
* **Smart Maintenance UI:** Use color codes on the LED strips to visually indicate the birdhouse's status (e.g., needs birdseed refill or component fix) and send automated error alerts to the web interface.
* **City-wide Ecosystem Integration:** Integrate the smart birdhouse with other smart city products, such as a smart car module capable of detecting and analyzing city nests to create a comprehensive ornithological map.

---
*Built with ❤️ for a more sustainable and balanced urban ecosystem.*