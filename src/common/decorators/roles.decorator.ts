import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// لاضافة صلاحيات على كل راوتر 
// @Roles("Doctor")
// لحالو ما بيشتغل لازم يكون في معو RolesGuard

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);