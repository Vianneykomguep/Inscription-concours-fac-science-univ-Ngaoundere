'use client'

import { UserRole } from '@prisma/client'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  role: UserRole
  emailVerified: boolean
  isActive: boolean
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'CANDIDAT',
  emailVerified: true,
  isActive: true,
}

export default function CreateUserForm() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setMessage(data?.error ?? 'Creation impossible. Verifiez les champs.')
        return
      }

      setForm(initialForm)
      setMessage('Utilisateur cree avec succes.')
      setIsOpen(false)
      router.refresh()
    })
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-uni-green">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-950">Creer un utilisateur</h2>
            <p className="text-sm text-slate-500">Ajoutez un candidat, agent, responsable ou super admin.</p>
          </div>
        </div>
          <span className="btn-primary pointer-events-none">{isOpen ? 'Fermer' : 'Nouveau'}</span>
      </button>

      {isOpen && (
        <form onSubmit={submit} className="border-t border-slate-200 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Prenom" value={form.firstName} onChange={(value) => update('firstName', value)} />
            <Field label="Nom" value={form.lastName} onChange={(value) => update('lastName', value)} />
            <Field label="Email" type="email" value={form.email} onChange={(value) => update('email', value)} />
            <Field label="Telephone" value={form.phone} onChange={(value) => update('phone', value)} />
            <Field label="Mot de passe initial" type="password" value={form.password} onChange={(value) => update('password', value)} />
            <div>
              <label className="label-field">Role</label>
              <select className="input-field" value={form.role} onChange={(event) => update('role', event.target.value as UserRole)}>
                <option value="CANDIDAT">Candidat</option>
                <option value="AGENT">Agent</option>
                <option value="RESPONSABLE">Responsable</option>
                <option value="SUPER_ADMIN">Super admin</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.emailVerified} onChange={(event) => update('emailVerified', event.target.checked)} />
              Email deja verifie
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} />
              Compte actif
            </label>
          </div>

        {message && <p className={`mt-4 text-sm font-semibold ${message.includes('succes') ? 'text-green-700' : 'text-red-600'}`}>{message}</p>}

          <div className="mt-5 flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setIsOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? 'Creation...' : 'Creer le compte'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label className="label-field">{label}</label>
      <input className="input-field" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={label !== 'Telephone'} />
    </div>
  )
}
