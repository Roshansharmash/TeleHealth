
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1854caba4a384184bd2ac69c5ad52018',
  appName: 'telehealth-connect-now',
  webDir: 'dist',
  server: {
    url: 'https://1854caba-4a38-4184-bd2a-c69c5ad52018.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#121212'
  }
};

export default config;
