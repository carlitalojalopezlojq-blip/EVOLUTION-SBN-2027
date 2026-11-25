package com.sbn.evolution;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.widget.*;

public class MainActivity extends Activity {
    private final Handler handler = new Handler(Looper.getMainLooper());
    private WebView web;
    private FrameLayout splash;
    private ProgressBar bar;
    private TextView loading;
    private boolean ready, closed;
    private int pageProgress;
    private long started;
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().getDecorView().setSystemUiVisibility(5894);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF07121F);
        web = new WebView(this);
        web.setBackgroundColor(0xFF07121F);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        splash = new FrameLayout(this);
        splash.setBackground(new GradientDrawable(GradientDrawable.Orientation.TL_BR,new int[]{0xFF07121F,0xFF123B3B,0xFF07121F}));
        LinearLayout content = new LinearLayout(this);
        content.setGravity(Gravity.CENTER);
        content.setOrientation(LinearLayout.VERTICAL);
        int width = Math.min(dp(340),getResources().getDisplayMetrics().widthPixels-dp(32));
        FrameLayout.LayoutParams cp = new FrameLayout.LayoutParams(width,-2,Gravity.CENTER);
        splash.addView(content,cp);
        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.arena_emblem);
        content.addView(logo,new LinearLayout.LayoutParams(dp(92),dp(92)));
        TextView title = text("EVOLUTION",30,Color.WHITE);
        title.setTypeface(Typeface.DEFAULT,Typeface.BOLD_ITALIC);
        content.addView(title,new LinearLayout.LayoutParams(-1,-2));
        TextView sub = text("SBN 2027",23,0xFF83FF20);
        sub.setTypeface(Typeface.DEFAULT,Typeface.BOLD);
        content.addView(sub,new LinearLayout.LayoutParams(-1,-2));
        bar = new ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal);
        bar.setMax(100); bar.setProgressTintList(ColorStateList.valueOf(0xFF43FFD1));
        LinearLayout.LayoutParams bp=new LinearLayout.LayoutParams(-1,dp(12));bp.topMargin=dp(12);content.addView(bar,bp);
        loading=text("PREPARANDO ARENA…",12,0xFFCDEAE8);
        content.addView(loading,new LinearLayout.LayoutParams(-1,-2));
        root.addView(splash,new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        web.setWebChromeClient(new WebChromeClient(){@Override public void onProgressChanged(WebView v,int p){pageProgress=p;}});
        web.setWebViewClient(new WebViewClient(){@Override public void onPageFinished(WebView v,String url){ready=true;}});
        started=SystemClock.uptimeMillis();
        web.loadUrl("file:///android_asset/index.html");
        handler.post(tick);
    }
    private final Runnable tick = new Runnable(){@Override public void run(){
        if(closed||isFinishing()||isDestroyed())return;
        long elapsed=SystemClock.uptimeMillis()-started;
        int p=(int)Math.min(ready?100:Math.min(95,pageProgress),elapsed/18);
        bar.setProgress(p);loading.setText("CARGANDO ARENA · "+p+"%");
        if(ready&&elapsed>=1800){bar.setProgress(100);splash.animate().alpha(0f).setDuration(300).withEndAction(()->splash.setVisibility(View.GONE)).start();}
        else if(elapsed>15000){loading.setText("No terminó la carga. Toca aquí para reintentar.");loading.setOnClickListener(v->{loading.setOnClickListener(null);ready=false;pageProgress=0;started=SystemClock.uptimeMillis();web.reload();handler.post(this);});}
        else handler.postDelayed(this,50);
    }};
    private TextView text(String s,int size,int color){TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(color);t.setGravity(Gravity.CENTER);return t;}
    private int dp(int v){return Math.round(v*getResources().getDisplayMetrics().density);}
    @Override protected void onPause(){super.onPause();if(web!=null){web.evaluateJavascript("document.getElementById('track')?.pause()",null);web.onPause();}}
    @Override protected void onResume(){super.onResume();if(web!=null)web.onResume();}
    @Override protected void onDestroy(){closed=true;handler.removeCallbacksAndMessages(null);if(web!=null){web.stopLoading();((android.view.ViewGroup)web.getParent()).removeView(web);web.destroy();}super.onDestroy();}
}
