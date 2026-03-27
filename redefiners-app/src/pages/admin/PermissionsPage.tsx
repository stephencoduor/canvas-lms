import { useAccounts, useRoles } from '@/hooks/useAdmin'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ShieldCheck, Check, X } from 'lucide-react'

const PERMISSION_LABELS: Record<string, string> = {
  manage_courses: 'Manage Courses',
  manage_users: 'Manage Users',
  manage_grades: 'Manage Grades',
  manage_files: 'Manage Files',
  manage_calendar: 'Manage Calendar',
  manage_discussions: 'Manage Discussions',
  manage_assignments: 'Manage Assignments',
  manage_wiki: 'Manage Pages',
  manage_quizzes: 'Manage Quizzes',
  manage_rubrics: 'Manage Rubrics',
  manage_outcomes: 'Manage Outcomes',
  read_reports: 'View Reports',
  manage_account_settings: 'Manage Account Settings',
  manage_role_overrides: 'Manage Permissions',
  view_all_grades: 'View All Grades',
  send_messages: 'Send Messages',
  view_statistics: 'View Statistics',
}

export function PermissionsPage() {
  const { data: accounts } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: roles, isLoading: rolesLoading } = useRoles(accountId)
  const isLoading = rolesLoading

  const permissionKeys = Object.keys(PERMISSION_LABELS)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Permissions</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Manage role-based permissions
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={12} />
      ) : !roles || roles.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          heading="No roles found"
          description="No roles are configured for this account."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Permission
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500"
                  >
                    {role.label || role.role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionKeys.map((perm) => (
                <tr
                  key={perm}
                  className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                >
                  <td className="px-5 py-2.5 text-sm text-neutral-700">
                    {PERMISSION_LABELS[perm]}
                  </td>
                  {roles.map((role) => {
                    const enabled = role.permissions?.[perm]?.enabled ?? false
                    return (
                      <td key={role.id} className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          className={`inline-flex h-5 w-5 items-center justify-center rounded ${
                            enabled
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-neutral-100 text-neutral-300'
                          }`}
                        >
                          {enabled ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
