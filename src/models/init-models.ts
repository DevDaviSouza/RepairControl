import { Sequelize } from "sequelize";

import Priority from "./entities/Priority";
import Customers from "./entities/customers";
import Enterprises from "./entities/enterprise";
import Users from "./entities/Users";

export interface IDbModels {
  priority: typeof Priority;
  customers: typeof Customers;
  enterprises: typeof Enterprises;
  users: typeof Users;
}

export default function initModels(sequelize: Sequelize): IDbModels {
  const priority = Priority.initModel(sequelize);
  const customers = Customers.initModel(sequelize);
  const enterprises = Enterprises.initModel(sequelize);
  const users = Users.initModel(sequelize)

  users.belongsTo(enterprises, {as: "enterprises", foreignKey: 'enterprise_id'})
  enterprises.hasMany(users, {as: 'users', foreignKey: 'enterprise_id'})
  
  return {
    priority,
    customers,
    enterprises,
    users,
  }
}