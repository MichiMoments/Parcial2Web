import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';

import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    create(@Body() usuario: UsuarioEntity): Promise<UsuarioEntity> {
        return this.usuarioService.create(usuario);
    }

    @Get(':id')
    findUsuarioById(@Param('id') id: number): Promise<UsuarioEntity> {
        return this.usuarioService.findUsuarioById(id);
    }

    @Delete(':id')
    deleteUsuario(@Param('id') id: number): Promise<void> {
        return this.usuarioService.deleteUsuario(id);
    }
}
