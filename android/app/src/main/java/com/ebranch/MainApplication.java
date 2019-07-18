package com.ebranch;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
import com.wheelpicker.WheelPickerPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.zyu.ReactNativeWheelPickerPackage;




import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.marianhello.bgloc.react.BackgroundGeolocationPackage;
import com.opensettings.OpenSettingsPackage;
import com.airbnb.android.react.maps.MapsPackage;
import java.util.Arrays;
import java.util.List;
import com.facebook.react.BuildConfig;


public class MainApplication extends NavigationApplication {
    
    @Override
    protected ReactGateway createReactGateway() {
        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };
        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
            // eg. new VectorIconsPackage()
              new RNGestureHandlerPackage(),
            new VectorIconsPackage(),
            new FastImageViewPackage(),
            new RNI18nPackage(),
            new SnackbarPackage(),
            new LinearGradientPackage(),
            new ReanimatedPackage(),
            new WheelPickerPackage(),
            new ExtraDimensionsPackage(),
              new MapsPackage(),
        new OpenSettingsPackage(),
        new BackgroundGeolocationPackage(),
          
            new ReactNativeWheelPickerPackage()
        );
    }
  
    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

}