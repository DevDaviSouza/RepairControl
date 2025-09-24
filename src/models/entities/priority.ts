import _sequelize, { DataTypes, Optional, Sequelize } from 'sequelize'
const { Model } = _sequelize

interface IPriorityAttributes {
  priority_id: number;
  ds_priority: string;
}

interface IPriorityCreationAttributes extends Optional<IPriorityAttributes, 'priority_id'> {}

export default class Priority extends Model<IPriorityAttributes, IPriorityCreationAttributes> 
  implements IPriorityAttributes
{
  public priority_id!: number;
  public ds_priority!: string;
  
  static initModel(sequelize: Sequelize): typeof Priority {
    return Priority.init(
      {
        priority_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        ds_priority: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
      }, 
      {
        sequelize,
        tableName: 'priority',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{name: 'priority_id'}]
          }
        ]
      }
    )
  }
}
