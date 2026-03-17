import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import BaseController from './base.controller';
import { User } from '../models';
import { sha256 } from '../utils/hash/sha256';
import jwtUtil from '../utils/jwt/jwt.util';

class UsersController extends BaseController<User> {
  constructor() {
    super(User);
  }

  // auth routes -----------------

  signup = async (req: Request, res: Response) => {
    try {
      const payload = req.body;

      const {
        first_name,
        last_name,
        email,
        password,
        preferred_expiry_within_seconds,
      } = payload;
      const [SALT_LEFT, SALT_RIGHT] = process.env.PASSWORD_SALT?.split(',') || [
        '',
        '',
      ];

      const password_hash = sha256(SALT_LEFT + password + SALT_RIGHT);

      const user = await User.create({
        first_name,
        last_name,
        email,
        password_hash,
        preferred_expiry_within_seconds,
      });

      res.status(201).json({ message: 'User created successfully', user });
      // first_name, last_name, email, password, preferred_expiry_within_seconds
    } catch (error) {
      res.status(500).json({ message: 'Error signing up', error });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const payload = req.body;

      const { email, password } = payload;
      const [SALT_LEFT, SALT_RIGHT] = process.env.PASSWORD_SALT?.split(',') || [
        '',
        '',
      ];

      const password_hash = sha256(SALT_LEFT + password + SALT_RIGHT);

      const user = await User.findOne({ where: { email, password_hash } });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const tokens = await jwtUtil.createTokens({
        user_id: user.id,
        email: user.email,
      });

      res.status(200).json({ message: 'Login successful', tokens });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const currentUser = await User.findByPk(user.user_id);

      const userPick = this._.pick(currentUser, [
        'id',
        'first_name',
        'last_name',
        'email',
        'preferred_expiry_within_seconds',
      ]);

      res
        .status(200)
        .json({ message: 'User info fetched successfully', user: userPick });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user info', error });
    }
  };
}

const usersController = new UsersController();

export default usersController;
