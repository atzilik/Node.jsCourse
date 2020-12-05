import { generateId } from '../utils/id-helper';
import { NextFunction, Request, Response, Router } from 'express';
import { IProduct } from '../models/product';
import * as validations from '../helpers/validation';
import { getProducts } from '../helpers/store-products';
import { wrapAsyncAndSend } from '../utils/async';
import { createLogger } from '../utils/logger';
import { idSchema, newProductSchema } from '../validations/products';

const router = Router();
const products = getProducts();

const logger = createLogger('Products');

const resolveProductHandler = (req: Request, res: Response, next: NextFunction): void => {
  const { error, value: productId } = idSchema.validate(req.params.id);
  if (error) {
    next(new Error('Invalid ID'));
    return;
  }

  const prouctIndex = products.findIndex((u) => u.id === productId);
  if (prouctIndex < 0) {
    next(new Error('Product not found'));
    return;
  }

  res.locals.prouctIndex = prouctIndex;
  res.locals.product = products[prouctIndex];
  next();
};

const getProductById = (productId: string): Promise<IProduct> => {
  const product = products[Number(productId)];
  return Promise.resolve(product);
};

router.get('/', (req, res) => res.send(getProducts()));

router.get(
  '/:id',
  resolveProductHandler,
  (req, res, next) => {
    logger.info(`Requested product of id ${req.params.id}`);
    next();
  },
  wrapAsyncAndSend((req, res) => getProductById(res.locals.prouctIndex)),
);

router.post('/', async (req, res, next) => {
  try {
    const product = await newProductSchema.validateAsync(req.body);

    product.id = generateId();
    products.push(product);
    console.log(`Added new product successfully`);

    res.status(201).send(product);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', validations.validateNameHandler, resolveProductHandler, (req, res) => {
  const product = req.body as IProduct;
  product.id = res.locals.product.id;

  Object.assign(res.locals.product, product);
  console.log(`Updated successfully`);

  res.send(res.locals.product);
});

router.delete('/:id', resolveProductHandler, (req, res) => {
  products.splice(res.locals.productIndex, 1);
  console.log(`Deleted successfully`);
  res.sendStatus(204);
});

export { router };
