import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}

    async create(usuario: UsuarioEntity): Promise<UsuarioEntity>{
        if (usuario.rol === 'Profesor'){
            if (usuario.groupo_inv === 'TICSW' || usuario.groupo_inv === 'IMAGINE' || usuario.groupo_inv === 'COMMIT'){
                return await this.usuarioRepository.save(usuario);
            } else {
                throw new BusinessLogicException('El grupo de investigación no es válido', BusinessError.INVALID_GROUP);
            }
        }

        else if (usuario.rol === 'Decana'){
            if (usuario.num_extension.toString().length === 8) {
                return await this.usuarioRepository.save(usuario);
            } else {
                throw new BusinessLogicException('El número de extensión debe tener 8 dígitos', BusinessError.INVALID_EXTENSION);
            }
        }
    }

    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const ususario = await this.usuarioRepository.findOne({where: {id}});
        if (!ususario) {
            throw new BusinessLogicException("No se encontró el usuario", BusinessError.NOT_FOUND);
        }
        return ususario;
    }

    async deleteUsuario(id: number) {
        const usuario: UsuarioEntity = await this.findUsuarioById(id);

        if (usuario.rol === 'Decana') {
            throw new BusinessLogicException('No se puede eliminar un usuario con rol "Decana"', BusinessError.UNAUTHORIZED);
        }
        
        if (usuario.bonos && usuario.bonos.length > 0) {
            throw new BusinessLogicException('No se puede eliminar el usuario porque tiene bonos asociados', 
                BusinessError.PRECONDITION_FAILED);
        }

        await this.usuarioRepository.remove(usuario);
    }
}
