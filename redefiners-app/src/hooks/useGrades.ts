import { useQuery } from '@tanstack/react-query';
import {
  getEnrollments,
  getAssignmentGroupsWithGrades,
} from '@/services/modules/grades';
import type { CanvasAssignmentGroup, CanvasEnrollment } from '@/types/canvas';

export function useGrades(courseId: number | string) {
  const enrollmentsQuery = useQuery<CanvasEnrollment[]>({
    queryKey: ['grades', 'enrollments', courseId],
    queryFn: async () => {
      const response = await getEnrollments(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });

  const assignmentGroupsQuery = useQuery<CanvasAssignmentGroup[]>({
    queryKey: ['grades', 'assignmentGroups', courseId],
    queryFn: async () => {
      const response = await getAssignmentGroupsWithGrades(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });

  return {
    enrollments: enrollmentsQuery,
    assignmentGroups: assignmentGroupsQuery,
    isLoading: enrollmentsQuery.isLoading || assignmentGroupsQuery.isLoading,
    isError: enrollmentsQuery.isError || assignmentGroupsQuery.isError,
  };
}
