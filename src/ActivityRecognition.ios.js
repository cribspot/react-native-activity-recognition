import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNActivityRecognition } = NativeModules;

const emitter = new NativeEventEmitter(RNActivityRecognition);
var subscription = null;

var ActivityRecognition = {
  subscribe: function(success: Function) {
    subscription = emitter.addListener(
      "ActivityDetection",
      activity => {
        success({
          ...activity,
          get sorted() {
            return Object.keys(activity)
              .map(type => ({ type: type, confidence: activity[type] }))
          }
        })
      }
    );
    return () => subscription.remove();
  },
  start: function(time: number) {
    return new Promise((resolve, reject) => {
      RNActivityRecognition.startActivity(time, logAndReject.bind(null, resolve, reject))
    })
  },
  stop: function() {
    return new Promise((resolve, reject) => {
      RNActivityRecognition.stopActivity(logAndReject.bind(null, resolve, reject))
    })
  }
}

function logAndReject(resolve, reject, errorMsg) {
  if (errorMsg) {
    // Don't log this as an error, because the client should handle it using `catch`.
    console.log(`[ActivityRecognition] Error: ${errorMsg}`)
    reject(errorMsg)
    return
  }
  resolve()
}

module.exports = ActivityRecognition;
