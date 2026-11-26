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
    private boolean suppressGameLongPress;
    private MediaPlayer musicPlayer, bossPlayer;
    private boolean foreground, wantsAudio, bossAudio;
    private float musicVolume=.65f;
    private String playingAsset="", requestedAsset="music.mp3";
    private boolean musicPrepared;
    private void updateAudio(){
        if(!foreground || !wantsAudio || closed){if(musicPlayer!=null && musicPrepared && musicPlayer.isPlaying())musicPlayer.pause();return;}
        String asset=requestedAsset;
        try {
            if(musicPlayer==null || !asset.equals(playingAsset)){
                releaseAudio();
                final MediaPlayer player=new MediaPlayer();musicPlayer=player;musicPrepared=false;playingAsset=asset;
                player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_GAME).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());
                try(AssetFileDescriptor fd=getAssets().openFd(asset)){player.setDataSource(fd.getFileDescriptor(),fd.getStartOffset(),fd.getLength());}
                player.setOnPreparedListener(p->{if(musicPlayer!=p||closed)return;musicPrepared=true;p.setLooping(true);p.setVolume(musicVolume,musicVolume);if(foreground&&wantsAudio)p.start();});
                player.setOnErrorListener((p,w,e)->{if(musicPlayer==p)releaseAudio();return true;});
                player.prepareAsync();return;
            }
            if(musicPrepared&&!musicPlayer.isPlaying())musicPlayer.start();
        } catch(Exception e){android.util.Log.e("EvolutionAudio","Audio failed",e);releaseAudio();}
    }
    private void releaseAudio(){musicPrepared=false;if(musicPlayer!=null){musicPlayer.release();musicPlayer=null;}playingAsset="";}
    private static boolean validBoss(String type){return type!=null && type.matches("gold|fire|ice|venom|shadow|electric|ancient|apocalypse|leviathan|hydra|cosmic|thanatos");}
    private void releaseBoss(){if(bossPlayer!=null){bossPlayer.release();bossPlayer=null;}}
    private void playBoss(String type,float volume){
        if(!foreground||closed||!validBoss(type)||volume<=0)return;
        releaseBoss();
        try {
            final MediaPlayer player=new MediaPlayer();bossPlayer=player;
            player.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_GAME).setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
            try(AssetFileDescriptor fd=getAssets().openFd("boss-audio/"+type+"-roar.mp3")){player.setDataSource(fd.getFileDescriptor(),fd.getStartOffset(),fd.getLength());}
            float v=Math.max(0f,Math.min(1f,volume));player.setVolume(v,v);
            player.setOnCompletionListener(p->{if(bossPlayer==p)releaseBoss();});
            player.setOnErrorListener((p,w,e)->{if(bossPlayer==p)releaseBoss();return true;});
            player.setOnPreparedListener(p->{if(bossPlayer==p&&foreground&&!closed)p.start();});player.prepareAsync();
        } catch(Exception e){android.util.Log.e("EvolutionAudio","Boss sound failed",e);releaseBoss();}
    }
    private volatile boolean voiceRecording=false;
    private volatile android.media.AudioRecord voiceRecorder;
    private volatile int voiceGeneration=0;
    private void voiceStatus(String msg){if(web!=null&&!closed)web.evaluateJavascript("window.Voice52?.status("+org.json.JSONObject.quote(msg)+")",null);}
    private void stopVoice(){voiceRecording=false;voiceGeneration++;android.media.AudioRecord r=voiceRecorder;if(r!=null)try{r.stop();}catch(Exception ignored){} }
    private void startVoice(){if(!foreground||closed){voiceStatus("Micrófono no disponible");return;}if(voiceRecording)return;
        if(checkSelfPermission(android.Manifest.permission.RECORD_AUDIO)!=android.content.pm.PackageManager.PERMISSION_GRANTED){requestPermissions(new String[]{android.Manifest.permission.RECORD_AUDIO},52);voiceStatus("Autoriza el micrófono y vuelve a pulsar");return;}
        voiceRecording=true;final int generation=++voiceGeneration;
        new Thread(()->{android.media.AudioRecord r=null;android.media.audiofx.AcousticEchoCanceler echo=null;try{
            int min=android.media.AudioRecord.getMinBufferSize(8000,android.media.AudioFormat.CHANNEL_IN_MONO,android.media.AudioFormat.ENCODING_PCM_16BIT);
            r=new android.media.AudioRecord(android.media.MediaRecorder.AudioSource.VOICE_COMMUNICATION,8000,android.media.AudioFormat.CHANNEL_IN_MONO,android.media.AudioFormat.ENCODING_PCM_16BIT,Math.max(3200,min));
            if(r.getState()!=android.media.AudioRecord.STATE_INITIALIZED)throw new IllegalStateException();
            if(android.media.audiofx.AcousticEchoCanceler.isAvailable()){echo=android.media.audiofx.AcousticEchoCanceler.create(r.getAudioSessionId());if(echo!=null)echo.setEnabled(true);}
            if(!voiceRecording||generation!=voiceGeneration)return;voiceRecorder=r;r.startRecording();handler.post(()->{if(voiceRecording&&generation==voiceGeneration&&foreground&&web!=null)web.evaluateJavascript("window.Voice52?.ready()",null);});short[] samples=new short[400];byte[] pcm=new byte[400];int pos=0;
            while(voiceRecording&&generation==voiceGeneration){int n=r.read(samples,pos,400-pos);if(n<=0){handler.post(()->{if(generation==voiceGeneration)voiceStatus("Micrófono interrumpido");});break;}pos+=n;if(pos<400)continue;pos=0;for(int i=0;i<400;i++)pcm[i]=(byte)((samples[i]>>8)+128);String b64=android.util.Base64.encodeToString(pcm,android.util.Base64.NO_WRAP);handler.post(()->{if(voiceRecording&&generation==voiceGeneration&&foreground&&web!=null)web.evaluateJavascript("window.Voice52?.frame('"+b64+"')",null);});}
        }catch(Exception e){handler.post(()->{if(generation==voiceGeneration)voiceStatus("Micrófono no disponible");});}finally{if(echo!=null)echo.release();if(r!=null){try{r.stop();}catch(Exception ignored){}r.release();}if(voiceRecorder==r)voiceRecorder=null;if(generation==voiceGeneration)voiceRecording=false;}},"EvolutionVoice").start();
    }
    public class GameBridge {
        @JavascriptInterface public void gameLongPressBlocked(boolean blocked){handler.post(()->suppressGameLongPress=blocked);}
        @JavascriptInterface public void voice52(boolean on){handler.post(()->{if(on)startVoice();else stopVoice();});}

        @JavascriptInterface public void shareRoom(String code){if(code==null||!code.matches("[A-Z0-9]{4,12}"))return;handler.post(()->{android.content.Intent send=new android.content.Intent(android.content.Intent.ACTION_SEND);send.setType("text/plain");send.putExtra(android.content.Intent.EXTRA_TEXT,"EVOLUTION SBN 2027 · Sala "+code);startActivity(android.content.Intent.createChooser(send,"Compartir sala"));});}
        @JavascriptInterface public void bossSound(String type,float volume){handler.post(()->playBoss(type,volume));}
        @JavascriptInterface public void stopBossSound(){handler.post(()->releaseBoss());}
        @JavascriptInterface public void bossVolume(float value){handler.post(()->{if(bossPlayer!=null){float v=Math.max(0f,Math.min(1f,value));bossPlayer.setVolume(v,v);}});}

        @JavascriptInterface public void volume(float value){handler.post(()->{musicVolume=Math.max(0f,Math.min(1f,value));if(musicPlayer!=null&&musicPrepared)musicPlayer.setVolume(musicVolume,musicVolume);});}
        @JavascriptInterface public void audio(boolean enabled,boolean boss){handler.post(()->{wantsAudio=enabled;bossAudio=boss;requestedAsset=boss?"suspense.mp3":"music.mp3";updateAudio();});}
        @JavascriptInterface public void soundtrack(boolean enabled,String stage){handler.post(()->{wantsAudio=enabled;requestedAsset="boss".equals(stage)?"suspense.mp3":"intro".equals(stage)?"intro.mp3":"menu".equals(stage)?"menu.mp3":"music.mp3";if(stage!=null && stage.matches("arena:(neon|jungle|lava|ice|desert|swamp|ocean|temple|alien|haunted|city|jurassic)")) requestedAsset="arena-"+stage.substring(6)+".mp3";if(stage!=null&&stage.startsWith("boss:")&&validBoss(stage.substring(5)))requestedAsset="boss-audio/"+stage.substring(5)+"-theme.mp3";if(!enabled)releaseBoss();updateAudio();});}
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
        // Request a 60 Hz or higher mode without changing the display resolution.
        try {
            android.view.Display display=getWindowManager().getDefaultDisplay();
            android.view.Display.Mode current=display.getMode(),best=null;
            for(android.view.Display.Mode mode:display.getSupportedModes()){
                if(mode.getPhysicalWidth()!=current.getPhysicalWidth()||mode.getPhysicalHeight()!=current.getPhysicalHeight()||mode.getRefreshRate()<59.5f)continue;
                if(best==null||Math.abs(mode.getRefreshRate()-60f)<Math.abs(best.getRefreshRate()-60f))best=mode;
            }
            if(best!=null){android.view.WindowManager.LayoutParams lp=getWindow().getAttributes();lp.preferredDisplayModeId=best.getModeId();getWindow().setAttributes(lp);}
        }catch(Exception ignored){}
        getWindow().setFlags(android.view.WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,android.view.WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
        getWindow().getDecorView().setSystemUiVisibility(5894);
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF07121F);
        web = new WebView(this);
        web.setBackgroundColor(0xFF07121F);
        web.setOnLongClickListener(v -> {
            if(!suppressGameLongPress)return false;
            WebView.HitTestResult hit=web.getHitTestResult();
            return hit==null||hit.getType()!=WebView.HitTestResult.EDIT_TEXT_TYPE;
        });
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
        logo.setImageResource(R.drawable.logo_pareja);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        GradientDrawable portraitFrame = new GradientDrawable();
        portraitFrame.setColor(0xFF10211B);
        portraitFrame.setCornerRadius(dp(18));
        portraitFrame.setStroke(dp(2),0xFFDFBD74);
        logo.setBackground(portraitFrame);
        logo.setPadding(dp(2),dp(2),dp(2),dp(2));
        logo.setClipToOutline(true);
        LinearLayout.LayoutParams portraitParams = new LinearLayout.LayoutParams(dp(96),dp(96));
        portraitParams.bottomMargin=dp(5);
        content.addView(logo,portraitParams);
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
    @Override public void onBackPressed(){
        if(web==null||closed||!ready)return;
        web.evaluateJavascript("typeof window.handleAndroidBack87==='function' && window.handleAndroidBack87()", result -> {
            if("false".equals(result)&&!closed&&!isFinishing()){
                new android.app.AlertDialog.Builder(this)
                    .setTitle("Salir del juego")
                    .setMessage("¿Quieres cerrar EVOLUTION SBN 2027?")
                    .setNegativeButton("Regresar",null)
                    .setPositiveButton("Salir",(dialog,which)->finish()).show();
            }
        });
    }
    @Override protected void onPause(){super.onPause();foreground=false;stopVoice();if(web!=null)web.evaluateJavascript("window.Voice52?.off()",null);releaseBoss();updateAudio();if(web!=null)web.onPause();}
    @Override protected void onResume(){super.onResume();foreground=true;updateAudio();if(web!=null){web.onResume();web.evaluateJavascript("if(typeof music==='function')music()",null);}}
    @Override protected void onDestroy(){closed=true;stopVoice();releaseBoss();releaseAudio();handler.removeCallbacksAndMessages(null);if(web!=null){web.stopLoading();((android.view.ViewGroup)web.getParent()).removeView(web);web.destroy();}super.onDestroy();}
}
