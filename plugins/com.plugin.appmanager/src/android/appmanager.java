package com.plugin.appmanager;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;


/**
 * This class echoes a string called from JavaScript.
 */
public class appmanager extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("StartApp")) {
            String message = args.getString(0);
            this.StartApp(message, callbackContext);
            return true;
        }
        return false;
    }

    private void StartApp(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
          cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
              Intent mIntent = new Intent();
              mIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
              if(message.contains("wallet")) {
                mIntent.setData(Uri.parse("wallet://wallet?action=20&url=" + message));
              }else {
                mIntent.setData(Uri.parse("elastos://elastos?action=21&url=" + message));
              }
              mIntent.setPackage("org.elastos.desktop");
              cordova.getActivity().startActivity(mIntent);
            }
          });
			callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
}
