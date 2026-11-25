#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$HOME/EVOLUTION-SBN-2027"
manifest=app/src/main/AndroidManifest.xml
if [ ! -s app/src/main/res/drawable-nodpi/logo_pareja.jpg ]; then echo 'Falta logo_pareja.jpg: no se cambiara el icono.'; exit 1; fi
# Keep existing photo as application launcher icon, but use a separate startup theme.
sed -i 's|@android:style/Theme.Material.NoActionBar|@style/ArenaTheme|g' "$manifest"
if ! grep -q 'android:icon=' "$manifest"; then sed -i 's|<application |<application android:icon="@drawable/logo_pareja" |' "$manifest"; fi
sed -i -E 's|android:icon="[^"]*"|android:icon="@drawable/logo_pareja"|' "$manifest"
sed -i -E "s/versionCode [0-9]+/versionCode 3/;s/versionName '[^']*'/versionName '1.2'/" app/build.gradle
echo 'Actualizacion aplicada. Revisa git status --short antes de subir.'
