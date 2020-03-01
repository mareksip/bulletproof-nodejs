import { Service, Inject } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { EventDispatcher, EventDispatcherInterface } from '../decorators/eventDispatcher';
import demousers from '../data/users.json';
import { IFilterInputDTO } from '../interfaces/IFilter';

@Service()
export default class MockService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('mockPolicyModel') private mockPolicyModel: Models.MockPolicyModel,
    @Inject('logger') private logger,
  ) {}

  public async Init(): Promise<{ successs: boolean }> {
    try {
      //load data here
      this.logger.silly('Initiated demo data creation!');

      const password = 'test';

      for (let entry of demousers.clients) {
        const salt = randomBytes(32);
        this.logger.silly('Hashing password');

        const hashedPassword = await argon2.hash(password, { salt });

        entry.salt = salt.toString('hex');
        entry.password = hashedPassword;

        const userRecord = await this.userModel.create(entry);

        this.logger.silly('Creating user db record');

        if (!userRecord) {
          throw new Error('User cannot be created');
        }

        console.log(userRecord);
      }

      for (let entry of demopolicies.policies) {
        const policyRecord = await this.mockPolicyModel.create(
          entry
        );
        console.log(policyRecord);
      }

      const success = true;
      return { success };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async Data(filterInputDTO: IFilterInputDTO): Promise<{ user: any }> {
    try {
      var user;

      if (filterInputDTO.filter == 'id') {
        user = await this.userModel.findOne({ id: filterInputDTO.value });
      } else {
        user = await this.userModel.findOne({ name: filterInputDTO.value });
      }

      console.log(user);

      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async UserPolicies(value: string): Promise<{ policies: any[] }> {
    try {
      var userRecord = await this.userModel.findOne({ name: value });

      if (!userRecord) {
        console.log('no user record found');
        return false;
      }

      console.log(userRecord);

      var policies = [];
      policies = await this.mockPolicyModel.find({ clientId: userRecord.id });

      console.log(policies);

      return { policies };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async PolicyUser(value: string): Promise<{ user: any }> {
    try {
      var policyRecord = await this.mockPolicyModel.findOne({ id: value });

      if (!policyRecord) {
        console.log('no user record found');
        return false;
      }

      console.log(policyRecord);

      var user = {};
      user = await this.userModel.findOne({ id: policyRecord.clientId });

      console.log(user);

      return { user };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
