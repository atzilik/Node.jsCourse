import { generateId } from '../utils/id-helper';
import { NextFunction, Request, Response, Router } from 'express';
import { Product } from '../models/product';
import productsData from '../assets/products.json';
import * as validations from '../utils/common';

const router = Router();

const products: Product[] = productsData;

const resolveProductHandler = (req: Request, res: Response, next: NextFunction): void => {
  const productId = req.params.id;
  if (!validations.isValidUuid(productId)) {
    res.sendStatus(400);
    return;
  }
  const prouctIndex = products.findIndex((u) => u.id === productId);
  if (prouctIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.prouctIndex = prouctIndex;
  res.locals.product = products[prouctIndex];
  next();
};

router.get('/', (req, res) => res.send(products));

router.get('/:id', resolveProductHandler, (req, res) => {
  res.send(res.locals.product);
});

router.post('/', validations.validateNameHandler, (req, res) => {
  const product = req.body as Product;
  product.id = generateId();
  products.push(product);
  console.log(`Added new product successfully`);

  res.status(201).send(product);
});

router.put('/:id', validations.validateNameHandler, resolveProductHandler, (req, res) => {
  const product = req.body as Product;
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
