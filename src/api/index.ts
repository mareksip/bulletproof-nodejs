import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import mockdata from './routes/mockdata';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	mockdata(app);

	return app
}