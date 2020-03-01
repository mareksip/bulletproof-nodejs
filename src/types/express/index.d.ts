import { Document, Model } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IMockPolicy } from '../../interfaces/IMockPolicy';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type MockPolicyModel = Model<IMockPolicy & Document>;
  }
}
