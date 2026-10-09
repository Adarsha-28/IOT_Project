/**
 * Determines temperature status based on server room predefined thresholds:
 * - <= 30°C: NORMAL (Green LED ON, Red LED OFF)
 * - > 30°C and <= 35°C: WARNING (Green LED OFF, Red LED ON)
 * - > 35°C: HIGH TEMPERATURE (Green LED OFF, Red LED ON)
 *
 * NOTE: Pure threshold monitoring and warning system. Not predictive.
 */
export function getTemperatureStatus(temperature) {
  const temp = Number(temperature);

  if (isNaN(temp)) {
    return {
      status: 'UNKNOWN',
      message: 'Invalid temperature reading',
      color: 'gray',
      ledStatus: { greenLed: false, redLed: false }
    };
  }

  if (temp <= 30.0) {
    return {
      status: 'NORMAL',
      message: 'Temperature within normal range',
      color: 'green',
      ledStatus: { greenLed: true, redLed: false }
    };
  } else if (temp <= 35.0) {
    return {
      status: 'WARNING',
      message: 'Temperature above normal range',
      color: 'orange',
      ledStatus: { greenLed: false, redLed: true }
    };
  } else {
    return {
      status: 'HIGH TEMPERATURE',
      message: 'High temperature detected',
      color: 'red',
      ledStatus: { greenLed: false, redLed: true }
    };
  }
}
