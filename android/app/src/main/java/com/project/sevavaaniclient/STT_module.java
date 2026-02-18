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

import com.facebook.react.bridge.*;

import java.util.ArrayList;
import java.util.Locale;

public class STT_module extends ReactContextBaseJavaModule implements RecognitionListener {

    private final ReactApplicationContext reactContext;
    private SpeechRecognizer speechRecognizer;
    private Intent speechIntent;
    private Promise sttPromise;

    public STT_module(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "STT_module";
    }

    // ================================
    // INIT (Create once)
    // ================================
    @ReactMethod
    public void initRecognizer(Promise promise) {

        reactContext.runOnUiQueueThread(() -> {

            if (!SpeechRecognizer.isRecognitionAvailable(reactContext)) {
                promise.reject("NOT_AVAILABLE", "Speech recognition not available");
                return;
            }

            if (speechRecognizer != null) {
                promise.resolve("Already initialized");
                return;
            }

            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(reactContext);
            speechRecognizer.setRecognitionListener(this);

            speechIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            speechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                    RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            speechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE,
                    Locale.getDefault());
            speechIntent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
            speechIntent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

            // speechIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 6000);
            // speechIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 6000);
            // speechIntent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 2000);

            promise.resolve("Initialized");
        });
    }

    // ================================
    // START LISTENING
    // ================================
    @ReactMethod
    public void startListening(Promise promise) {

        if (speechRecognizer == null) {
            promise.reject("NOT_INITIALIZED", "Call initRecognizer first");
            return;
        }

        if (sttPromise != null) {
            promise.reject("BUSY", "Already listening");
            return;
        }

        if (!hasPermission()) {
            requestPermission();
            promise.reject("PERMISSION_DENIED", "Microphone permission required");
            return;
        }

        sttPromise = promise;

        reactContext.runOnUiQueueThread(() -> {
            speechRecognizer.startListening(speechIntent);
        });
    }

    // ================================
    // STOP LISTENING (No destroy)
    // ================================
    @ReactMethod
    public void stopListening() {
        reactContext.runOnUiQueueThread(() -> {
            if (speechRecognizer != null) {
                speechRecognizer.stopListening();
            }
        });
    }

    // ================================
    // DESTROY (Call when leaving screen)
    // ================================
    @ReactMethod
    public void destroyRecognizer() {

        reactContext.runOnUiQueueThread(() -> {
            if (speechRecognizer != null) {
                speechRecognizer.destroy();
                speechRecognizer = null;
            }
        });

        sttPromise = null;
    }

    // ================================
    // CALLBACKS
    // ================================

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
    public void onPartialResults(Bundle partialResults) {
    }

    @Override
    public void onEvent(int eventType, Bundle params) {
    }

    @Override
    public void onResults(Bundle results) {

        ArrayList<String> list = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);

        if (sttPromise != null) {
            if (list != null && !list.isEmpty()) {
                sttPromise.resolve(list.get(0));
            } else {
                sttPromise.resolve("");
            }
            sttPromise = null;
        }
    }

    @Override
    public void onError(int errorCode) {

        if (sttPromise != null) {

            if (errorCode == SpeechRecognizer.ERROR_NO_MATCH ||
                    errorCode == SpeechRecognizer.ERROR_SPEECH_TIMEOUT) {

                sttPromise.resolve("");

            } else {
                sttPromise.reject("STT_ERROR", "Error code: " + errorCode);
            }

            sttPromise = null;
        }
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
}