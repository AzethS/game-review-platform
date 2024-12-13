import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'npx nx run game-review-recommendation-platform:serve',
        production:
          'npx nx run game-review-recommendation-platform:serve-static',
      },
      ciWebServerCommand:
        'npx nx run game-review-recommendation-platform:serve-static',
      ciBaseUrl: 'http://localhost:4200',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
