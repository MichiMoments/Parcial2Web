import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';

@Entity()
export class ClaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: number;

  @Column()
  num_creditos: number;

  @OneToMany(() => BonoEntity, bono => bono.clase)
  bonos: BonoEntity[]

  @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
  usuario: UsuarioEntity

}