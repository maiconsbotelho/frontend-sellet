'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import AddButton from '@/components/shared/addButton';
import CrudModal, { FormField } from '@/components/shared/crudModal/crudModal';

type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  duracao?: string;
  preco: number;
  profissionais?: number[];
};

type Profissional = {
  id: number;
  nome_completo: string;
  email: string;
};

export default function ServicosPage() {
  const {
    data: servicos,
    isLoading,
    error: apiError,
    fetchData: fetchServicosApi,
    addItem: addServicoApi,
    updateItem: updateServicoApi,
    deleteItem: deleteServicoApi,
    setErrorManually: setApiError,
  } = useApi<Servico>({
    entityName: 'serviço',
    entityPath: '/servicos',
  });

  const { data: professionals, fetchData: fetchProfessionalsApi } =
    useApi<Profissional>({
      entityName: 'profissional',
      entityPath: '/usuario',
    });

  const [filtered, setFiltered] = useState<Servico[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [current, setCurrent] = useState<Servico | null>(null);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    duracao: '',
    preco: 0,
    profissionais: [] as number[],
  });

  const fetchServicos = useCallback(async () => {
    await fetchServicosApi();
  }, [fetchServicosApi]);

  const fetchProfessionals = useCallback(async () => {
    await fetchProfessionalsApi({ tipo: 'PROFISSIONAL' });
  }, [fetchProfessionalsApi]);

  useEffect(() => {
    fetchServicos();
    fetchProfessionals();
  }, [fetchServicos, fetchProfessionals]);

  useEffect(() => {
    setFiltered(
      servicos.filter((s) =>
        s.nome.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, servicos]);

  const formFields: FormField[] = [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'descricao', label: 'Descrição', type: 'textarea' },
    { name: 'duracao', label: 'Duração (HH:MM:SS)', type: 'text' },
    { name: 'preco', label: 'Preço', type: 'text', required: true },
    {
      name: 'profissionais',
      label: 'Profissionais',
      type: 'checkbox-multiple',
      options: professionals.map((p) => ({
        label: p.nome_completo,
        value: p.id,
      })),
    },
  ];

  const openAdd = () => {
    setForm({
      nome: '',
      descricao: '',
      duracao: '',
      preco: 0,
      profissionais: [],
    });
    setApiError(null);
    setIsAddOpen(true);
  };

  const openEdit = (s: Servico) => {
    setCurrent(s);
    setForm({
      nome: s.nome,
      descricao: s.descricao || '',
      duracao: s.duracao || '',
      preco: s.preco,
      profissionais: s.profissionais || [],
    });
    setApiError(null);
    setIsEditOpen(true);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrent(null);
    setApiError(null);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, type, value, checked } = e.target;

    if (type === 'checkbox' && name === 'profissionais') {
      const id = parseInt(value);
      setForm((prev) => ({
        ...prev,
        profissionais: checked
          ? [...prev.profissionais, id]
          : prev.profissionais.filter((pid) => pid !== id),
      }));
    } else if (name === 'preco') {
      setForm((prev) => ({ ...prev, preco: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const newItem = await addServicoApi({
      ...form,
      preco: form.preco || 0,
    });
    if (newItem) {
      await fetchServicos();
      closeModals();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current) return;
    setApiError(null);

    const updated = await updateServicoApi(current.id, {
      ...form,
      preco: form.preco,
    });
    if (updated) {
      await fetchServicos();
      closeModals();
    }
  };

  const handleDelete = async () => {
    if (!current) return;
    if (!confirm(`Excluir o serviço "${current.nome}"?`)) return;

    setApiError(null);
    const success = await deleteServicoApi(current.id);
    if (success) {
      await fetchServicos();
      closeModals();
    }
  };

  const formatCurrency = (value: string | number) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return 'N/A';
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="p-6 w-screen">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Pesquisar serviços..."
          className="border px-3 py-2 flex-grow mr-4 text-[var(--text-secondary)] bg-white border-[var(--border-primary)] rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <AddButton onClick={openAdd} disabled={isLoading} />
      </div>

      {apiError && !isAddOpen && !isEditOpen && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span>{apiError}</span>
        </div>
      )}

      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center bg-[var(--secondary)] border p-3 rounded border-[var(--primary)]"
            >
              <div>
                <span className="font-medium">{s.nome}</span>
                <span className="text-sm text-gray-500 block">
                  Preço: {formatCurrency(s.preco)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(s)}
                  className="text-[var(--accent)] p-1"
                  aria-label={`Editar ${s.nome}`}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => {
                    setCurrent(s);
                    handleDelete();
                  }}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label={`Excluir ${s.nome}`}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            Nenhum serviço encontrado.
          </li>
        )}
      </ul>

      <CrudModal
        title="Novo Serviço"
        isOpen={isAddOpen}
        formData={form}
        formFields={formFields}
        onChange={handleChange}
        onClose={closeModals}
        onSubmit={handleAdd}
        isLoading={isLoading}
        error={apiError}
      />

      <CrudModal
        title="Editar Serviço"
        isOpen={isEditOpen}
        formData={form}
        formFields={formFields}
        onChange={handleChange}
        onClose={closeModals}
        onSubmit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        error={apiError}
      />
    </div>
  );
}
