import { useQuery } from '@tanstack/react-query';
import { listFilesInFolder, listFolders } from '@/services/modules/files';
import type { CanvasFile, CanvasFolder } from '@/types/canvas';

export function useFiles(courseId: number | string, folderId: number | string) {
  const filesQuery = useQuery<CanvasFile[]>({
    queryKey: ['files', courseId, folderId],
    queryFn: async () => {
      const response = await listFilesInFolder(courseId, folderId);
      return response.data;
    },
    enabled: !!courseId && !!folderId,
  });

  const foldersQuery = useQuery<CanvasFolder[]>({
    queryKey: ['folders', courseId, folderId],
    queryFn: async () => {
      const response = await listFolders(courseId, folderId);
      return response.data;
    },
    enabled: !!courseId && !!folderId,
  });

  return {
    files: filesQuery,
    folders: foldersQuery,
    isLoading: filesQuery.isLoading || foldersQuery.isLoading,
    isError: filesQuery.isError || foldersQuery.isError,
  };
}
