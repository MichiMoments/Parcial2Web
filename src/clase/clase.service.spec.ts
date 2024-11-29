import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('ClaseService', () => {
  let claseService: ClaseService;
  let claseRepository: Repository<ClaseEntity>;
  let claseList: ClaseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    claseService = module.get<ClaseService>(ClaseService);
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    claseRepository.clear();
    claseList = [];

    for (let i = 0; i < 5; i++) {
      const clase = await claseRepository.save({
        nombre: faker.lorem.words(),
        codigo: faker.number.int({ min: 1000000000, max: 9999999999 }),
        num_creditos: faker.number.int(),
      });
      claseList.push(clase);
    }
  };

  it('should be defined', () => {
    expect(claseService).toBeDefined();
  });

  it('create should throw an exception if the codigo length is not 10', async () => {
    const invalidClase: ClaseEntity = {
      id: faker.number.int(),
      nombre: faker.lorem.words(),
      codigo: faker.number.int({ min: 100000000, max: 999999999 }), // Not 10 digits
      num_creditos: faker.number.int(),
      bonos: [],
      usuario: null,
    };

    try {
      await claseService.create(invalidClase);
    } catch (error) {
      expect(error.message).toEqual('El código debe tener 10 caracteres');
    }
  });

  it('findClaseById should throw an exception for an invalid id', async () => {
    try {
      await claseService.findClaseById(99);
    } catch (error) {
      expect(error.message).toEqual('No se encontró la clase');
    }
  });

  it('findClaseById should return the correct error message for invalid id', async () => {
    try {
      await claseService.findClaseById(0);
    } catch (error) {
      expect(error.message).toEqual('No se encontró la clase');
    }
  });

  it('create should save a valid clase', async () => {
    const newClase: ClaseEntity = {
      id: faker.number.int(),
      nombre: faker.lorem.words(),
      codigo: faker.number.int({ min: 1000000000, max: 9999999999 }),
      num_creditos: faker.number.int(),
      bonos: [],
      usuario: null,
    };

    const result = await claseService.create(newClase);
    expect(result).toBeDefined();
    expect(result.nombre).toEqual(newClase.nombre);
    expect(result.codigo).toEqual(newClase.codigo);
  });
});
