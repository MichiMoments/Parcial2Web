import { TypeOrmModule } from '@nestjs/typeorm';
//importa las entidades

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [], //todoooo
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([]), //todoo x2
];