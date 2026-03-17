import { Request, Response } from 'express';
import { Model, ModelStatic, UUID } from 'sequelize';
import _ from 'lodash';

class BaseController<T extends Model> {
  protected model: ModelStatic<T>;
  _: typeof _;

  constructor(model: ModelStatic<T>) {
    this.model = model;
    this._ = _;
  }
  // GET /resource
  getAll = async (req: Request, res: Response) => {
    try {
      const items = await this.model.findAll();
      console.log(items);
      res.status(200).json({ items });
    } catch (err) {
      console.error('Failed to fetch records: ', err);

      res.status(500).json({
        message: 'Failed to fetch records',
        error: err instanceof Error ? err.message : 'Unknown Error',
      });
    }
  };

  async list(req: Request, res: Response) {
    const rows = await this.model.findAll();
    res.status(200).json({
      rows,
      total: rows.length,
    });
  }

  async getById() {}

  create = async (req: Request, res: Response) => {
    try {
      console.log('this.model =', this.model); // ✅ works
      console.log(req.body);
      const row = await this.model.create(req.body);
      res.status(201).json({ msg: 'new row inserted', data: row });
    } catch (err: any) {
      console.error('FULL ERROR: ', err);
      console.error('MESSAGE: ', err.message);
      console.error('DETAIL: ', err.parent?.detail);
      console.error('COLUMN: ', err.parent?.column);
      console.error('TABLE: ', err.parent?.table);

      res.status(500).json({
        message: err.message,
        detail: err.parent?.detail,
      });
    }
  };

  async update() {}

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const row = await this.model.findByPk(Number(id));
      await row?.destroy();
      res.status(200).json({
        msg: `User with id #${id} has been deleted successfully`,
        row: row,
      });
    } catch (err: any) {
      console.error('FULL ERROR: ', err);
      res.status(500).json({
        message: err.message,
        detail: err.parent?.detail,
      });
    }
  };
}

export default BaseController;
