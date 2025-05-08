'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'textarea'
    | 'checkbox-multiple';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  maxLength?: number;
}

interface CrudModalProps {
  title: string;
  isOpen: boolean;
  formData: Record<string, any>;
  formFields: FormField[];
  onChange: (e: React.ChangeEvent<any>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function CrudModal({
  title,
  isOpen,
  formData,
  formFields,
  onChange,
  onClose,
  onSubmit,
  onDelete,
  isLoading,
  error,
}: CrudModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-[80px] left-0 right-0  pb-[80px]  bg-opacity-50 flex items-center justify-center z-20 overflow-y-auto">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-lg text-black"
      >
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
            <span className="block sm:inline whitespace-pre-line">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {formFields.map((field) => {
            if (field.type === 'checkbox-multiple') {
              return (
                <div key={field.name} className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <div className="border rounded p-2 max-h-32 overflow-y-auto">
                    {field.options?.map((opt) => (
                      <div key={opt.value} className="flex items-center mb-1">
                        <input
                          type="checkbox"
                          name={field.name}
                          value={opt.value}
                          checked={formData[field.name]?.includes(opt.value)}
                          onChange={onChange}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-900">
                          {opt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const isTextArea = field.type === 'textarea';

            return (
              <div key={field.name} className="col-span-1">
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                {isTextArea ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={onChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={onChange}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700"
              disabled={isLoading}
            >
              <FaTrash className="mr-2" /> Excluir
            </button>
          )}
          <div className="space-x-2 ml-auto pb-16 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
