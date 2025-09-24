import _sequelize, {DataTypes, Optional, Sequelize} from 'sequelize'
const {Model} = _sequelize

interface IEnterprisesAttributes{
  enterprise_id: number;
  nm_enterprise: string;
  ep_fantasy: string;
  ep_cnpj: string;
}

interface IEnterprisesCreationAttributes extends Optional<IEnterprisesAttributes, 'enterprise_id'> {}

export default class Enterprises extends Model<IEnterprisesAttributes, IEnterprisesCreationAttributes>
  implements IEnterprisesAttributes
  {
    public enterprise_id!: number;
    public nm_enterprise!: string;
    public ep_fantasy!: string;
    public ep_cnpj!: string;

    static initModel(sequelize: Sequelize): typeof Enterprises {
      return Enterprises.init(
        {
          enterprise_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
          },
          nm_enterprise: {
            type: DataTypes.STRING(200),
            allowNull: false,
          },
          ep_fantasy: {
            type: DataTypes.STRING(200),
            allowNull: false,
          },
          ep_cnpj: {
            type: DataTypes.STRING(19)
          },
        },
        {
          sequelize,
          tableName: 'enterprises',
          timestamps: false,
          indexes: [
            {
              name: 'PRIMARY',
              unique: true,
              using: 'BTREE',
              fields: [{name: 'enterprise_id'}]
            }
          ]
        }
      )
    }
  }