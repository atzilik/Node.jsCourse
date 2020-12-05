import { IProduct } from '../models/product';
import productsData from '../assets/products.json';

export function getProducts(): IProduct[] {
  return productsData;
}

export function getProductsAsync(): Promise<IProduct[]> {
  return Promise.resolve(getProducts());
}
