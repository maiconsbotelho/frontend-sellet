'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import AddButton from '@/components/shared/addButton';
import CrudModal from '@/components/shared/crudModal/crudModal';
import type { FormField } from '@/components/shared/crudModal/crudModal';

// Types
export type Client = {
  id: number;
  nome_completo: string;
  email: string;
  password?: string;
  telefone?: string | null;
  cpf?: string | null;
  cep?: string | null;
  rua?: string | null;
  numero_casa?: string | null;
  cidade?: string | null;
  uf?: string | null;
  tipo?: string;
};

const initialFormState: Partial<Client> = {
  email: '',
  nome_completo: '',
  password: '',
  telefone: '',
  cpf: '',
  cep: '',
  rua: '',
  numero_casa: '',
  cidade: '',
  uf: '',
};

export default function ClientesPage() {
  const {
    data: clients,
    isLoading,
    error: apiError,
    fetchData: fetchClientsApi,
    addItem: addClientApi,
    updateItem: updateClientApi,
    deleteItem: deleteClientApi,
    setErrorManually: setApiError,
  } = useApi<Client>({ entityName: 'cliente', entityPath: '/usuario' });

  const [filtered, setFiltered] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [current, setCurrent] = useState<Client | null>(null);
  const [form, setForm] = useState<Record<string, any>>(initialFormState);

  const fetchClients = useCallback(async () => {
    await fetchClientsApi({ tipo: 'CLIENTE' });
  }, [fetchClientsApi]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    setFiltered(
      clients.filter((c) =>
        c.nome_completo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const openAdd = () => {
    setForm(initialFormState);
    setApiError(null);
    setIsAddOpen(true);
  };

  const openEdit = (c: Client) => {
    setCurrent(c);
    setForm({
      email: c.email,
      nome_completo: c.nome_completo,
      password: '', // Password is not pre-filled for editing
      telefone: c.telefone || '',
      cpf: c.cpf || '',
      cep: c.cep || '',
      rua: c.rua || '',
      numero_casa: c.numero_casa || '',
      cidade: c.cidade || '',
      uf: c.uf || '',
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (apiError) setApiError(null); // Clear error on change
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);

    const postData: Partial<Client> = {
      ...form,
      tipo: 'CLIENTE',
      telefone: form.telefone || null,
      cpf: form.cpf || null,
      cep: form.cep || null,
      rua: form.rua || null,
      numero_casa: form.numero_casa || null,
      cidade: form.cidade || null,
      uf: form.uf || null,
    };

    if (!form.password) {
      delete postData.password;
    } else if (form.password.length < 6) {
      setApiError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const newClient = await addClientApi(postData);
    if (newClient) {
      await fetchClients();
      closeModals();
    }
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!current) return;
    setApiError(null);

    const putData: Partial<Client> = {
      email: form.email,
      nome_completo: form.nome_completo,
      tipo: 'CLIENTE', // Ensure type is always set
      telefone: form.telefone || null,
      cpf: form.cpf || null,
      cep: form.cep || null,
      rua: form.rua || null,
      numero_casa: form.numero_casa || null,
      cidade: form.cidade || null,
      uf: form.uf || null,
    };

    // Only include password if it's provided and meets criteria
    if (form.password && form.password.length > 0) {
      if (form.password.length < 6) {
        setApiError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      putData.password = form.password;
    }

    const updated = await updateClientApi(current.id, putData);
    if (updated) {
      await fetchClients();
      closeModals();
    }
  };

  const handleDelete = async () => {
    if (!current) return;
    if (
      !window.confirm(
        `Tem certeza que deseja excluir ${current.nome_completo}?`
      )
    )
      return;
    setApiError(null);
    const success = await deleteClientApi(current.id);
    if (success) {
      await fetchClients();
      closeModals();
    }
  };

  const formFields: FormField[] = [
    {
      name: 'nome_completo',
      label: 'Nome Completo',
      type: 'text',
      required: true,
    },
    { name: 'email', label: 'E-mail', type: 'email', required: true },
    {
      name: 'password',
      label: 'Senha (mín. 6 caracteres)',
      type: 'password',
      // Senha não é obrigatória na edição, apenas se for alterada
    },
    { name: 'telefone', label: 'Telefone', type: 'text' },
    { name: 'cpf', label: 'CPF', type: 'text', maxLength: 11 },
    {
      name: 'addressToggle',
      label: 'Endereço (Opcional)',
      type: 'collapsible-toggle',
      initiallyOpen: false,
    },
    {
      name: 'cep',
      label: 'CEP',
      type: 'text',
      maxLength: 8,
      collapsibleSectionId: 'addressToggle',
    },
    {
      name: 'rua',
      label: 'Rua',
      type: 'text',
      collapsibleSectionId: 'addressToggle',
    },
    {
      name: 'numero_casa',
      label: 'Número',
      type: 'text',
      collapsibleSectionId: 'addressToggle',
    },
    {
      name: 'cidade',
      label: 'Cidade',
      type: 'text',
      collapsibleSectionId: 'addressToggle',
    },
    {
      name: 'uf',
      label: 'UF',
      type: 'text',
      maxLength: 2,
      collapsibleSectionId: 'addressToggle',
    },
  ];

  // Fields for the "Add New Client" modal
  const addFormFields = formFields.map((field) => {
    if (field.name === 'password') {
      return { ...field, required: true }; // Password required for new client
    }
    return field;
  });

  // Fields for the "Edit Client" modal (password not required, only if changing)
  const editFormFields = formFields
    .filter((f) => f.name !== 'password')
    .concat({
      name: 'password',
      label: 'Nova Senha (deixe em branco para não alterar)',
      type: 'password',
    });

  return (
    <div className="p-6 pb-44 w-screen h-screen overscroll-none flex flex-col">
      <div className="flex justify-between mb-12">
        <input
          type="text"
          placeholder="Pesquisar clientes..."
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

      <ul className="flex-1 overflow-y-auto min-h-0 space-y-2 pb-44">
        {isLoading && filtered.length === 0 && (
          <li className="text-center text-gray-500 py-4">
            Carregando clientes...
          </li>
        )}
        {!isLoading && filtered.length === 0 && (
          <li className="text-center text-gray-500 py-4">
            Nenhum cliente encontrado.
          </li>
        )}
        {filtered.map((c) => (
          <li
            key={c.id}
            className="flex justify-between items-center bg-[var(--secondary)] border p-3 rounded border-[var(--primary)]"
          >
            <div>
              <span className="font-medium text-[var(--accent)]">
                {c.nome_completo}
              </span>
              <span className="text-sm text-gray-500 block">{c.email}</span>
            </div>
            <button
              onClick={() => openEdit(c)}
              className="text-[var(--accent)] p-1"
              aria-label={`Editar ${c.nome_completo}`}
            >
              <FaEdit />
            </button>
          </li>
        ))}
      </ul>

      <CrudModal
        title="Novo Cliente"
        isOpen={isAddOpen}
        formData={form}
        formFields={addFormFields}
        onChange={handleChange}
        onClose={closeModals}
        onSubmit={handleAdd}
        error={apiError}
        isLoading={isLoading}
      />

      <CrudModal
        title="Editar Cliente"
        isOpen={isEditOpen}
        formData={form}
        formFields={editFormFields}
        onChange={handleChange}
        onClose={closeModals}
        onSubmit={handleEdit}
        onDelete={handleDelete}
        error={apiError}
        isLoading={isLoading}
      />
    </div>
  );
}
