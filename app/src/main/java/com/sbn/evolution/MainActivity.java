package com.sbn.evolution;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.graphics.Color;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.*;
import android.content.res.ColorStateList;

public class MainActivity extends Activity {

    private boolean ready = false;
    private int progress = 0;

    @Override
    public void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().getDecorView()
            .setSystemUiVisibility(5894);

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF07121F);

        WebView web = new WebView(this);
        web.setBackgroundColor(0xFF07121F);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        root.addView(web);

        LinearLayout splash = new LinearLayout(this);
        splash.setOrientation(LinearLayout.VERTICAL);
        splash.setGravity(Gravity.CENTER);
        splash.setBackgroundColor(0xFF07121F);

        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.logo_pareja);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        splash.addView(logo,
            new LinearLayout.LayoutParams(dp(130),dp(130)));

        TextView title = new TextView(this);
        title.setText("EVOLUTION");
        title.setTextColor(Color.WHITE);
        title.setTextSize(30);
        title.setTypeface(null,Typeface.BOLD_ITALIC);
        splash.addView(title);

        TextView sub = new TextView(this);
        sub.setText("SBN 2027");
        sub.setTextColor(0xFF83FF20);
        sub.setTextSize(24);
        sub.setTypeface(null,Typeface.BOLD);
        splash.addView(sub);

        ProgressBar bar = new ProgressBar(this,null,
            android.R.attr.progressBarStyleHorizontal);
        bar.setMax(100);
        bar.setProgressTintList(
            ColorStateList.valueOf(0xFF00D9FF));
        splash.addView(bar,
            new LinearLayout.LayoutParams(dp(240),dp(14)));

        TextView loading = new TextView(this);
        loading.setTextColor(Color.WHITE);
        loading.setTextSize(12);
        loading.setText("CARGANDO...");
        splash.addView(loading);

        root.addView(splash,
            new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);

        web.setWebViewClient(new WebViewClient(){
            @Override
            public void onPageFinished(WebView v,String url){
                ready = true;
            }
        });

        web.loadUrl("file:///android_asset/index.html");

        Handler handler = new Handler(Looper.getMainLooper());

        handler.postDelayed(new Runnable(){
            public void run(){
                if(isFinishing() || isDestroyed()) return;

                if(progress < 90 || ready){
                    progress = Math.min(100,progress+2);
                }

                bar.setProgress(progress);
                loading.setText("CARGANDO... "+progress+"%");

                if(progress >= 100){
                    splash.animate().alpha(0f)
                        .setDuration(700)
                        .withEndAction(() ->
                            splash.setVisibility(View.GONE))
                        .start();
                }else{
                    handler.postDelayed(this,70);
                }
            }
        },100);
    }

    private int dp(int v){
        return (int)(v *
            getResources().getDisplayMetrics().density);
    }
}
