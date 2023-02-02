import { UserEntity } from "@app/user/entity/user.entity";

export type UserType = Omit<UserEntity , 'hashPassword'>  

// ommiting or ignoring the hashPassword from userEntity(i.e; pass all the things of userEntity except hashPassword).

//THIS IS DONE TO SOLVE THE FOLLOWING ERROR:-
// 'hashPassword' is declared here.
//userResponse.interface.ts(4, 1): The expected type comes from property 'user' which is declared here on type 'UserResponseInterface'