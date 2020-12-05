import { generateId } from '../utils/id-helper';
import { NextFunction, Request, Response, Router } from 'express';
import { ICategory } from '../models/category';
import categoriesData from '../assets/categories.json';
import { IProduct } from '../models/product';
import productsData from '../assets/products.json';
import * as validations from '../helpers/validation';

const router = Router();

const categories: ICategory[] = categoriesData;
const products: IProduct[] = productsData;

const resolveCategoryHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  if (!validations.isValidUuid(categoryId)) {
    next(new Error('Invalid ID'));
    return;
  }
  const categoryIndex = categories.findIndex((u) => u.id === categoryId);
  if (categoryIndex < 0) {
    next(new Error('Not found'));
    return;
  }
  res.locals.categoryIndex = categoryIndex;
  res.locals.category = categories[categoryIndex];
  next();
};

const resolveGetProductsByCategoryIdHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  if (!validations.isValidUuid(categoryId)) {
    next(new Error('Invalid ID'));
    return;
  }
  const categoryIndex = products.findIndex((p) => p.categoryId === categoryId);
  if (categoryIndex < 0) {
    next(new Error('Not found'));
    return;
  }

  res.locals.categoryIndex = categoryIndex;
  res.locals.products = products.filter((p) => p.categoryId == categoryId);
  next();
};

router.get('/', (req, res) => res.send(categories));

router.get('/:id', resolveCategoryHandler, (req, res) => {
  res.send(res.locals.category);
});

router.get('/:id/products', resolveGetProductsByCategoryIdHandler, (req, res) => {
  res.send(res.locals.products);
});

router.post('/', (req, res) => {
  const category = req.body as ICategory;

  category.id = generateId();
  categories.push(category);

  res.status(201).send(category);
});

router.put('/:id', resolveCategoryHandler, (req, res, next) => {
  const category = req.body as ICategory;
  category.id = res.locals.category.id;

  if (!validations.isValidUuid(category.id)) {
    next('Invalid ID');
    return;
  }

  Object.assign(res.locals.category, category);
  console.log(`Added new category successfully`);

  res.send(res.locals.category);
});

router.delete('/:id', resolveCategoryHandler, (req, res) => {
  categories.splice(res.locals.categoryIndex, 1);

  console.log(`Category deleted successfully`);
  res.sendStatus(204);
});

export { router };
