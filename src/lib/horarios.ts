// lib/horarios.ts

export function gerarHorariosGrade(
  inicio = '08:00',
  fim = '18:00',
  intervaloMinutos = 30
): string[] {
  const horarios: string[] = [];

  const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
  const [horaFim, minutoFim] = fim.split(':').map(Number);

  const dataInicio = new Date();
  dataInicio.setHours(horaInicio, minutoInicio, 0, 0);

  const dataFim = new Date();
  dataFim.setHours(horaFim, minutoFim, 0, 0);

  while (dataInicio <= dataFim) {
    const hora = dataInicio.getHours().toString().padStart(2, '0');
    const minuto = dataInicio.getMinutes().toString().padStart(2, '0');
    horarios.push(`${hora}:${minuto}`);
    dataInicio.setMinutes(dataInicio.getMinutes() + intervaloMinutos);
  }

  return horarios;
}
