

# 🦅 Garuda - Sistema Inteligente de Gestión del Ecosistema Aviar
**InterHack Barcelona 2026 | Reto Qualcomm**

[![Hardware](https://img.shields.io/badge/Hardware-Arduino_Uno_Q-blue.svg)](#)
[![AI](https://img.shields.io/badge/Edge_AI-Computer_Vision-orange.svg)](#)
[![License](https://img.shields.io/badge/License-Open_Source-green.svg)](#)

Garuda es una iniciativa tecnológica de infraestructura urbana diseñada específicamente para la Barcelona del futuro. Nuestro objetivo es monitorizar, gestionar y equilibrar el ecosistema de aves de la ciudad, controlando especies exóticas invasoras y potenciando la recuperación de la fauna autóctona.

## 🌍 Motivación y Contexto Medioambiental

En los últimos años, Barcelona ha sufrido un impacto ecológico significativo debido a especies exóticas invasoras como la **cotorra argentina** (*Myiopsitta monachus*), cuya población ha aumentado en más de 5.000 ejemplares desde 2015. 

Esta superpoblación supone una amenaza directa para la fauna local, desplazando activamente a especies autóctonas como el **gorrión común** (*Passer domesticus*). Las cotorras compiten de forma agresiva por alimento y espacios de anidación. La misión de Garuda es luchar contra este desequilibrio territorial de forma ética y sostenible.

## ⚙️ ¿Cómo funciona?

El núcleo de Garuda es una red de **casetas inteligentes y automatizadas**. Su propósito es reducir la población de especies invasoras mediante un método de control de natalidad ético (alpiste con castrantes químicos, totalmente indoloro) permitiendo que los gorriones recuperen gradualmente sus hábitats.

La caseta dispone de un diseño de **doble compartimento**:
1. **Compartimento A:** Alpiste tratado químicamente (solo accesible para especies invasoras durante su época de apareamiento).
2. **Compartimento B:** Alpiste estándar (accesible para la fauna autóctona).

### Funcionalidades Clave:
* **👁️ Visión por Computador (Edge AI):** Una cámara integrada con un modelo de IA en el dispositivo identifica en tiempo real la especie que se ha posado. Mediante actuadores mecánicos, se abren o cierran las compuertas correspondientes.
* **🎙️ Monitorización Acústica:** Un micrófono captura e identifica los cantos cercanos, generando un registro de las especies que frecuentan la zona.
* **🔊 Estimulación Auditiva:** Un altavoz/buzzer reproduce cantos específicos para animar la reproducción de especies locales amenazadas o ahuyentar a especies no deseadas.
* **📊 Recolección de Datos:** Toda interacción alimenta un registro de actividad poblacional (útil para administraciones y estudios biológicos).

## 🛠️ Hardware y Sensores

El proyecto está impulsado por el **Arduino Uno Q** (aprovechando sus capacidades de Edge AI de Qualcomm) y equipado con:

* **Cámara Visiual:** Para clasificación de especies.
* **Micrófono:** Para identificación de cantos de aves.
* **Altavoz / Buzzer:** Para reproducción de cantos o señales de disuasión.
* **Sensor de Movimiento / Distancia / Térmico:** Para detectar la aproximación de aves (o plagas nocturnas) y despertar el sistema (ahorro energético).
* **Tira de LEDs RGB:** Para indicaciones visuales de estado o disuasión lumínica.
* **Servomotores:** Para el control físico de las trampillas de los dispensadores.

## 🚀 Instalación y Despliegue (Alpha Build)

1. Clona el repositorio:
    git clone https://github.com/tu-usuario/garuda.git
   
2. Instala las dependencias necesarias para el modelo de visión:
    pip install -r requirements.txt
   
3. Carga el firmware en el **Arduino Uno Q** utilizando el IDE de Arduino y las librerías proporcionadas en la carpeta `/firmware`.

4. Ejecuta el script de pruebas de la cámara:
    python src/vision_test.py

## 🔮 Trabajo Futuro y Escalabilidad

* **Conectividad IoT:** Envío de datos en tiempo real (LoRaWAN / 5G) para crear un mapa de calor de biodiversidad en un Dashboard municipal.
* **Autonomía Energética:** Incorporación de placas solares y modos *Deep Sleep* para mantenimiento cero.
* **Detección Nocturna de Plagas:** Uso de sensores térmicos durante la noche para alertar sobre presencia de roedores.
* **Estación Ambiental Integrada:** Añadir sensores de calidad del aire (CO2, PM2.5) para aprovechar el despliegue de las casetas.

## 📄 Licencia

Este proyecto es totalmente **Open Source** y está distribuido bajo la licencia MIT. Las administraciones públicas, universidades y comunidades "Citizen Science" están invitadas a utilizar y mejorar nuestros modelos de datos.





