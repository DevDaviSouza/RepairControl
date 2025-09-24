import _sequelize, { DataTypes, Optional, Sequelize} from 'sequelize'
const {Model} = _sequelize

interface ICustomersAttributes {
  customers_id: number;
  nm_customer: string;
  ds_phone: string;
  ds_mail: string;
  nm_cpf: string;
}

interface ICustomersCreationAttributes extends Optional<ICustomersAttributes, 'customers_id'> {}

export default class Customers extends Model<ICustomersAttributes, ICustomersCreationAttributes>
  implements ICustomersAttributes
  {
    public customers_id!: number;
    public nm_customer!: string;
    public ds_phone!: string;
    public ds_mail!: string;
    public nm_cpf!: string;
    
    static initModel(sequelize: Sequelize): typeof Customers {
      return Customers.init(
        {
          customers_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
          },
          nm_customer: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ds_phone: {
            type: DataTypes.STRING(19),
            allowNull: false
          },
          ds_mail: {
            type: DataTypes.STRING,
            allowNull: false
          },
          nm_cpf: {
            type: DataTypes.STRING(14)
          },
        },
        {
          sequelize,
          tableName: 'customers',
          timestamps: false,
          indexes: [
            {
              name: 'PRIMARY',
              unique: true,
              using: 'BTREE',
              fields: [{name: 'customers_id'}]
            }
          ]
        }
      )
    }
  }