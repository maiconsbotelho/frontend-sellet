'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

// ... (Types: Servico, Profissional remain the same) ...
type Servico = {
  id: number;
  nome: string;
  descricao?: string;
  duracao?: string; // Format like "HH:MM:SS"
  preco: string;
  profissionais?: number[]; // Array of professional IDs
};

type Profissional = {
  id: number;
  nome_completo: string;
  email: string; // Or other relevant fields
};

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:8000/api';

// Initial form state
const initialFormState = {
  nome: '',
  descricao: '',
  duracao: '', // Expecting "HH:MM:SS" format
  preco: '',
  profissionais: [] as number[], // Initialize as empty array of numbers
};

export default function ServicosPage() {
  // ... (State variables: servicos, filteredServicos, allProfessionals, search, isLoading, error, isAddOpen, isEditOpen, currentServico, form remain the same) ...
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Profissional[]>([]); // State for professionals list
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentServico, setCurrentServico] = useState<Servico | null>(null);
  const [form, setForm] = useState(initialFormState);

  // ... (useEffect hooks for fetching data remain the same) ...
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors before fetching
      await Promise.all([fetchServicos(), fetchProfessionals()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredServicos(
      servicos.filter((s) =>
        s.nome.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, servicos]);

  // ... (fetchServicos, fetchProfessionals remain the same) ...
  const fetchServicos = async () => {
    // Removed setIsLoading/setError from here as it's handled in the combined fetch
    try {
      const res = await fetch(`${API_BASE_URL}/servicos/`);
      if (!res.ok) {
        // ... (error handling as before)
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          errorMsg += ` - ${await res
            .text()
            .catch(() => 'Could not read response text')}`;
        }
        throw new Error(errorMsg);
      }
      const data: Servico[] = await res.json();
      setServicos(data);
      setFilteredServicos(data);
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      setError((prev) =>
        prev
          ? `${prev}\nFalha ao buscar serviços: ${
              err.message || 'Erro desconhecido'
            }`
          : `Falha ao buscar serviços: ${err.message || 'Erro desconhecido'}`
      );
    }
  };

  // Function to fetch professionals
  const fetchProfessionals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`);
      if (!res.ok) {
        let errorMsg = `HTTP error fetching professionals! status: ${res.status}`;
        // ... (similar error handling)
        try {
          const errorData = await res.json();
          errorMsg += ` - ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          errorMsg += ` - ${await res
            .text()
            .catch(() => 'Could not read response text')}`;
        }
        throw new Error(errorMsg);
      }
      const data: Profissional[] = await res.json();
      setAllProfessionals(data);
    } catch (err: any) {
      console.error('Failed to fetch professionals:', err);
      setError((prev) =>
        prev
          ? `${prev}\nFalha ao buscar profissionais: ${
              err.message || 'Erro desconhecido'
            }`
          : `Falha ao buscar profissionais: ${
              err.message || 'Erro desconhecido'
            }`
      );
    }
  };

  // ... (Modal Handlers: openAddModal, openEditModal, closeModals remain the same) ...
  const openAddModal = () => {
    setForm(initialFormState); // Reset form including professionals
    setCurrentServico(null);
    setError(null);
    setIsAddOpen(true);
    setIsEditOpen(false);
  };

  const openEditModal = (servico: Servico) => {
    setCurrentServico(servico);
    setForm({
      nome: servico.nome || '',
      descricao: servico.descricao || '',
      duracao: servico.duracao || '',
      preco: servico.preco || '',
      profissionais: servico.profissionais || [], // Populate with current professional IDs
    });
    setError(null);
    setIsEditOpen(true);
    setIsAddOpen(false);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrentServico(null);
    setError(null);
  };

  // Updated handleChange to handle checkboxes for professionals
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox' && name === 'profissionais') {
      const checkbox = e.target as HTMLInputElement;
      const profId = parseInt(checkbox.value, 10);
      setForm((prevForm) => {
        const currentProfissionais = prevForm.profissionais || [];
        if (checkbox.checked) {
          // Add ID if checked and not already present
          return {
            ...prevForm,
            profissionais: [...currentProfissionais, profId],
          };
        } else {
          // Remove ID if unchecked
          return {
            ...prevForm,
            profissionais: currentProfissionais.filter((id) => id !== profId),
          };
        }
      });
    } else if (
      name === 'profissionais' &&
      e.target instanceof HTMLSelectElement
    ) {
      // Keep handling for select if you ever switch back (though checkboxes are used now)
      const selectedOptions = Array.from(e.target.selectedOptions);
      const selectedIds = selectedOptions.map((option) =>
        parseInt(option.value, 10)
      );
      setForm((prevForm) => ({ ...prevForm, [name]: selectedIds }));
    } else {
      // Handle regular inputs/textarea
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  // ... (CRUD Handlers: handleAddServico, handleEditServico, handleDeleteServico remain the same, they already use form.profissionais) ...
  const handleAddServico = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    const durationRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (form.duracao && !durationRegex.test(form.duracao)) {
      setError('Formato de duração inválido. Use HH:MM:SS.');
      return;
    }
    if (!form.profissionais || form.profissionais.length === 0) {
      // Check if professionals array is empty
      setError('Selecione pelo menos um profissional.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/servicos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form, // Includes selected professionals from form state
          preco: parseFloat(form.preco) || 0,
        }),
      });
      if (!res.ok) {
        // ... (error handling as before)
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        let backendError = JSON.stringify(errorData);
        if (typeof errorData === 'object' && errorData !== null) {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            backendError = `${firstKey}: ${errorData[firstKey][0]}`;
          }
        }
        throw new Error(`HTTP error! status: ${res.status} - ${backendError}`);
      }
      await fetchServicos();
      closeModals();
    } catch (err: any) {
      console.error('Failed to add service:', err);
      setError(
        `Falha ao adicionar serviço: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditServico = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentServico) return;
    setError(null);

    // Validation
    const durationRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (form.duracao && !durationRegex.test(form.duracao)) {
      setError('Formato de duração inválido. Use HH:MM:SS.');
      return;
    }
    if (!form.profissionais || form.profissionais.length === 0) {
      // Check if professionals array is empty
      setError('Selecione pelo menos um profissional.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/servicos/${currentServico.id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form, // Send updated form fields, including professionals
            preco: parseFloat(form.preco) || 0,
          }),
        }
      );
      if (!res.ok) {
        // ... (error handling as before)
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchServicos();
      closeModals();
    } catch (err: any) {
      console.error('Failed to edit service:', err);
      setError(
        `Falha ao editar serviço: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteServico = async (servico: Servico) => {
    // ... (delete logic remains the same)
    if (isEditOpen && currentServico && currentServico.id === servico.id) {
      closeModals();
    }
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o serviço "${servico.nome}"?`
      )
    ) {
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/servicos/${servico.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const errorData = await res
          .json()
          .catch(() => ({ message: 'Could not parse error JSON' }));
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchServicos();
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      setError(
        `Falha ao excluir serviço: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ... (formatCurrency helper remains the same) ...
  const formatCurrency = (value: string | number) => {
    // ... (remains the same)
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) {
      return 'N/A';
    }
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="p-6">
      {/* ... (Search, Add Button, Loading, General Error Display remain the same) ... */}
      <div className="flex justify-between mb-4">
        {/* ... (input and add button remain the same) ... */}
        <input
          type="text"
          placeholder="Pesquisar serviços..."
          className="border px-3 py-2 rounded flex-grow mr-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 disabled:opacity-50"
          aria-label="Adicionar novo serviço"
          disabled={isLoading}
        >
          <FaPlus className="mr-2" /> ADD
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="text-center py-4">Carregando...</div>}

      {/* General Error Display */}
      {error && !isAddOpen && !isEditOpen && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline whitespace-pre-line">{error}</span>{' '}
          {/* Allow newlines in error */}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
      )}

      {/* ... (Service List rendering remains the same) ... */}
      {!isLoading && ( // Show list container even if error occurred, but list might be empty
        <ul className="space-y-2">
          {!error && filteredServicos.length > 0 ? ( // Only map if no error and items exist
            filteredServicos.map((s) => (
              <li
                key={s.id}
                className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
              >
                {/* ... (service info display remains the same) ... */}
                <div>
                  <span className="font-medium">{s.nome}</span>
                  <span className="text-sm text-gray-700 block">
                    Preço: {formatCurrency(s.preco)}
                  </span>
                  {s.duracao && (
                    <span className="text-xs text-gray-500 block">
                      Duração: {s.duracao}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50"
                    aria-label={`Editar ${s.nome}`}
                    disabled={isLoading}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteServico(s)}
                    className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                    aria-label={`Excluir ${s.nome}`}
                    disabled={isLoading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          ) : // Show appropriate message if no error but list is empty
          !error && servicos.length === 0 ? (
            <li className="text-center text-gray-500 py-4">
              Nenhum serviço cadastrado.
            </li>
          ) : (
            // Show only if no error and search yielded no results
            !error && (
              <li className="text-center text-gray-500 py-4">
                Nenhum serviço encontrado para "{search}".
              </li>
            )
          )}
        </ul>
      )}

      {/* ADD MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <form
            onSubmit={handleAddServico}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black my-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Novo Serviço</h2>
            {/* ... (Modal Error display) ... */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {/* ... (nome, descricao, duracao, preco inputs) ... */}
            <div className="mb-3">
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="mb-3">
              <label
                htmlFor="duracao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duração (HH:MM:SS)
              </label>
              <input
                id="duracao"
                name="duracao"
                type="text"
                value={form.duracao}
                onChange={handleChange}
                placeholder="ex: 01:30:00"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="\d{2}:\d{2}:\d{2}"
                title="Use o formato HH:MM:SS"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="preco"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preço (R$)
              </label>
              <input
                id="preco"
                name="preco"
                type="number"
                value={form.preco}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="ex: 50.00"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Professionals Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissionais
              </label>
              <div className="border rounded p-2 max-h-32 overflow-y-auto">
                {' '}
                {/* Scrollable container */}
                {allProfessionals.length === 0 &&
                  !error && ( // Show loading only if no error occurred fetching pros
                    <p className="text-gray-500 text-sm">Carregando...</p>
                  )}
                {allProfessionals.length === 0 &&
                  error && ( // Show error if fetching pros failed
                    <p className="text-red-500 text-sm">
                      Erro ao carregar profissionais.
                    </p>
                  )}
                {allProfessionals.map((prof) => (
                  <div key={prof.id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`add-prof-${prof.id}`}
                      name="profissionais"
                      value={prof.id}
                      checked={form.profissionais.includes(prof.id)} // Check if ID is in the form state array
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`add-prof-${prof.id}`}
                      className="text-sm text-gray-900"
                    >
                      {prof.nome_completo}
                    </label>
                  </div>
                ))}
              </div>
              {/* Simple validation message display */}
              {form.profissionais.length === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  Selecione pelo menos um profissional.
                </p>
              )}
            </div>

            {/* ... (Action Buttons: Cancel, Save) ... */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && currentServico && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <form
            onSubmit={handleEditServico}
            className="bg-white p-6 rounded shadow-lg w-full max-w-md text-black my-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Editar Serviço</h2>
            {/* ... (Modal Error display) ... */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-3"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {/* ... (nome, descricao, duracao, preco inputs) ... */}
            <div className="mb-3">
              <label
                htmlFor="edit-nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome
              </label>
              <input
                id="edit-nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="edit-descricao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descrição
              </label>
              <textarea
                id="edit-descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div className="mb-3">
              <label
                htmlFor="edit-duracao"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Duração (HH:MM:SS)
              </label>
              <input
                id="edit-duracao"
                name="duracao"
                type="text"
                value={form.duracao}
                onChange={handleChange}
                placeholder="ex: 01:30:00"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                pattern="\d{2}:\d{2}:\d{2}"
                title="Use o formato HH:MM:SS"
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="edit-preco"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preço (R$)
              </label>
              <input
                id="edit-preco"
                name="preco"
                type="number"
                value={form.preco}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="ex: 50.00"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Professionals Checkboxes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profissionais
              </label>
              <div className="border rounded p-2 max-h-32 overflow-y-auto">
                {' '}
                {/* Scrollable container */}
                {allProfessionals.length === 0 && !error && (
                  <p className="text-gray-500 text-sm">Carregando...</p>
                )}
                {allProfessionals.length === 0 && error && (
                  <p className="text-red-500 text-sm">
                    Erro ao carregar profissionais.
                  </p>
                )}
                {allProfessionals.map((prof) => (
                  <div key={prof.id} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`edit-prof-${prof.id}`}
                      name="profissionais"
                      value={prof.id}
                      checked={form.profissionais.includes(prof.id)} // Check if ID is in the form state array
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`edit-prof-${prof.id}`}
                      className="text-sm text-gray-900"
                    >
                      {prof.nome_completo}
                    </label>
                  </div>
                ))}
              </div>
              {form.profissionais.length === 0 && (
                <p className="text-xs text-red-600 mt-1">
                  Selecione pelo menos um profissional.
                </p>
              )}
            </div>

            {/* ... (Action Buttons: Cancel, Save Changes) ... */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
