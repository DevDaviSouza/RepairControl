import _sequelize, { DataTypes, Optional, Sequelize} from 'sequelize'
const {Model} = _sequelize

interface IOrdersAttributes {
  order_id: number;
  customer_id: number;
  ds_model: string;
  ds_color: string;
  dt_year: number;
  ds_plate: string;
  qtd_repair: number;
  qtd_painting: number;
  dt_order: Date;
  dt_completion: Date;
  dt_delivered: Date;
  bt_delivered: boolean;
  ds_services: string;
  priority_id: number;
  vl_total: number;
  enterprise_id: number;
}

interface IOrdersCreationAttributes extends Optional<IOrdersAttributes, 'order_id'>{}

export default class Orders extends Model<IOrdersAttributes, IOrdersCreationAttributes>
  implements IOrdersAttributes
  {
    public order_id!: number;
    public customer_id!: number;
    public ds_model!: string;
    public ds_color!: string;
    public dt_year!: number;
    public ds_plate!: string;
    public qtd_repair!: number;
    public qtd_painting!: number;
    public dt_order!: Date;
    public dt_completion!: Date;
    public dt_delivered!: Date;
    public bt_delivered!: boolean;
    public ds_services!: string;
    public priority_id!: number;
    public vl_total!: number;
    public enterprise_id!: number;

    static initModel(sequelize: Sequelize): typeof Orders{
      return Orders.init(
        {
          order_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true
          },
          customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'customers',
              key: 'customer_id'
            }
          },
          ds_model: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          ds_color: {
            type: DataTypes.STRING,
            allowNull: false
          },
          dt_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
          ds_plate: {
            type: DataTypes.STRING(7),
            allowNull: false
          },
          qtd_repair: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          qtd_painting: {
            type: DataTypes.INTEGER,
            allowNull: true
          },
          dt_order: {
            type: DataTypes.DATE,
            allowNull: false
          },
          dt_completion: {
            type: DataTypes.DATE,
            allowNull: true
          },
          dt_delivered: {
            type: DataTypes.DATE,
            allowNull: true
          },
          bt_delivered: { 
            type: DataTypes.BOOLEAN,
            allowNull: false
          },
          ds_services: {
            type: DataTypes.STRING,
            allowNull: true
          },
          priority_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'priority',
              key: 'priority_id'
            }
          },
          vl_total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
          },
          enterprise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'enterprises',
              key: 'enterprise_id'
            }
          }
        },
        {
          sequelize,
          tableName: 'orders',
          timestamps: false,
          indexes: [
            {
              name: 'PRIMARY',
              unique: true,
              using: 'BTREE',
              fields: [{name: 'order_id'}]
            },
            {
              name: 'customer_id',
              using: 'BTREE',
              fields: [{name: "customer_id"}]
            },
            {
              name: 'priority_id',
              using: 'BTREE',
              fields: [{name: "priority_id"}]
            },
            {
              name: 'enterprise_id',
              using: 'BTREE',
              fields: [{name: "enterprise_id"}]
            }
          ]
        }
      )
    }
  }