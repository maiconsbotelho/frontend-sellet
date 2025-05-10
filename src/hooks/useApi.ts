import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiConfig<T> {
  entityName: string;
  entityPath: string;
  initialData?: T[];
}

interface UseApiReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  fetchData: (queryParams?: Record<string, string>) => Promise<void>;
  addItem: (
    itemData: Partial<T>,
    queryParams?: Record<string, string>
  ) => Promise<T | null>;
  updateItem: (
    id: number | string,
    itemData: Partial<T>,
    queryParams?: Record<string, string>
  ) => Promise<T | null>;
  deleteItem: (id: number | string) => Promise<boolean>;
  setErrorManually: (message: string | null) => void;
  clearData: () => void;
}

export default function useApi<T extends { id: number | string }>({
  entityName,
  entityPath,
  initialData = [],
}: ApiConfig<T>): UseApiReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const buildUrl = (
    id?: number | string,
    queryParams?: Record<string, string>
  ) => {
    let url = `${API_BASE_URL}${entityPath}`;
    if (id) url += `/${id}`;
    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }
    if (!id && !queryParams && !url.endsWith('/')) url += '/';
    else if (id && !url.endsWith('/') && !queryParams) url += '/';
    return url;
  };

  const handleApiResponse = async (
    res: Response,
    operation: string
  ): Promise<any> => {
    if (!res.ok) {
      let errorMsg = `HTTP error! status: ${res.status}`;
      try {
        const errorData = await res.json();
        errorMsg += ` - ${JSON.stringify(
          errorData.detail ||
            errorData.message ||
            errorData.non_field_errors?.[0] ||
            errorData
        )}`;
      } catch (jsonError) {
        const textError = await res.text().catch(() => 'Erro ao ler resposta');
        errorMsg += ` - ${textError}`;
      }
      throw new Error(errorMsg);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  const fetchData = useCallback(
    async (queryParams?: Record<string, string>) => {
      setIsLoading(true);
      setError(null);
      try {
        const url = buildUrl(undefined, queryParams);
        const res = await fetch(url, {
          credentials: 'include', // <-- Essencial para cookies JWT
        });
        const resultData = await handleApiResponse(
          res,
          `buscar ${entityName}s`
        );
        setData(resultData || []);
      } catch (err: any) {
        console.error(`Erro ao buscar ${entityName}s:`, err);
        setError(
          `Falha ao buscar ${entityName}s: ${
            err.message || 'Erro desconhecido'
          }`
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [entityName, entityPath]
  );

  const addItem = useCallback(
    async (itemData: Partial<T>, queryParams?: Record<string, string>) => {
      setIsLoading(true);
      setError(null);
      try {
        const url = buildUrl(undefined, queryParams);
        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const newItem = await handleApiResponse(res, `adicionar ${entityName}`);
        if (newItem?.id) {
          setData((prev) => [newItem, ...prev]);
        }
        return newItem;
      } catch (err: any) {
        console.error(`Erro ao adicionar ${entityName}:`, err);
        setError(
          `Falha ao adicionar ${entityName}: ${
            err.message || 'Erro desconhecido'
          }`
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [entityName, entityPath]
  );

  const updateItem = useCallback(
    async (
      id: number | string,
      itemData: Partial<T>,
      queryParams?: Record<string, string>
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const url = buildUrl(id, queryParams);
        const res = await fetch(url, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const updatedItem = await handleApiResponse(
          res,
          `atualizar ${entityName}`
        );
        if (updatedItem?.id) {
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ...updatedItem } : item
            )
          );
        }
        return updatedItem;
      } catch (err: any) {
        console.error(`Erro ao atualizar ${entityName}:`, err);
        setError(
          `Falha ao atualizar ${entityName}: ${
            err.message || 'Erro desconhecido'
          }`
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [entityName, entityPath]
  );

  const deleteItem = useCallback(
    async (id: number | string) => {
      setIsLoading(true);
      setError(null);
      try {
        const url = buildUrl(id);
        const res = await fetch(url, {
          method: 'DELETE',
          credentials: 'include',
        });
        await handleApiResponse(res, `excluir ${entityName}`);
        setData((prev) => prev.filter((item) => item.id !== id));
        return true;
      } catch (err: any) {
        console.error(`Erro ao excluir ${entityName}:`, err);
        setError(
          `Falha ao excluir ${entityName}: ${
            err.message || 'Erro desconhecido'
          }`
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [entityName, entityPath]
  );

  const setErrorManually = useCallback((message: string | null) => {
    setError(message);
  }, []);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    setErrorManually,
    clearData,
  };
}
