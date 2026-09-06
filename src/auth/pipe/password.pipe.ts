import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { In } from 'typeorm';


@Injectable()
export class PasswordPipe implements PipeTransform {
    transform(
        value: any,
        metadata: ArgumentMetadata // 파라미터 메타데이터
    ) {
        if (value.toString().length > 8) {
            throw new BadRequestException('비밀번호는 8자 이하여야 합니다.');
        }

        return value.toString();
    }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {

    constructor(private readonly length: number){}
    transform(value: any, metadata: ArgumentMetadata){
        if (value.toString().length > this.length){
            throw new BadRequestException(`${length}자 이하여야 합니다.`);
        }
        return value.toString();
    }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
    constructor(private readonly length: number){}
    transform(value: any, metadata: ArgumentMetadata){
        if (value.toString().length < this.length){
            throw new BadRequestException(`${length}자 초과여야 합니다.`);
        }
        return value.toString();
    }
}