import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileType {
    IMAGE = 'image'
}

export enum FileDescription {
    AVATAR = 'avatar',
    POST = 'post'
}

@Injectable()
export class FileService {
    saveFiles(type: FileType, description: FileDescription, files, username): string[] {
        const filePaths = []
        files.forEach((file) => {
            try {
                const fileExtension = file.originalname.split('.').pop();
                const fileName = uuid.v4() + '.' + fileExtension;
                const filePath = path.resolve(__dirname, '..', 'static', type, description);
                if (!fs.existsSync(filePath)) {
                    fs.mkdirSync(filePath, {recursive: true});
                }
                fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
                if (description === FileDescription.POST){
                    filePaths.push(type + '/' + description + '/' + username + '/' + fileName);
                } else {
                    filePaths.push(type + '/' + description + '/' + fileName);
                }
            } catch (e) {
                throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
        return filePaths;
    }

    removeFile(destination: string) {
        try {
            return fs.unlinkSync(path.resolve(__dirname, '..', 'static', destination));
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
