import express from 'express';
import cors from 'cors';
import { traceLogger, errorLogger } from './middleware/log';

import { router as productsRouter } from './routes/products';
import { router as categoriesRouter } from './routes/categories';
import * as errorHandlers from './middleware/errorHandlers';
import { getConfigValue } from './utils/config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(traceLogger());

app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);

app.use(errorLogger());

app.use(errorHandlers.IdErrorHandler);
app.use(errorHandlers.NameErrorHandler);
app.use(errorHandlers.NotFoundErrorHandler);

app.set('port', getConfigValue('APP_PORT') || 8000);

app.listen(app.get('port'), () => {
  console.log(' App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log(' Press CTRL-C to stop\n');
});
