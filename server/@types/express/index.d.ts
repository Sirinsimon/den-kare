import { Doctor as User } from '../../src/database/schema/doctor.schema';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
