import { AuthData } from "../../types/types";

export const authValidate = (data: AuthData) => {
  if(!data.name) {
    return false;
  }
  if(data.name.length < 5) {
    return false;
  }
  if(data.password.length < 5) {
    return false;
  }

  return true;
}
