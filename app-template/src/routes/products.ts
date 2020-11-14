import { generateId } from '../utils/id-helper';
import { NextFunction, Request, Response, Router } from 'express';
import { Product } from '../models/product';
import productsData from '../assets/products.json';

const router = Router();

let products: Product[] = productsData;

function initializeProducts(): void {
  products = [
    {
      id: generateId(),
      categoryId: '100',
      name: 'Monitor',
      itemsInStock: 4,
    },
    {
      id: generateId(),
      categoryId: '101',
      name: 'Mouse',
      itemsInStock: 7,
    },
    {
      id: generateId(),
      categoryId: '102',
      name: 'Keypboard',
      itemsInStock: 2,
    },
    {
      id: generateId(),
      categoryId: '103',
      name: 'Printer',
      itemsInStock: 0,
    },
  ];
}

function validateUuid(uuid: string): boolean {
  return uuid.length == 36;
}

function validateProductName(productName: string): boolean {
  return productName.length > 3;
}

const resolveProductHandler = (req: Request, res: Response, next: NextFunction): void => {
  const productId = req.params.id;
  if (validateUuid(productId)) {
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

router.post('/', (req, res) => {
  const product = req.body as Product;
  if (validateProductName(product.name)) {
    res.sendStatus(409);
    return;
  }
  product.id = generateId();
  products.push(product);

  res.status(201).send(product);
});

router.get('/:id', resolveProductHandler, (req, res) => {
  res.send(res.locals.product);
});

router.put('/:id', resolveProductHandler, (req, res) => {
  const product = req.body as Product;
  if (validateUuid(product.id)) {
    res.sendStatus(400);
    return;
  }
  if (validateProductName(product.name)) {
    res.sendStatus(409);
    return;
  }
  product.id = res.locals.product.id;
  Object.assign(res.locals.product, product);

  res.send(res.locals.product);
});

router.delete('/:id', resolveProductHandler, (req, res) => {
  products.splice(res.locals.productIndex, 1);

  res.sendStatus(204);
});

export { router, initializeProducts };
