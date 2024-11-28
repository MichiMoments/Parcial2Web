import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseModule } from './clase/clase.module';
import { BonoModule } from './bono/bono.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'parcial-2',
    entities: [],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true,
    }), UsuarioModule, ClaseModule, BonoModule
    // Importa los modulos
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
