// 'use client';

// import { useEffect, useState } from 'react';

// const Agenda = () => {
//   const [profissionais, setProfissionais] = useState<
//     { id: string; nome: string }[]
//   >([]); // Lista de profissionais
//   const [profissionalSelecionado, setProfissionalSelecionado] = useState<
//     string | null
//   >(null); // Profissional selecionado
//   const [agenda, setAgenda] = useState<
//     { horario: string; [key: string]: any }[]
//   >([]); // Dados da agenda
//   const [expediente, setExpediente] = useState([]); // Dados do expediente
//   const [loading, setLoading] = useState(false); // Estado de carregamento
//   const [dataInicial, setDataInicial] = useState('2025-04-21'); // Data inicial
//   const [dataFinal, setDataFinal] = useState('2025-04-27'); // Data final

//   // Busca a lista de profissionais ao carregar o componente
//   useEffect(() => {
//     const fetchProfissionais = async () => {
//       try {
//         const response = await fetch(
//           'http://localhost:8000/api/usuario/?tipo=PROFISSIONAL'
//         );
//         const data = await response.json();
//         setProfissionais(data);
//       } catch (error) {
//         console.error('Erro ao buscar profissionais:', error);
//       }
//     };

//     fetchProfissionais();
//   }, []);

//   // Busca o expediente do profissional selecionado
//   useEffect(() => {
//     if (profissionalSelecionado) {
//       const fetchExpediente = async () => {
//         try {
//           const response = await fetch(
//             `http://localhost:8000/api/agenda/expediente/por_profissional/?profissional=${profissionalSelecionado}`
//           );
//           const data = await response.json();
//           setExpediente(data);
//         } catch (error) {
//           console.error('Erro ao buscar expediente:', error);
//         }
//       };

//       fetchExpediente();
//     }
//   }, [profissionalSelecionado]);

//   // Busca a agenda do profissional selecionado
//   useEffect(() => {
//     if (profissionalSelecionado) {
//       const fetchAgenda = async () => {
//         setLoading(true);
//         try {
//           const response = await fetch(
//             `http://localhost:8000/api/agenda/agendamentos/agenda/?profissional=${profissionalSelecionado}&data_inicial=${dataInicial}&data_final=${dataFinal}`
//           );
//           const data = await response.json();
//           setAgenda(data);
//         } catch (error) {
//           console.error('Erro ao buscar a agenda:', error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchAgenda();
//     }
//   }, [profissionalSelecionado, dataInicial, dataFinal]);

//   // Renderiza o componente
//   return (
//     <div>
//       <h1>Agenda do Profissional</h1>

//       {/* Seleção de profissional */}
//       <label htmlFor="profissional">Selecione o profissional:</label>
//       <select
//         id="profissional"
//         value={profissionalSelecionado || ''}
//         onChange={(e) => setProfissionalSelecionado(e.target.value)}
//       >
//         <option value="" disabled>
//           -- Selecione --
//         </option>
//         {profissionais.map((profissional) => (
//           <option key={profissional.id} value={profissional.id}>
//             {profissional.nome}
//           </option>
//         ))}
//       </select>

//       {/* Seleção de intervalo de datas */}
//       <div>
//         <label htmlFor="dataInicial">Data Inicial:</label>
//         <input
//           type="date"
//           id="dataInicial"
//           value={dataInicial}
//           onChange={(e) => setDataInicial(e.target.value)}
//         />

//         <label htmlFor="dataFinal">Data Final:</label>
//         <input
//           type="date"
//           id="dataFinal"
//           value={dataFinal}
//           onChange={(e) => setDataFinal(e.target.value)}
//         />
//       </div>

//       {/* Tabela de agenda */}
//       {loading ? (
//         <p>Carregando...</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Horário</th>
//               {agenda.length > 0 &&
//                 Object.keys(agenda[0])
//                   .filter((key) => key !== 'horario')
//                   .map((dia) => <th key={dia}>{dia}</th>)}
//             </tr>
//           </thead>
//           <tbody>
//             {agenda.map((linha) => (
//               <tr key={linha.horario}>
//                 <td>{linha.horario}</td>
//                 {Object.keys(linha)
//                   .filter((key) => key !== 'horario')
//                   .map((dia) => (
//                     <td key={dia}>
//                       {linha[dia].ocupado
//                         ? `Cliente: ${linha[dia].nome_cliente}`
//                         : linha[dia].ocupado === false
//                         ? 'Disponível'
//                         : 'Fora do expediente'}
//                     </td>
//                   ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default Agenda;

'use client';

import { useEffect, useState } from 'react';

const Agenda = () => {
  const [profissionais, setProfissionais] = useState<
    { id: string; nome: string }[]
  >([]); // Lista de profissionais
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<
    string | null
  >(null); // Profissional selecionado
  const [agenda, setAgenda] = useState<
    { horario: string; [key: string]: any }[]
  >([]); // Dados da agenda
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [dataInicial, setDataInicial] = useState('2025-04-21'); // Data inicial
  const [dataFinal, setDataFinal] = useState('2025-04-27'); // Data final
  const [visao, setVisao] = useState<'dia' | 'semana'>('semana'); // Alternar visão

  // Busca a lista de profissionais ao carregar o componente
  useEffect(() => {
    const fetchProfissionais = async () => {
      try {
        const response = await fetch(
          'http://localhost:8000/api/usuario/?tipo=PROFISSIONAL'
        );
        const data = await response.json();
        // mapeia nome_completo para nome
        setProfissionais(
          data.map((p: any) => ({
            id: String(p.id),
            nome: p.nome_completo,
          }))
        );
      } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
      }
    };

    fetchProfissionais();
  }, []);

  // Busca a agenda do profissional selecionado
  // http://localhost:8000/api/agenda/agendamentos/agenda/?profissional=6&data_inicial=2025-04-21&data_final=2025-04-27
  useEffect(() => {
    if (profissionalSelecionado) {
      const fetchAgenda = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:8000/api/agenda/agendamentos/agenda/?profissional=${profissionalSelecionado}&data_inicial=${dataInicial}&data_final=${dataFinal}`
          );
          const data = await response.json();
          setAgenda(data);
        } catch (error) {
          console.error('Erro ao buscar a agenda:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAgenda();
    }
  }, [profissionalSelecionado, dataInicial, dataFinal]);

  // Alterna entre visão diária e semanal
  const alternarVisao = () => {
    if (visao === 'semana') {
      setVisao('dia');
      setDataFinal(dataInicial); // Para visão diária, data inicial e final são iguais
    } else {
      setVisao('semana');
      setDataFinal('2025-04-27'); // Ajuste para visão semanal
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        Agenda do Profissional
      </h1>
      {/* Seleção de profissional */}
      <div className="mb-4">
        <label
          htmlFor="profissional"
          className="block text-lg font-medium mb-2"
        >
          Selecione o profissional:
        </label>
        <select
          id="profissional"
          value={profissionalSelecionado || ''}
          onChange={(e) => {
            const id = e.target.value;
            setProfissionalSelecionado(id);
            const prof = profissionais.find((p) => p.id === id);
            console.log('Profissional selecionado:', prof?.nome);
          }}
          className="w-full p-2 border border-gray-300 bg-[var(--primary)] rounded-md"
        >
          <option className="text-[var(--secondary)]" value="" disabled>
            -- Selecione --
          </option>
          {profissionais.map((profissional) => (
            <option
              key={profissional.id}
              value={profissional.id}
              className="text-[var(--secondary)]"
            >
              {profissional.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de intervalo de datas */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <label
            htmlFor="dataInicial"
            className="block text-lg font-medium mb-2"
          >
            Data Inicial:
          </label>
          <input
            type="date"
            id="dataInicial"
            value={dataInicial}
            onChange={(e) => setDataInicial(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
        {visao === 'semana' && (
          <div>
            <label
              htmlFor="dataFinal"
              className="block text-lg font-medium mb-2"
            >
              Data Final:
            </label>
            <input
              type="date"
              id="dataFinal"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}
      </div>
      {/* Botão para alternar visão */}
      <button
        onClick={alternarVisao}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Alternar para visão {visao === 'semana' ? 'Diária' : 'Semanal'}
      </button>
      {/* Tabela de agenda */}
      {loading ? (
        <p className="text-center mt-4">Carregando...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-[var(--primary)] ">
                Horário
              </th>
              {agenda.length > 0 &&
                Object.keys(agenda[0])
                  .filter((key) => key !== 'horario')
                  .map((dia) => (
                    <th
                      key={dia}
                      className="border border-gray-300 p-2 bg-[var(--primary)] "
                    >
                      {dia}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {agenda.map((linha) => (
              <tr key={linha.horario}>
                <td className="border border-gray-300 p-2">{linha.horario}</td>
                {Object.keys(linha)
                  .filter((key) => key !== 'horario')
                  .map((dia) => (
                    <td key={dia} className="border border-gray-300 p-2">
                      {linha[dia].ocupado
                        ? linha[dia].nome_cliente
                        : linha[dia].ocupado === false
                        ? 'Disponível'
                        : 'Fora do expediente'}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Agenda;
