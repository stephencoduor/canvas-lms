import { useState } from 'react'
import { KeyRound, Eye, EyeOff } from 'lucide-react'

interface PasswordField {
  value: string
  visible: boolean
}

export function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState<PasswordField>({ value: '', visible: false })
  const [newPassword, setNewPassword] = useState<PasswordField>({ value: '', visible: false })
  const [confirmPassword, setConfirmPassword] = useState<PasswordField>({ value: '', visible: false })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const passwordsMatch = newPassword.value === confirmPassword.value
  const isValid =
    currentPassword.value.length > 0 &&
    newPassword.value.length >= 8 &&
    passwordsMatch

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return

    setStatus('submitting')
    setErrorMessage('')

    // Simulated submission — in production this would call the Canvas API
    setTimeout(() => {
      setStatus('success')
      setCurrentPassword({ value: '', visible: false })
      setNewPassword({ value: '', visible: false })
      setConfirmPassword({ value: '', visible: false })
    }, 1000)
  }

  function renderField(
    label: string,
    field: PasswordField,
    setField: (f: PasswordField) => void,
    id: string,
  ) {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700">
          {label}
        </label>
        <div className="relative">
          <input
            id={id}
            type={field.visible ? 'text' : 'password'}
            value={field.value}
            onChange={(e) => setField({ ...field, value: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-4 pr-10 text-sm text-neutral-800 placeholder-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <button
            type="button"
            onClick={() => setField({ ...field, visible: !field.visible })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            {field.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary-50 p-2.5">
          <KeyRound className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Change Password</h3>
          <p className="text-sm text-neutral-500">Update your account password</p>
        </div>
      </div>

      <div className="mx-auto max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
          {renderField('Current Password', currentPassword, setCurrentPassword, 'current-password')}
          {renderField('New Password', newPassword, setNewPassword, 'new-password')}
          {renderField('Confirm New Password', confirmPassword, setConfirmPassword, 'confirm-password')}

          {newPassword.value.length > 0 && newPassword.value.length < 8 && (
            <p className="text-xs text-amber-600">Password must be at least 8 characters.</p>
          )}

          {confirmPassword.value.length > 0 && !passwordsMatch && (
            <p className="text-xs text-red-600">Passwords do not match.</p>
          )}

          {status === 'error' && (
            <p className="text-xs text-red-600">{errorMessage || 'An error occurred. Please try again.'}</p>
          )}

          {status === 'success' && (
            <p className="text-xs text-emerald-600">Password updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={!isValid || status === 'submitting'}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
