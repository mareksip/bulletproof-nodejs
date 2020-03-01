import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import MockService from '../../services/mockservice';
import { IUserInputDTO } from '../../interfaces/IUser';
import { IFilterInputDTO } from '../../interfaces/IFilter';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';

const route = Router();

export default (app: Router) => {
  app.use('/mockdata', route);

  route.post(
    '/init',
    celebrate({
      body: Joi.object({}),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      logger.debug('Initializing data: %o', req.body);
      try {
        const mockServiceInstance = Container.get(MockService);
        const { success } = await mockServiceInstance.Init();
        return res.status(201).json({ success });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/users',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({}),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      logger.debug('Initializing data: %o', req.body);
      try {
        var filter = req.param('filter', '');
        var value = req.param('value', '');

        var filt = {
          filter: filter,
          value: value,
        };

        const mockServiceInstance = Container.get(MockService);
        const { user } = await mockServiceInstance.Data(filt as IFilterInputDTO); //req.body as IFilterInputDTO
        console.log(user);
        return res.status(201).json({ user });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/userpolicies',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({}),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      logger.debug('Initializing data: %o', req.body);
      try {
        var username = req.param('username', '');
        console.log(username);

        var usr = req.currentUser;

        if (usr.role != 'admin') {
          throw new Error('Permission to read user policies requires admin.');
        }

        const mockServiceInstance = Container.get(MockService);
        const { policies } = await mockServiceInstance.UserPolicies(username);
        return res.status(201).json({ policies });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  route.get(
    '/policyuser',
    middlewares.isAuth,
    middlewares.attachCurrentUser,
    celebrate({
      body: Joi.object({}),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      logger.debug('Initializing data: %o', req.body);
      try {
        var username = req.param('policy', '');
        console.log(username);

        var usr = req.currentUser;

        if (usr.role != 'admin') {
          throw new Error('Permission to read user policies requires admin.');
        }

        const mockServiceInstance = Container.get(MockService);
        const { user } = await mockServiceInstance.PolicyUser(username);
        return res.status(201).json({ user });
      } catch (e) {
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );
};
