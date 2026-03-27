import { useQuery } from '@tanstack/react-query';
import {
  listAssignments,
  getAssignment,
  getAssignmentGroups,
} from '@/services/modules/assignments';
import type { CanvasAssignment, CanvasAssignmentGroup } from '@/types/canvas';

export function useAssignments(courseId: number | string) {
  return useQuery<CanvasAssignment[]>({
    queryKey: ['assignments', courseId],
    queryFn: async () => {
      const response = await listAssignments(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}

export function useAssignment(courseId: number | string, assignmentId: number | string) {
  return useQuery<CanvasAssignment>({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: async () => {
      const response = await getAssignment(courseId, assignmentId);
      return response.data;
    },
    enabled: !!courseId && !!assignmentId,
  });
}

export function useAssignmentGroups(courseId: number | string) {
  return useQuery<CanvasAssignmentGroup[]>({
    queryKey: ['assignmentGroups', courseId],
    queryFn: async () => {
      const response = await getAssignmentGroups(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}
