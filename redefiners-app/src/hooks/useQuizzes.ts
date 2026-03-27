import { useQuery } from '@tanstack/react-query';
import { listQuizzes, type CanvasQuiz } from '@/services/modules/quizzes';

export function useQuizzes(courseId: number | string) {
  return useQuery<CanvasQuiz[]>({
    queryKey: ['quizzes', courseId],
    queryFn: async () => {
      const response = await listQuizzes(courseId);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
