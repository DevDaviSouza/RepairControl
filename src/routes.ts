import { Express } from 'express';
import PriorityController from './controller/PriorityController'
import CustomersController from './controller/CustomersController'
import EnterPrisesController from './controller/EnterprisesController'
import UsersController from './controller/UsersController'

export default function addRoutes(servidor: Express) {
  servidor.use(PriorityController)
  servidor.use(CustomersController)
  servidor.use(EnterPrisesController)
  servidor.use(UsersController)
}