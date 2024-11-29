import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { BonoEntity } from './bono.entity/bono.entity';
import { BonoService } from './bono.service';

@Controller('bono')
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

    @Post()
    create(@Body() bono: BonoEntity): Promise<BonoEntity> {
        return this.bonoService.create(bono);
    }

    @Get(':cod')
    findBonosByCodigoClase(@Param('cod') cod: number): Promise<BonoEntity[]> {
        return this.bonoService.findAllByClaseId(cod);
    }

    @Get('userID')
    findBonosByUserID(@Param('userID') userID: number): Promise<BonoEntity[]> {
        return this.bonoService.findAllByUsuario(userID);
    }

    @Delete(':id')
    deleteBono(@Param('id') id: number): Promise<void> {
        return this.bonoService.deleteBono(id);
    }

}
