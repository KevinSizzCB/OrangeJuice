import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'usuario', /* synchronize:false */ })
export class UsuarioEntidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:true, default:""})
  nombre: string;

  @Column({nullable:true, default:0})
  edad: number;

  @Column({nullable:true, default:""})
  clave: string;

  @CreateDateColumn({type:'timestamp', name:'fecha_ultima_compra'})
  fecha_ultima_compra: Date;

  @Column({nullable:true, default:0})
  acumulacion_compras_mensual: number;

  @CreateDateColumn({type:'timestamp', name:'fecha_creacion'})
  fecha_creacion: Date;
}
