import db from "../models/db"

const findAllOrders = async () => {
  return await db.orders.findAll();
}


export default findAllOrders;