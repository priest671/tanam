import * as admin from 'firebase-admin';
import * as express from 'express';
import * as handlers from './handlers';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export * from './cache';
export const app = express();
export function initializeApp(tanamConfig: TanamConfig = {}) {
  const appConfig = { ...tanamDefaultAppConfig, ...(tanamConfig || {}) };

  app.use(`/${appConfig.adminUrl}/`, express.static('./admin_client'));
  app.use(`/${appConfig.adminUrl}/**`, (req: express.Request, res: express.Response) => {
    res.status(200).sendFile('index.html', { root: './admin_client' });
  });

  app.get('/manifest.json', handlers.handleWebManifestReq);
  app.get('**', handlers.handleRequest);
}

export interface TanamConfig {
  adminUrl?: string;
}

const tanamDefaultAppConfig: TanamConfig = {
  adminUrl: 'admin'
};