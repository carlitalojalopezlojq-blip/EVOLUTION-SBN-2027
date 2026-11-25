package com.sbn.evolution;
import android.app.Activity;
import android.media.MediaPlayer;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.os.Vibrator;
import android.os.VibrationEffect;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
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
    private MediaPlayer musicPlayer;
    private boolean foreground, wantsAudio, bossAudio;
    private float musicVolume=.65f;
    private String playingAsset="";
    private void updateAudio(){
        if(!foreground || !wantsAudio || closed){if(musicPlayer!=null && musicPlayer.isPlaying())musicPlayer.pause();return;}
        String asset=bossAudio?"suspense.mp3":"music.mp3";
        try {
            if(musicPlayer==null || !asset.equals(playingAsset)){
                releaseAudio();
                musicPlayer=new MediaPlayer();
                musicPlayer.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_GAME).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());
                try(AssetFileDescriptor fd=getAssets().openFd(asset)){musicPlayer.setDataSource(fd.getFileDescriptor(),fd.getStartOffset(),fd.getLength());}
                musicPlayer.setLooping(true);musicPlayer.setVolume(musicVolume,musicVolume);musicPlayer.prepare();playingAsset=asset;
            }
            if(!musicPlayer.isPlaying())musicPlayer.start();
        } catch(Exception e){android.util.Log.e("EvolutionAudio","Audio failed",e);releaseAudio();}
    }
    private void releaseAudio(){if(musicPlayer!=null){musicPlayer.release();musicPlayer=null;}playingAsset="";}
    public class GameBridge {
        @JavascriptInterface public void volume(float value){handler.post(()->{musicVolume=Math.max(0f,Math.min(1f,value));if(musicPlayer!=null)musicPlayer.setVolume(musicVolume,musicVolume);});}
        @JavascriptInterface public void audio(boolean enabled,boolean boss){handler.post(()->{wantsAudio=enabled;bossAudio=boss;updateAudio();});}
        @JavascriptInterface public void alertKing(){handler.post(()->{if(!foreground||closed)return;Vibrator v=(Vibrator)getSystemService(Context.VIBRATOR_SERVICE);if(v!=null&&v.hasVibrator()){long[] pattern={0,220,100,220,100,450};if(android.os.Build.VERSION.SDK_INT>=26)v.vibrate(VibrationEffect.createWaveform(pattern,-1));else v.vibrate(pattern,-1);}});}
    }
    private FrameLayout splash;
    private ProgressBar bar;
    private TextView loading;
    private boolean ready, closed;
    private int pageProgress;
    private long started;
    @Override public void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().getDecorView().setSystemUiVisibility(5894);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF07121F);
        web = new WebView(this);
        web.setBackgroundColor(0xFF07121F);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.addJavascriptInterface(new GameBridge(),"EvolutionNative");
        root.addView(web,new FrameLayout.LayoutParams(-1,-1));
        splash = new FrameLayout(this);
        splash.setClickable(true);
        splash.setBackground(new GradientDrawable(GradientDrawable.Orientation.TL_BR,new int[]{0xFF07121F,0xFF123B3B,0xFF07121F}));
        LinearLayout content = new LinearLayout(this);
        content.setGravity(Gravity.CENTER);
        content.setOrientation(LinearLayout.VERTICAL);
        int width = Math.min(dp(340),getResources().getDisplayMetrics().widthPixels-dp(32));
        FrameLayout.LayoutParams cp = new FrameLayout.LayoutParams(width,-2,Gravity.CENTER);
        splash.addView(content,cp);
        ImageView logo = new ImageView(this);
        logo.setImageResource(R.drawable.arena_emblem);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        content.addView(logo,new LinearLayout.LayoutParams(dp(112),dp(112)));
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
        TextView tip=text("DOMINA LA ARENA  •  RESERVA TU TURBO PARA ESCAPAR DEL REY",10,0xFFE9C77A);
        content.addView(tip,new LinearLayout.LayoutParams(-1,-2));
        root.addView(splash,new FrameLayout.LayoutParams(-1,-1));
        setContentView(root);
        web.setWebChromeClient(new WebChromeClient(){@Override public void onProgressChanged(WebView v,int p){pageProgress=p;}});
        web.setWebViewClient(new WebViewClient(){@Override public void onPageFinished(WebView v,String url){ready=true;} @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){return !"file:///android_asset/index.html".equals(r.getUrl().toString());}});
        started=SystemClock.uptimeMillis();
        web.loadUrl("file:///android_asset/index.html");
        handler.post(tick);
    }
    private final Runnable tick = new Runnable(){@Override public void run(){
        if(closed||isFinishing()||isDestroyed())return;
        long elapsed=SystemClock.uptimeMillis()-started;
        int p=(int)Math.min(ready?100:Math.min(95,pageProgress),elapsed/50);
        bar.setProgress(p);loading.setText("CARGANDO ARENA · "+p+"%");
        if(ready){bar.setProgress(100);splash.animate().alpha(0f).setDuration(300).withEndAction(()->splash.setVisibility(View.GONE)).start();}
        else if(elapsed>15000){loading.setText("No terminó la carga. Toca aquí para reintentar.");loading.setOnClickListener(v->{loading.setOnClickListener(null);ready=false;pageProgress=0;started=SystemClock.uptimeMillis();web.reload();handler.post(this);});}
        else handler.postDelayed(this,50);
    }};
    private TextView text(String s,int size,int color){TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(color);t.setGravity(Gravity.CENTER);return t;}
    private int dp(int v){return Math.round(v*getResources().getDisplayMetrics().density);}
    @Override protected void onPause(){super.onPause();foreground=false;updateAudio();if(web!=null)web.onPause();}
    @Override protected void onResume(){super.onResume();foreground=true;updateAudio();if(web!=null){web.onResume();web.evaluateJavascript("if(typeof music==='function')music()",null);}}
    @Override protected void onDestroy(){closed=true;releaseAudio();handler.removeCallbacksAndMessages(null);if(web!=null){web.stopLoading();((android.view.ViewGroup)web.getParent()).removeView(web);web.destroy();}super.onDestroy();}
}
