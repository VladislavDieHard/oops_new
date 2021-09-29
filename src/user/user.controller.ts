import {Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {ObjectId} from "mongoose";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Get(':id')
    getUser(@Param('id') id: ObjectId) {
        return this.userService.getUser(id);
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([{
        name: 'image', maxCount: 1
    }]))
    createUser(@UploadedFiles() files, @Body() dto: CreateUserDto) {
        return this.userService.createUser(dto, files.image[0]);
    }

    @Put(':id')
    updateUser(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto)
    }

    @Delete(':id')
    deleteUser(@Param('id') id: ObjectId): Promise<ObjectId> {
        return this.userService.deleteUser(id);
    }
}
