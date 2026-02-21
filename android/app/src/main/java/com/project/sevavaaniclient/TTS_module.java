package com.project.sevavaaniclient;

import android.annotation.SuppressLint;
import android.speech.tts.TextToSpeech;
import android.os.Bundle;
import java.util.Locale;
// import android.provider.Settings;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class TTS_module extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private TextToSpeech textToSpeech;

    TTS_module(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        initializeTextToSpeech();
    }

    @NonNull
    @Override
    public String getName() {
        return "TTS_module";
    }

    // @ReactMethod
    // public void getMsg(String textToSpeak, Promise promise){
    // try{
    // if (promise != null) {
    // promise.resolve("Speaking: " + textToSpeak);
    // }
    // if (textToSpeech != null && textToSpeak != null) {
    // textToSpeech.speak(textToSpeak, TextToSpeech.QUEUE_FLUSH, null);
    // }
    // } catch(Exception e){
    // if (promise != null) {
    // promise.reject(e);
    // }
    // }
    // }

    @ReactMethod
    public void getMsg(String textToSpeak, Promise promise) {

        if (textToSpeech == null) {
            promise.reject("TTS_ERROR", "TTS not initialized");
            return;
        }

        String utteranceId = String.valueOf(System.currentTimeMillis());

        textToSpeech.setOnUtteranceProgressListener(new android.speech.tts.UtteranceProgressListener() {

            @Override
            public void onStart(String utteranceId) {
            }

            @Override
            public void onDone(String utteranceId) {
                promise.resolve("done");
            }

            @Override
            public void onError(String utteranceId) {
                promise.reject("TTS_ERROR", "Speech failed");
            }
        });

        Bundle params = new Bundle();
        params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, utteranceId);

        textToSpeech.speak(textToSpeak,
                TextToSpeech.QUEUE_FLUSH,
                params,
                utteranceId);
    }

    @ReactMethod
    public void stopSpeech(Promise promise) {
        try {
            if (textToSpeech != null) {
                textToSpeech.stop();
                promise.resolve("stopped");
            } else {
                promise.reject("TTS_ERROR", "TTS not initialized");
            }
        } catch (Exception e) {
            promise.reject("TTS_ERROR", e);
        }
    }

    @ReactMethod
    public void shutdown() {
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
            textToSpeech = null;
        }
    }

    // @ReactMethod
    // public void getPhoneID(Promise response) {
    // try {
    // @SuppressLint("HardwareIds") String id =
    // Settings.Secure.getString(reactContext.getContentResolver(),
    // Settings.Secure.ANDROID_ID);
    // response.resolve(id);
    // } catch (Exception e) {
    // response.reject("Error", e);
    // }
    // }

    private void initializeTextToSpeech() {
        textToSpeech = new TextToSpeech(reactContext, new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                // if No error is found then only it will run
                if (status != TextToSpeech.ERROR) {
                    // To Choose language of speech
                    textToSpeech.setLanguage(Locale.UK);
                }
            }
        });
    }
}