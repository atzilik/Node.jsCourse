import { generateId } from '../utils/id-helper';
import { NextFunction, Request, Response, Router } from 'express';
import { Category } from '../models/category';
import categoriesData from '../assets/categories.json';
import { Product } from '../models/product';
import productsData from '../assets/products.json';
import * as validations from '../utils/common';

const router = Router();

const categories: Category[] = categoriesData;
const products: Product[] = productsData;

const resolveCategoryHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  if (!validations.isValidUuid(categoryId)) {
    res.sendStatus(400);
    return;
  }
  const categoryIndex = categories.findIndex((u) => u.id === categoryId);
  if (categoryIndex < 0) {
    res.sendStatus(404);
    return;
  }
  res.locals.categoryIndex = categoryIndex;
  res.locals.category = categories[categoryIndex];
  next();
};

const resolveGetProductsByCategoryIdHandler = (req: Request, res: Response, next: NextFunction): void => {
  const categoryId = req.params.id;
  if (!validations.isValidUuid(categoryId)) {
    res.sendStatus(400);
    return;
  }
  const categoryIndex = products.findIndex((p) => p.categoryId === categoryId);
  if (categoryIndex < 0) {
    res.sendStatus(404);
    return;
  }

  res.locals.categoryIndex = categoryIndex;
  res.locals.products = products.filter((p) => p.categoryId == categoryId);
  next();
};

router.get('/', (req, res) => res.send(categories));

router.post('/', (req, res) => {
  const category = req.body as Category;
  if (!validations.isValidName(category.name)) {
    res.sendStatus(409);
    return;
  }
  category.id = generateId();
  categories.push(category);

  res.status(201).send(category);
});

router.get('/:id', resolveCategoryHandler, (req, res) => {
  res.send(res.locals.category);
});

router.get('/:id/products', resolveGetProductsByCategoryIdHandler, (req, res) => {
  res.send(res.locals.products);
});

router.put('/:id', resolveCategoryHandler, (req, res) => {
  const category = req.body as Category;
  category.id = res.locals.category.id;

  if (!validations.isValidUuid(category.id)) {
    res.sendStatus(400);
    return;
  }
  if (!validations.isValidName(category.name)) {
    res.sendStatus(409);
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
