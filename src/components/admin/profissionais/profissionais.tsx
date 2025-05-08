'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '@/hooks/useApi';
import AddButton from '@/components/shared/addButton';
import CrudModal, { FormField } from '@/components/shared/crudModal/crudModal';

type Profissional = {
  id: number;
  nome_completo: string;
  email: string;
  password?: string;
  tipo?: string;
};

export default function ProfissionaisPage() {
  const {
    data: professionals,
    isLoading,
    error: apiError,
    fetchData: fetchProfessionalsApi,
    addItem: addProfessionalApi,
    updateItem: updateProfessionalApi,
    deleteItem: deleteProfessionalApi,
    setErrorManually: setApiError,
  } = useApi<Profissional>({
    entityName: 'profissional',
    entityPath: '/usuario',
  });

  const [filtered, setFiltered] = useState<Profissional[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [current, setCurrent] = useState<Profissional | null>(null);
  const [form, setForm] = useState({
    email: '',
    nome_completo: '',
    password: '',
  });

  const formFields: FormField[] = [
    {
      name: 'nome_completo',
      label: 'Nome Completo',
      type: 'text',
      required: true,
    },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    { name: 'password', label: 'Senha', type: 'password' },
  ];

  const fetchProfessionals = useCallback(async () => {
    await fetchProfessionalsApi({ tipo: 'PROFISSIONAL' });
  }, [fetchProfessionalsApi]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  useEffect(() => {
    setFiltered(
      professionals.filter((p) =>
        p.nome_completo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, professionals]);

  const openAdd = () => {
    setForm({ email: '', nome_completo: '', password: '' });
    setApiError(null);
    setIsAddOpen(true);
  };

  const openEdit = (p: Profissional) => {
    setCurrent(p);
    setForm({
      email: p.email,
      nome_completo: p.nome_completo,
      password: '',
    });
    setApiError(null);
    setIsEditOpen(true);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrent(null);
    setApiError(null);
    setForm({ email: '', nome_completo: '', password: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const postData: Partial<Profissional> = {
      ...form,
      tipo: 'PROFISSIONAL',
    };

    if (!form.password) delete postData.password;

    const newProf = await addProfessionalApi(postData);
    if (newProf) {
      await fetchProfessionals();
      closeModals();
      toast.success('Profissional cadastrado com sucesso!');
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current) return;
    setApiError(null);

    const putData = {
      email: form.email,
      nome_completo: form.nome_completo,
      tipo: 'PROFISSIONAL',
    };

    const updated = await updateProfessionalApi(current.id, putData);
    if (updated) {
      await fetchProfessionals();
      closeModals();
      toast.success('Profissional atualizado com sucesso!');
    }
  };

  const handleDelete = async () => {
    if (!current) return;

    if (
      !window.confirm(
        `Tem certeza que deseja excluir o profissional "${current.nome_completo}"?`
      )
    ) {
      return;
    }

    setApiError(null);
    const success = await deleteProfessionalApi(current.id);
    if (success) {
      await fetchProfessionals();
      closeModals();
      toast.success('Profissional excluído com sucesso!');
    }
  };

  return (
    <div className="p-6 w-screen">
      <div className="flex justify-between mb-12">
        <input
          type="text"
          placeholder="Pesquisar profissionais..."
          className="border px-3 py-2 flex-grow mr-4 text-[var(--text-secondary)] bg-white border-[var(--border-primary)] rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <AddButton onClick={openAdd} disabled={isLoading} />
      </div>

      {apiError && !isAddOpen && !isEditOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span>{apiError}</span>
        </div>
      )}

      <ul className="space-y-2">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-[var(--secondary)] border p-3 rounded border-[var(--primary)]"
            >
              <div>
                <span className="font-medium">{p.nome_completo}</span>
                <span className="text-sm text-gray-500 block">{p.email}</span>
              </div>
              <button
                onClick={() => openEdit(p)}
                className="text-[var(--accent)] p-1"
                aria-label={`Editar ${p.nome_completo}`}
              >
                <FaEdit />
              </button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500 py-4">
            Nenhum profissional encontrado.
          </li>
        )}
      </ul>

      <CrudModal
        title="Novo Profissional"
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
        title="Editar Profissional"
        isOpen={isEditOpen}
        formData={form}
        formFields={formFields.filter((f) => f.name !== 'password')}
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
