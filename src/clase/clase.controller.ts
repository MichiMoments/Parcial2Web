import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { ClaseService } from './clase.service';

@Controller('clase')
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

    @Post()
    create(@Body() clase: ClaseEntity): Promise<ClaseEntity> {
        return this.claseService.create(clase);
    }

    @Get(':id')
    findClaseById(@Param('id') id: number): Promise<ClaseEntity> {
        return this.claseService.findClaseById(id);
    }
}
