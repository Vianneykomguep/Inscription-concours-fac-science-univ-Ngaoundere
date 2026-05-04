import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'XAF', minimumFractionDigits: 0
  }).format(amount)
}

export const CANDIDATURE_STATUT_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  SOUMISE: 'Soumise',
  EN_COURS_EXAMEN: 'En cours d\'examen',
  COMPLEMENT_DEMANDE: 'Complément demandé',
  VALIDEE: 'Validée',
  REJETEE: 'Rejetée',
  ADMISSIBLE: 'Admissible',
  ADMIS: 'Admis',
  NON_ADMIS: 'Non admis',
}

export const CANDIDATURE_STATUT_COLORS: Record<string, string> = {
  BROUILLON: 'badge-gray',
  SOUMISE: 'badge-info',
  EN_COURS_EXAMEN: 'badge-warning',
  COMPLEMENT_DEMANDE: 'badge-warning',
  VALIDEE: 'badge-success',
  REJETEE: 'badge-danger',
  ADMISSIBLE: 'badge-success',
  ADMIS: 'badge-success',
  NON_ADMIS: 'badge-danger',
}

export const CONCOURS_STATUT_LABELS: Record<string, string> = {
  BROUILLON: 'Brouillon',
  PUBLIE: 'Publié',
  EN_COURS: 'En cours',
  CLOTURE: 'Clôturé',
  ARCHIVE: 'Archivé',
}
