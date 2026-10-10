import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Nazaverse',
                short_name: 'Nazaverse',
                description: 'Aplikasi pendamping AI bertema galaxy dengan pet interaktif.',
                theme_color: '#05070d',
                background_color: '#05070d',
                display: 'standalone',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});
//# sourceMappingURL=vite.config.js.map