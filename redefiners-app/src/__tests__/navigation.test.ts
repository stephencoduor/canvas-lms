import { describe, it, expect } from 'vitest'
import { getGlobalNavSections, getCourseNavSections } from '@/lib/navigation'

describe('Navigation', () => {
  describe('getGlobalNavSections', () => {
    it('returns sections with items', () => {
      const sections = getGlobalNavSections()
      expect(sections.length).toBeGreaterThan(0)
      expect(sections[0].items.length).toBeGreaterThan(0)
    })

    it('includes Dashboard as first item', () => {
      const sections = getGlobalNavSections()
      const firstItem = sections[0].items[0]
      expect(firstItem.label).toBe('Dashboard')
      expect(firstItem.href).toBe('/dashboard')
    })

    it('includes Courses item', () => {
      const sections = getGlobalNavSections()
      const allItems = sections.flatMap(s => s.items)
      const courses = allItems.find(i => i.label === 'Courses')
      expect(courses).toBeDefined()
      expect(courses?.href).toBe('/courses')
    })

    it('has Communication section with Messages', () => {
      const sections = getGlobalNavSections()
      const commSection = sections.find(s => s.title?.toLowerCase().includes('communication'))
      expect(commSection).toBeDefined()
      const messages = commSection?.items.find(i => i.label === 'Messages')
      expect(messages).toBeDefined()
      expect(messages?.children?.length).toBeGreaterThan(0)
    })

    it('has admin items with requiredRole', () => {
      const sections = getGlobalNavSections()
      const adminSection = sections.find(s => s.title === 'ADMINISTRATION')
      if (adminSection) {
        const adminItems = adminSection.items.filter(i => i.requiredRole === 'admin')
        expect(adminItems.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getCourseNavSections', () => {
    it('returns course-specific navigation', () => {
      const sections = getCourseNavSections('123')
      expect(sections.length).toBeGreaterThan(0)
    })

    it('includes course nav items (Home, Assignments, etc.)', () => {
      const sections = getCourseNavSections('42')
      const allItems = sections.flatMap(s => s.items)
      const labels = allItems.map(i => i.label)
      expect(labels).toContain('Home')
      expect(labels).toContain('Assignments')
      expect(labels).toContain('Modules')
      expect(labels).toContain('Grades')
    })

    it('uses courseId in hrefs', () => {
      const sections = getCourseNavSections('99')
      const allItems = sections.flatMap(s => s.items)
      const assignments = allItems.find(i => i.label === 'Assignments')
      expect(assignments?.href).toContain('/courses/99/')
    })
  })
})
