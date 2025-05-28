'use client';

import { FaTrash, FaChevronDown, FaChevronUp, FaSave } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export interface FormField {
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'textarea'
    | 'checkbox-multiple'
    | 'collapsible-toggle';
  required?: boolean;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  maxLength?: number;
  initiallyOpen?: boolean; // For 'collapsible-toggle'
  collapsibleSectionId?: string; // For fields controlled by a toggle
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
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (isOpen) {
      const initialStates: Record<string, boolean> = {};
      formFields.forEach((field) => {
        if (field.type === 'collapsible-toggle' && field.name) {
          initialStates[field.name] = !!field.initiallyOpen;
        }
      });
      setOpenCollapsibles(initialStates);
    }
  }, [isOpen, formFields]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-[50px] inset-0 pb-[80px] bg-white bg-opacity-50 flex items-center justify-center z-20 ">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded w-full max-w-lg text-black my-8 max-h-[calc(100vh-160px)] overflow-y-auto" // Added my-8 for scroll margin
      >
        <h2 className="text-xl font-semibold text-[var(--accent)] mb-4">
          {title}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
            <span className="block sm:inline whitespace-pre-line">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {formFields.map((field) => {
            if (field.type === 'collapsible-toggle') {
              return (
                <div key={field.name} className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCollapsibles((prev) => ({
                        ...prev,
                        [field.name]: !prev[field.name],
                      }))
                    }
                    className="w-full flex justify-between items-center py-2 px-3 text-left font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded border border-gray-300 focus:outline-none"
                    aria-expanded={openCollapsibles[field.name]}
                    aria-controls={field.name + '-section'} // For accessibility
                  >
                    <span>{field.label}</span>
                    {openCollapsibles[field.name] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                </div>
              );
            }

            // If the field belongs to a collapsible section and it's closed, don't render it
            if (
              field.collapsibleSectionId &&
              !openCollapsibles[field.collapsibleSectionId]
            ) {
              return null;
            }

            if (field.type === 'checkbox-multiple') {
              return (
                <div
                  key={field.name}
                  className="md:col-span-2"
                  id={
                    field.collapsibleSectionId
                      ? field.collapsibleSectionId + '-section'
                      : undefined
                  }
                >
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
                          checked={
                            Array.isArray(formData[field.name]) &&
                            formData[field.name]?.includes(opt.value)
                          }
                          onChange={onChange}
                          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
            const isPassword = field.type === 'password';
            const colSpan =
              isTextArea || isPassword ? 'md:col-span-2' : 'col-span-1';

            return (
              <div
                key={field.name}
                className={colSpan}
                id={
                  field.collapsibleSectionId
                    ? field.collapsibleSectionId + '-section'
                    : undefined
                }
              >
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {isTextArea ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={onChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    required={field.required}
                  />
                ) : isPassword ? (
                  <div className="relative">
                    <input
                      id={field.name}
                      name={field.name}
                      type={showPassword[field.name] ? 'text' : 'password'}
                      value={formData[field.name] || ''}
                      onChange={onChange}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                      required={field.required}
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [field.name]: !prev[field.name],
                        }))
                      }
                      aria-label={
                        showPassword[field.name]
                          ? 'Ocultar senha'
                          : 'Exibir senha'
                      }
                    >
                      {showPassword[field.name] ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type === 'number' ? 'number' : field.type}
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

        <div className="flex justify-between py-12 items-center">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 rounded bg-red-600 text-white flex items-center hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              <FaTrash className="mr-2" /> Excluir
            </button>
          )}
          <div className="flex gap-2 ml-auto  ">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[var(--accent)] text-white hover:bg-blue-700 disabled:opacity-50 flex items-center" // Adicionado flex items-center
              disabled={isLoading}
            >
              {isLoading ? (
                'Salvando...'
              ) : (
                <>
                  <FaSave className="mr-2" /> Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
