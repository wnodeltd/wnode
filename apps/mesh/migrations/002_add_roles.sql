-- Migration: 002_add_roles.sql
-- Add sales_source and management roles to ledger_role enum

ALTER TYPE ledger_role ADD VALUE IF NOT EXISTS 'sales_source';
ALTER TYPE ledger_role ADD VALUE IF NOT EXISTS 'management';
