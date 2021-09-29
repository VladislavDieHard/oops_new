import {forwardRef, Module} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.schema";
import {FileService} from "../file/file.service";
import {PostModule} from "../post/post.module";

@Module({
  imports: [
      MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
      forwardRef(() => PostModule),
  ],
  providers: [UserService, FileService],
  controllers: [UserController]
})
export class UserModule {}
