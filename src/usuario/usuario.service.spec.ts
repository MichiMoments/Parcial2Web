import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { fa, faker } from '@faker-js/faker';

import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BusinessLogicException } from '../shared/errors/business-errors';

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuarioList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    usuarioRepository.clear();
    usuarioList = [];

    for (let i = 0; i < 5; i++) {
      const usuario = await usuarioRepository.save({
        nombre: faker.name.firstName(),
        cedula: faker.number.int(),
        groupo_inv: 'TICSW', 
        num_extension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: 'Profesor',
        jefe: faker.number.int()

      });
      usuarioList.push(usuario);
    }
  };

  it('should be defined', () => {
    expect(usuarioService).toBeDefined();
  });

  it('create should save a valid profesor', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int(),
      jefe: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'IMAGINE',
      num_extension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      bonos: [],
      clases: [],
    };

    const result = await usuarioService.create(usuario);
    expect(result).toBeDefined();
    expect(result.nombre).toEqual(usuario.nombre);
    expect(result.groupo_inv).toEqual(usuario.groupo_inv);
  });

  it('create should throw an exception for an invalid groupo_inv for profesor', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int(),
      jefe: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'INVALID_GROUP',
      num_extension: null,
      rol: 'Profesor',
      bonos: [],
      clases: [],
    };

    try {
      await usuarioService.create(usuario);
      fail('create should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('El grupo de investigación no es válido');
    }
  });

  it('create should save a valid decana', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'TICSW',
      jefe: faker.number.int(),
      num_extension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Decana',
      bonos: [],
      clases: [],
    };

    const result = await usuarioService.create(usuario);
    expect(result).toBeDefined();
    expect(result.num_extension.toString().length).toEqual(8);
  });

  it('create should throw an exception for an invalid num_extension for decana', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int(),
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'TICSW',
      num_extension: 123, // Invalid length
      rol: 'Decana',
      jefe: faker.number.int(),
      bonos: [],
      clases: [],
    };

    try {
      await usuarioService.create(usuario);
      fail('create should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('El número de extensión debe tener 8 dígitos');
    }
  });

  it('findUsuarioById should return a usuario by id', async () => {
    const storedUsuario = usuarioList[0];
    const usuario = await usuarioService.findUsuarioById(storedUsuario.id);
    expect(usuario).toBeDefined();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
  });

  it('findUsuarioById should throw an exception for an invalid id', async () => {
    try {
      await usuarioService.findUsuarioById(9999);
      fail('findUsuarioById should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('No se encontró el usuario');
    }
  });

  it('deleteUsuario should delete a valid usuario', async () => {
    const usuario = usuarioList.find(u => u.rol !== 'Decana' && (!u.bonos || u.bonos.length === 0));
    if (!usuario) fail('No suitable usuario found for deletion');

    await usuarioService.deleteUsuario(usuario.id);
    const deletedUsuario = await usuarioRepository.findOne({ where: { id: usuario.id } });
    expect(deletedUsuario).toBeNull();
  });

  it('deleteUsuario should throw an exception if usuario has role Decana', async () => {
    const usuario = await usuarioRepository.save({
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'TICSW',
      jefe: faker.number.int(),
      num_extension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Decana',
      bonos: [],
      clases: [],
    });

    try {
      await usuarioService.deleteUsuario(usuario.id);
      fail('deleteUsuario should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(BusinessLogicException);
      expect(error.message).toEqual('No se puede eliminar un usuario con rol "Decana"');
    }
  });

  it('deleteUsuario should throw an exception if usuario has associated bonos', async () => {
    const usuario = await usuarioRepository.save({
      nombre: faker.name.firstName(),
      cedula: faker.number.int(),
      groupo_inv: 'TICSW',
      num_extension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      jefe: faker.number.int(),
      bonos: [{ id: faker.number.int() }], // Simulate associated bonos
      clases: [],
    });

    try {
      await usuarioService.deleteUsuario(usuario.id);
      fail('deleteUsuario should have thrown an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ReferenceError);
    }
  });
});
