import { Sequelize } from "sequelize";

import Priority from "./entities/priority";
import Customers from "./entities/customers";
import Enterprises from "./entities/enterprise";
import Users from "./entities/Users";
import Orders from "./entities/orders";

export interface IDbModels {
  priority: typeof Priority;
  customers: typeof Customers;
  enterprises: typeof Enterprises;
  users: typeof Users;
  orders: typeof Orders;
}

export default function initModels(sequelize: Sequelize): IDbModels {
  const priority = Priority.initModel(sequelize);
  const customers = Customers.initModel(sequelize);
  const enterprises = Enterprises.initModel(sequelize);
  const users = Users.initModel(sequelize);
  const orders = Orders.initModel(sequelize);

  users.belongsTo(enterprises, {as: "enterprises", foreignKey: 'enterprise_id'})
  enterprises.hasMany(users, {as: 'users', foreignKey: 'enterprise_id'})
  
  orders.belongsTo(customers, {as: "customers", foreignKey: 'customer_id'})
  customers.hasMany(orders, {as: "orders", foreignKey: 'customer_id'})

  orders.belongsTo(priority, {as: "priority", foreignKey: 'priority_id'})
  priority.hasMany(orders, {as: "orders", foreignKey: 'priority_id'})

  orders.belongsTo(enterprises, {as: "enterprises", foreignKey: 'enterprise_id'})
  enterprises.hasMany(orders, {as: "orders", foreignKey: 'enterprise_id'})

  return {
    priority,
    customers,
    enterprises,
    users,
    orders,
  }
}