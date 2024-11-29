import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { Query } from '@nestjs/common';


describe('BonoService', () => {
  let bonoService: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let bonoList: BonoEntity[];

  let usuarioRepository: Repository<UsuarioEntity>;
  let claseRepository: Repository<ClaseEntity>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    bonoService = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    claseRepository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    bonoRepository.clear();
    bonoList = [];

    for (let i = 0; i < 5; i++) {
      const bono = await bonoRepository.save({
        id: faker.number.int(),
        monto: faker.number.int({ min: 1 }),
        palabra_clave: faker.lorem.sentence(),
        calificacion: faker.number.int({ min: 1, max: 3.9 }),
      });
      bonoList.push(bono);
    }
  };

  it('should be defined', () => {
    expect(bonoService).toBeDefined();
  });

  it('create should save a valid bono', async () => {
    const usuario = await usuarioRepository.save({
      id: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: faker.lorem.word(),
      num_extension: faker.number.int(),
      rol: 'profesor',
      jefe: faker.number.int(),
      bonos: [],
      clases: []
    });

    const clase = await claseRepository.save({
      nombre: faker.lorem.words(),
      codigo: faker.number.int({ min: 1000000000, max: 9999999999 }),
      num_creditos: faker.number.int(),
      id: faker.number.int(),
      bonos: [],
      usuario: usuario
    });

    const bono: BonoEntity = {
      id: faker.number.int(),
      palabra_clave: faker.lorem.sentence(),
      monto: faker.number.int({ min: 1 }),
      usuario: usuario,
      calificacion: faker.number.int({ min: 1, max: 5 }),
      clase: clase,
    };

    const result = await bonoService.create(bono);
    expect(result).toBeDefined();
    expect(result.monto).toEqual(bono.monto);
    expect(result.palabra_clave).toEqual(bono.palabra_clave);
  });

  it('create should throw an exception if monto is not positive', async () => {
    const bono: BonoEntity = {
      id: faker.number.int(),
      palabra_clave: faker.lorem.sentence(),
      monto: -10,
      usuario: null,
      clase: null,
      calificacion: 3,
    };

    try {
      await bonoService.create(bono);
      fail('create should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('El monto debe ser un valor positivo');
    }
  });

  it('create should throw an exception if usuario role is not profesor', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: faker.lorem.word(),
      num_extension: faker.number.int(),
      rol: 'profesor',
      jefe: faker.number.int(),
      bonos: [],
      clases: [] 
    };

    const bono: BonoEntity = {
      id: faker.number.int(),
      monto: faker.number.int({ min: 1 }),
      palabra_clave: faker.lorem.word(),
      usuario: usuario,
      clase: { codigo: faker.number.int() } as ClaseEntity,
      calificacion: 3,
    };

    try {
      await bonoService.create(bono);
      fail('create should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(QueryFailedError);
    }
  });

  it('findAllByClaseId should throw an exception for an invalid clase code', async () => {
    try {
      await bonoService.findAllByClaseId(0);
      fail('findAllByClaseId should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('No se encontraron bonos para la clase');
    }
  });

  it('findAllByUsuario should throw an exception for an invalid usuario id', async () => {
    try {
      await bonoService.findAllByUsuario(9999);
      fail('findAllByUsuario should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('No se encontraron bonos para el usuario');
    }
  });

  it('deleteBono should delete a bono by id', async () => {
    const bono = bonoList[0];
    await bonoService.deleteBono(bono.id);

    const deletedBono = await bonoRepository.findOne({ where: { id: bono.id } });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception for an invalid bono id', async () => {
    try {
      await bonoService.deleteBono(0);
      fail('deleteBono should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('No se encontró el bono');
    }
  });

  it('deleteBono should throw an exception if calificacion is greater than 4', async () => {
    const bono = bonoList.find(b => b.calificacion > 4);
    if (bono) {
      try {
        await bonoService.deleteBono(bono.id);
        fail('deleteBono should have thrown an exception');
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessLogicException);
        expect(error.message).toEqual('No se puede eliminar un bono con calificación mayor a 4');
      }
    }
  });
});
