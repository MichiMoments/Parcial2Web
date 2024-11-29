import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class ClaseService {

    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ) {}

    async create(clase: ClaseEntity): Promise<ClaseEntity> {
        if (clase.codigo.toString().length !== 10) {
            throw new BusinessLogicException('El código debe tener 10 caracteres', BusinessError.BAD_REQUEST);
        }
        return this.claseRepository.save(clase);
    }

    async findClaseById(id: number): Promise<ClaseEntity> {
        const clase = await this.claseRepository.findOne({where: {id}});
        if (!clase) {
            throw new BusinessLogicException("No se encontró la clase", BusinessError.NOT_FOUND);
        }
        return clase;
    }

}
