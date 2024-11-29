import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from 'typeorm';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class BonoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  monto: number;

  @Column()
  calificacion: number;

  @Column()
  palabra_clave: string;

  @ManyToOne(() => ClaseEntity, clase => clase.bonos)
  clase: ClaseEntity;

  @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
  usuario: UsuarioEntity

}