import { Express } from 'express';
import PriorityController from './controller/PriorityController'
import CustomersController from './controller/CustomersController'
import EnterPrisesController from './controller/EnterprisesController'
import UsersController from './controller/UsersController'
import OrdersController from './controller/OrdersController'
import Status from './controller/StatusOrderController'

export default function addRoutes(servidor: Express) {
  servidor.use(PriorityController)
  servidor.use(CustomersController)
  servidor.use(EnterPrisesController)
  servidor.use(UsersController)
  servidor.use(OrdersController)
  servidor.use(Status)
}