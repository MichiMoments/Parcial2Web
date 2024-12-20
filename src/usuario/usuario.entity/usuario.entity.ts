import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../../clase/clase.entity/clase.entity';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  cedula: number;

  @Column()
  groupo_inv: string;

  @Column()
  num_extension: number;
  
  @Column()
  rol: string;

  @Column()
  jefe: number; //!! El id del jefe porque postrgres no me estaba dejando con lo otro

  @OneToMany(() => BonoEntity, bono => bono.usuario)
  bonos: BonoEntity[]

  @OneToMany(() => ClaseEntity, clase => clase.usuario)
  clases: ClaseEntity[]

}