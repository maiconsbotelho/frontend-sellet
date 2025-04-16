import { ModalPerfilProvider } from '@/context/modalPerfilContext';
export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <ModalPerfilProvider>{children}</ModalPerfilProvider>;
};
