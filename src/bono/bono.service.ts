import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class BonoService {
    
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>
    ) {}

    async create(bono: BonoEntity): Promise<BonoEntity> {
        if (!bono.monto || bono.monto <= 0) {
            throw new BusinessLogicException('El monto debe ser un valor positivo', BusinessError.BAD_REQUEST);
        }
        const usuario = bono.usuario;
        if (!usuario || usuario.rol !== 'profesor') {
            throw new BusinessLogicException('El usuario debe tener rol "Profesor"', BusinessError.UNAUTHORIZED);
        }
        return this.bonoRepository.save(bono);
    }

    async findAllByClaseId(cod: number): Promise<BonoEntity[]> { //este es el que en el parcial se llama "findBonosByCodigo"
        const bonos: BonoEntity[] = await this.bonoRepository.find({ where: { clase: { codigo: cod } } });
        if (!bonos || bonos.length === 0) {
            throw new BusinessLogicException('No se encontraron bonos para la clase', BusinessError.NOT_FOUND);
        }
        return bonos;
    }

    async findAllByUsuario(userID: number): Promise<BonoEntity[]> { //este es el que en el parcial se llama "findBonosByCodigo"
        const bonos: BonoEntity[] = await this.bonoRepository.find({ where: { usuario: { id: userID } } });
        if (!bonos || bonos.length === 0) {
            throw new BusinessLogicException('No se encontraron bonos para el usuario', BusinessError.NOT_FOUND);
        }
        return bonos;
    }

    async deleteBono(id: number): Promise<void> {
        const bono = await this.bonoRepository.findOne({where: {id}});
        if (!bono) {
            throw new BusinessLogicException("No se encontró el bono", BusinessError.NOT_FOUND);
        }
        if (bono.calificacion > 4) {
            throw new BusinessLogicException('No se puede eliminar un bono con calificación mayor a 4', BusinessError.BAD_REQUEST);
        }
        await this.bonoRepository.remove(bono);
    }

}
