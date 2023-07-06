import { AuthData } from "../../types/types";
import db from '../../db/db';

export const authValidate = (data: AuthData) => {
  const user = db.users.find(user => user.name === data.name);
  if(!data.name) {
    return false;
  }
  if(data.name.length < 5) {
    return false;
  }
  if(user) {
    return false;
  }
  if(data.password.length < 5) {
    return false;
  }
  return true;
}
