package com.project.sevavaaniclient;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.content.pm.PackageManager;
import android.telephony.SmsManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Locale;

public class OTPRequester extends ReactContextBaseJavaModule  {
    private static final String OTPServerNumber = "+919272052540";

    private static ReactApplicationContext reactContext;

    public OTPRequester(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "OTPRequester";
    }

    @ReactMethod
    public void requestOTP(String uid,String role, Promise promise) {
        try {
            SmsManager smsManager = SmsManager.getDefault();
            String msg = "VERIFICATION REQUEST " + uid + " " + role;
            smsManager.sendTextMessage(OTPServerNumber, null, msg, null, null);
            promise.resolve("success");
        } catch (Exception e) {
            promise.reject("error", e);
        }
    }
}
