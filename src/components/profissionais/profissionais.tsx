'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Import icons

// Define a type for the professional object
type Profissional = {
  id: number;
  nome_completo: string;
  email: string;
};

// Define the base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export default function ProfissionaisPage() {
  const [professionals, setProfessionals] = useState<Profissional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<
    Profissional[]
  >([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProfessional, setCurrentProfessional] =
    useState<Profissional | null>(null);
  const [form, setForm] = useState({
    email: '',
    nome_completo: '',
    password: '', // Password only needed for adding
  });
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    setFilteredProfessionals(
      professionals.filter((p) =>
        p.nome_completo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, professionals]);

  const fetchProfessionals = async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/?tipo=PROFISSIONAL`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProfessionals(data);
      // Initialize filtered list after fetching
      setFilteredProfessionals(data);
    } catch (err: any) {
      console.error('Failed to fetch professionals:', err);
      setError(
        `Falha ao buscar profissionais: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setForm({ email: '', nome_completo: '', password: '' });
    setError(null);
    setCurrentProfessional(null);
    setIsAddOpen(true);
    setIsEditOpen(false);
  };

  const openEditModal = (professional: Profissional) => {
    setCurrentProfessional(professional);
    // Password is not needed/fetched for editing, keep it empty
    setForm({
      email: professional.email,
      nome_completo: professional.nome_completo,
      password: '',
    });
    setError(null);
    setIsEditOpen(true);
    setIsAddOpen(false);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setIsEditOpen(false);
    setCurrentProfessional(null);
    setError(null); // Clear errors when closing modals
    setForm({ email: '', nome_completo: '', password: '' }); // Reset form
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProfessional = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true); // Indicate loading state

    // Basic validation
    if (!form.email || !form.nome_completo || !form.password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/usuario/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tipo: 'PROFISSIONAL' }), // Set type explicitly
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to add professional:', err);
      setError(
        `Falha ao adicionar profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfessional = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!currentProfessional) return;
    setError(null);
    setIsLoading(true);

    // Basic validation
    if (!form.email || !form.nome_completo) {
      setError('Por favor, preencha nome e email.');
      setIsLoading(false);
      return;
    }

    // Prepare payload - exclude password
    const payload = {
      email: form.email,
      nome_completo: form.nome_completo,
      tipo: 'PROFISSIONAL', // Ensure type is maintained
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/usuario/${currentProfessional.id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close modal on success
    } catch (err: any) {
      console.error('Failed to edit professional:', err);
      setError(
        `Falha ao editar profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfessional = async (professional: Profissional) => {
    if (!professional) return;

    if (
      !window.confirm(
        `Tem certeza que deseja excluir o profissional "${professional.nome_completo}"?`
      )
    ) {
      return; // Stop if user cancels
    }

    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/usuario/${professional.id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({})); // Try to parse error response
        throw new Error(
          `HTTP error! status: ${res.status} - ${JSON.stringify(errorData)}`
        );
      }
      await fetchProfessionals(); // Fetch updated list
      closeModals(); // Close any open modal after deletion
    } catch (err: any) {
      console.error('Failed to delete professional:', err);
      setError(
        `Falha ao excluir profissional: ${err.message || 'Erro desconhecido'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gerenciar Profissionais
      </h1>

      {/* Error Display Area */}
      {error && !isAddOpen && !isEditOpen && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Buscar profissional..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-1/3"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out flex items-center" // Added flex and items-center
          disabled={isLoading}
          aria-label="Adicionar novo profissional" // Added aria-label
        >
          <FaPlus className="mr-2" /> {/* Added icon */}
          Adicionar Profissional
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <p className="text-center text-gray-500">Carregando profissionais...</p>
      )}

      {/* Professionals Table */}
      {!isLoading && filteredProfessionals.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          Nenhum profissional encontrado.
        </p>
      )}
      {!isLoading && filteredProfessionals.length > 0 && (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nome Completo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfessionals.map((professional) => (
                <tr key={professional.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {professional.nome_completo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {professional.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {' '}
                    {/* Added space-x-2 */}
                    <button
                      onClick={() => openEditModal(professional)}
                      className="text-indigo-600 hover:text-indigo-900 p-1 transition duration-150 ease-in-out disabled:opacity-50" // Adjusted styling
                      disabled={isLoading}
                      aria-label={`Editar ${professional.nome_completo}`} // Added aria-label
                    >
                      <FaEdit size={18} /> {/* Replaced text with icon */}
                    </button>
                    <button
                      onClick={() => handleDeleteProfessional(professional)}
                      className="text-red-600 hover:text-red-900 p-1 transition duration-150 ease-in-out disabled:opacity-50" // Adjusted styling
                      disabled={isLoading}
                      aria-label={`Excluir ${professional.nome_completo}`} // Added aria-label
                    >
                      <FaTrash size={18} /> {/* Replaced text with icon */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Professional Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Adicionar Novo Profissional
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleAddProfessional}>
              <div className="mb-4">
                <label
                  htmlFor="nome_completo_add"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome_completo_add"
                  name="nome_completo"
                  value={form.nome_completo}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email_add"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email_add"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password_add"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password_add"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Professional Modal */}
      {isEditOpen && currentProfessional && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Editar Profissional
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleEditProfessional}>
              <div className="mb-4">
                <label
                  htmlFor="nome_completo_edit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome_completo_edit"
                  name="nome_completo"
                  value={form.nome_completo}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email_edit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email_edit"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {/* Password field is intentionally omitted for editing */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModals}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
