import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';

import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioService]
})
export class UsuarioModule {}
