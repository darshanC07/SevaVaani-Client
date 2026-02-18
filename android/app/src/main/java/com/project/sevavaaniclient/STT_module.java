package com.project.sevavaaniclient;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.content.pm.PackageManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Locale;

public class STT_module extends ReactContextBaseJavaModule implements RecognitionListener {

    private static ReactApplicationContext reactContext;
    private SpeechRecognizer speechRecognizer;
    private Intent speechIntent;
    private Promise sttPromise;

    public STT_module(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "STT_module";
    }

    @ReactMethod
    public void getSTTResult(Promise promise) {

        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "No activity found");
            return;
        }

        if (!hasPermission()) {
            requestPermission();
            promise.reject("PERMISSION_DENIED", "Microphone permission required");
            return;
        }

        if (sttPromise != null) {
            promise.reject("STT_BUSY", "Speech recognition already running");
            return;
        }

        sttPromise = promise;

        reactContext.runOnUiQueueThread(() -> {
            createRecognizer();
            speechRecognizer.startListening(speechIntent);
        });
    }

    @ReactMethod
    public void speechStop(Promise promise) {

        reactContext.runOnUiQueueThread(() -> {

            if (speechRecognizer != null) {
                speechRecognizer.stopListening();
                speechRecognizer.cancel();
                speechRecognizer.destroy();
                speechRecognizer = null;
            }

            sttPromise = null;
            promise.resolve("Stopped");
        });
    }

    @ReactMethod
    public void getDeviceLanguage(Promise promise) {
        try {
            String locale = Locale.getDefault().toString();
            String language = Locale.getDefault().getLanguage();
            String country = Locale.getDefault().getCountry();
            String displayName = Locale.getDefault().getDisplayName();
            String result = "Locale: " + locale + ", Language: " + language + ", Country: " + country + ", Display: "
                    + displayName;
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERROR", e.getMessage(), e);
        }
    }

    @Override
    public void onReadyForSpeech(Bundle params) {
    }

    @Override
    public void onBeginningOfSpeech() {
    }

    @Override
    public void onRmsChanged(float rmsdB) {
    }

    @Override
    public void onBufferReceived(byte[] buffer) {
    }

    @Override
    public void onEndOfSpeech() {
    }

    @Override
    public void onError(int errorCode) {

        String msg;

        switch (errorCode) {
            case SpeechRecognizer.ERROR_AUDIO:
                msg = "Audio error";
                break;
            case SpeechRecognizer.ERROR_CLIENT:
                msg = "Client error";
                break;
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                msg = "Insufficient permissions";
                break;
            case SpeechRecognizer.ERROR_NO_MATCH:
                msg = "No voice detected";
                break;
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                msg = "Speech timeout";
                break;
            case SpeechRecognizer.ERROR_NETWORK:
                msg = "Network error";
                break;
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                msg = "Network timeout";
                break;
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                msg = "Recognizer busy";
                break;
            case SpeechRecognizer.ERROR_SERVER:
                msg = "Server error";
                break;
            default:
                msg = "Unknown error";
        }

        if (errorCode == SpeechRecognizer.ERROR_NO_MATCH ||
                errorCode == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) {

            // Treat as empty input instead of error
            if (sttPromise != null) {
                sttPromise.resolve("");
                sttPromise = null;
            }

        } else {

            if (sttPromise != null) {
                sttPromise.reject("STT_ERROR", "Error code: " + errorCode);
                sttPromise = null;
            }
        }

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
    }

    @Override
    public void onResults(Bundle results) {

        ArrayList<String> list = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);

        if (sttPromise != null) {
            if (list != null && !list.isEmpty()) {
                sttPromise.resolve(list.get(0));
            } else {
                sttPromise.resolve("No speech detected");
            }
            sttPromise = null;
        }
    }

    @Override
    public void onPartialResults(Bundle partialResults) {
    }

    @Override
    public void onEvent(int eventType, Bundle params) {
    }

    @Override
    public void onCatalystInstanceDestroy() {

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
        sttPromise = null;

        super.onCatalystInstanceDestroy();
    }

    private boolean hasPermission() {
        return ContextCompat.checkSelfPermission(
                reactContext,
                android.Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermission() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            ActivityCompat.requestPermissions(
                    activity,
                    new String[] { android.Manifest.permission.RECORD_AUDIO },
                    1);
        }
    }

    private void createRecognizer() {

        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }

        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext);
        speechRecognizer.setRecognitionListener(this);

        speechIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);

        speechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);

        speechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
    }
}