import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from "@nestjs/jwt";
import { AuditoriasService } from 'src/Auditorias/auditorias.service';
import { Usuarios } from '../Usuarios/entities/usuarios.entity';


@Injectable()
export class EmpresasService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    

}