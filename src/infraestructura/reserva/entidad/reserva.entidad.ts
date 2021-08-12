import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'reserva', /* synchronize:false */ })
export class ReservaEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true, default:0})
  uid: number;

  @Column({nullable:true, default:0})
  cantidad_jugos: number;

  @Column({nullable:true, default:0})
  precio_total:number

  @CreateDateColumn({type:'timestamp', name:'fecha_creacion'})
  fecha_creacion: Date;
}
