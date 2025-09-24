import _sequelize, { DataTypes, Optional, Sequelize} from 'sequelize'
const {Model} = _sequelize

interface IUsersAttributes {
  user_id: number;
  nm_user: string;
  ds_email: string;
  ds_senha: string;
  enterprise_id: number
}

interface IUsersCreationAttributes extends Optional<IUsersAttributes, 'user_id'>{}

export default class Users extends Model<IUsersAttributes, IUsersCreationAttributes> 
  implements IUsersAttributes
  {
    public user_id!: number;
    public nm_user!: string;
    public ds_email!: string;
    public ds_senha!: string;
    public enterprise_id!: number;
    
    static initModel(sequelize: Sequelize): typeof Users{
      return Users.init(
        {
          user_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
          },
          nm_user: {
            type: DataTypes.STRING,
            allowNull: false
          },
          ds_email: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          ds_senha: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          enterprise_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'enterprise',
              key: 'enterprise_id'
            }
          }
        },
        {
          sequelize,
          tableName: 'users',
          timestamps: false,
          indexes: [
            {
              name: 'PRIMARY',
              unique: true,
              using: 'BTREE',
              fields: [{name: "user_id"}]
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