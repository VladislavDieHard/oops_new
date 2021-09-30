import {Injectable} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {User, UserDocument} from "./user.schema";
import {InjectModel} from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FileDescription, FileService, FileType} from "../file/file.service";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                private fileService: FileService) {}

    async getUsers(): Promise<User[]> {
        return this.userModel.find();
    }

    async getUser(id): Promise<User> {
        return this.userModel.findById(id);
    }

    async createUser(dto: CreateUserDto, image): Promise<User> {
        const user = await this.userModel.create({...dto});
        user.avatarUrl = this.fileService.saveFiles(FileType.IMAGE, FileDescription.AVATAR, image, user.username).join();
        await user.save();
        return user;
    }

    async deleteUser(id: ObjectId): Promise<ObjectId> {
        const user = await this.userModel.findByIdAndDelete(id);
        this.fileService.removeFile([user.avatarUrl]);
        return user._id;
    }

    async updateUser(id: ObjectId, dto: UpdateUserDto): Promise<User>{
        return this.userModel.findByIdAndUpdate(id, dto);
    }
}
