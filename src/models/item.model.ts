import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/db/connect';
import User from './user.model';

/**
 * 
 * import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
// https://sequelize.org/docs/v6/other-topics/typescript/
// order of InferAttributes & InferCreationAttributes is important.
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  // 'CreationOptional' is a special type that marks the field as optional
  // when creating an instance of the model (such as using Model.create()).
  declare id: CreationOptional<number>;
  declare name: string;
  // other attributes...
}
  https://sequelize.org/docs/v6/other-topics/typescript/#the-case-of-modelinit
 * 
 */

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<string>;
  // declare userId: ForeignKey<number>;
  declare name: string;
  declare quantity: number;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
  declare deletedAt: CreationOptional<string>;
  // declare consumed: boolean;
  // declare thrown: boolean;
}

// this configures the `userId` attribute
// Item.belongsTo(User)

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'quantity_current',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
    // consumed: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
    // thrown: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
  },
  {
    sequelize,
    tableName: 'items',
    modelName: 'Item',
    timestamps: true,
    // createdAt: "createdat",
    updatedAt: false,
  },
);

export default Item;
