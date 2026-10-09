/**
 * IoT-Based Server Room Temperature Monitoring and Warning System
 * Threshold Logic Utility
 *
 * Exact specifications:
 * - Temperature <= 30°C:
 *     Status = NORMAL
 *     Color = Green
 *     Green LED = ON, Red LED = OFF
 *     Message = "Temperature within normal range"
 *
 * - Temperature > 30°C and <= 35°C:
 *     Status = WARNING
 *     Color = Orange
 *     Green LED = OFF, Red LED = ON
 *     Message = "Temperature above normal range"
 *
 * - Temperature > 35°C:
 *     Status = HIGH TEMPERATURE
 *     Color = Red
 *     Green LED = OFF, Red LED = ON
 *     Message = "High temperature detected"
 *
 * IMPORTANT:
 * This system MONITORS the environment and WARNS when the temperature exceeds defined thresholds.
 * It is NOT an AI or predictive system.
 */

export function getTemperatureStatus(temperature) {
  const temp = parseFloat(temperature);

  if (isNaN(temp)) {
    return {
      status: 'UNKNOWN',
      message: 'Awaiting sensor reading...',
      color: 'gray',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      textClass: 'text-slate-600',
      dotClass: 'bg-slate-400',
      borderClass: 'border-slate-300',
      ledStatus: {
        greenLed: false,
        redLed: false,
      },
    };
  }

  if (temp <= 30.0) {
    return {
      status: 'NORMAL',
      message: 'Temperature within normal range',
      color: 'green',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      textClass: 'text-emerald-600',
      dotClass: 'bg-emerald-500',
      borderClass: 'border-emerald-300',
      ledStatus: {
        greenLed: true,
        redLed: false,
      },
    };
  } else if (temp <= 35.0) {
    return {
      status: 'WARNING',
      message: 'Temperature above normal range',
      color: 'orange',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      textClass: 'text-amber-600',
      dotClass: 'bg-amber-500',
      borderClass: 'border-amber-300',
      ledStatus: {
        greenLed: false,
        redLed: true,
      },
    };
  } else {
    return {
      status: 'HIGH TEMPERATURE',
      message: 'High temperature detected',
      color: 'red',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      textClass: 'text-rose-600',
      dotClass: 'bg-rose-500',
      borderClass: 'border-rose-300',
      ledStatus: {
        greenLed: false,
        redLed: true,
      },
    };
  }
}
