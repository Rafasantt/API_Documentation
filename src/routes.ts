import { Router } from 'express';
import {v4 as uuid} from 'uuid';
import {ensuredAuthenticated} from './middleware'

const router = Router()

interface Products {
  name: string,
  price: number,
  description: string
  id: string
}

const products: Products[] = [];

router.get('/', (request, response) =>{
  response.json(products)
})

router.get('/products/findByName', (request, response) =>{
  const {name} = request.query;
  const product = products.filter((p) => p.name.includes(String(name)));
  return response.json(product);
});

router.get('/products/:id', (requeste, response) =>{
  const {id} = requeste.params;
  const product = products.find((product) => product.id === id);
  return response.json(product);
})

router.post('/products', ensuredAuthenticated, (requeste, response) =>{
  const {name, description, price} = requeste.body;

  const productAlreadyExists = products.find((product) => product.name === name);

  if(productAlreadyExists) {
    return response.status(400).json({message: 'Product Already exists!'});
  }

  const product : Products = {
    description,
    name,
    price,
    id: uuid(),
  };

  products.push(product);

  return response.json(product);
})

router.put('/products/:id', ensuredAuthenticated, (requeste, response) =>{
  const {id} = requeste.params;
  const {name, description, price} = requeste.body;

  const productIndex = products.findIndex((product) => product.id === id);

  if(productIndex === -1) {
    return response.status(400).json({message: "Product doesn't exists!"});
  }

  const product: Products = Object.assign({
    id,
    name,
    description,
    price,
  });

  products[productIndex] = product;

  return response.json(product);
})

export {router}