// src/types/products.ts
// Tipos de domínio para sistema de produtos

import { ExtendedDatabaseTables } from './database';

// Tipos base do Supabase
export type Product = ExtendedDatabaseTables['public']['Tables']['products']['Row'];
export type ProductInsert = ExtendedDatabaseTables['public']['Tables']['products']['Insert'];
export type ProductUpdate = ExtendedDatabaseTables['public']['Tables']['products']['Update'];

export type UserProduct = ExtendedDatabaseTables['public']['Tables']['user_products']['Row'];
export type UserProductInsert = ExtendedDatabaseTables['public']['Tables']['user_products']['Insert'];
export type UserProductUpdate = ExtendedDatabaseTables['public']['Tables']['user_products']['Update'];

export type ProductResource = ExtendedDatabaseTables['public']['Tables']['product_resources']['Row'];

// Tipos estendidos para UI
export interface ProductWithAccess extends Product {
    has_access: boolean;
    access_expires_at: string | null;
}

export interface UserProductWithDetails extends UserProduct {
    product: Product;
}

// Tipos para formulários
export interface AssignProductFormData {
    user_id: string;
    product_id: string;
    access_expires_at: string | null;
    notes: string | null;
}

// Tipos de status
export type ProductStatus = 'active' | 'expired' | 'canceled' | 'suspended';
export type ProductType = 'course' | 'subscription' | 'one-time' | 'service';
export type ResourceType = 'material' | 'folder' | 'page' | 'feature' | 'module';
