import { CapacitorConfig } from '@capacitor/cli'

const config = {
  appId: 'com.inconnuboytech.purgehub',
  appName: 'Purge hub',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
}

export default config
