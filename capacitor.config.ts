import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.seuprojeto.maeamiga',
  appName: 'Mãe Amiga',
  webDir: 'out',
  server: {
    url: 'https://maeamiga.seudominio.com',
    cleartext: true,
  },
}

export default config
