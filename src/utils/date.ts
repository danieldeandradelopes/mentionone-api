import { format, isBefore, isPast } from "date-fns";
import { DateTime } from "luxon";

export function getDayOfWeek(date: Date): string {
  return format(date, "eeee").toLowerCase();
}

export function formatTime(date: Date): string {
  return format(date, "HH:mm").toLowerCase();
}

export const normalizeTime = (time: string): string => {
  return time.split(":").slice(0, 2).join(":");
};

export const formatDateToCompareWithDB = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

// Função para processar data de string (sem manipulação de timezone)
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Função para extrair apenas a data (YYYY-MM-DD) de uma string ISO
export const extractDateOnly = (dateString: string): string => {
  // Extrair diretamente da string sem conversão de timezone
  const datePart = dateString.split("T")[0];
  return datePart;
};

// Função para obter data atual (sem manipulação de timezone)
export const getCurrentDate = (): Date => {
  return new Date();
};

export const getCurrentDateInTimezone = (
  originalDateString: string,
  timezone: string
): Date => {
  // Converte a string para Date do JS
  const jsDate = new Date(originalDateString);

  if (isNaN(jsDate.getTime())) {
    throw new Error(`Data inválida: ${originalDateString}`);
  }

  // Cria DateTime do Luxon a partir do JS Date, ajustando para timezone
  const dtInZone = DateTime.fromJSDate(jsDate).setZone(timezone);

  if (!dtInZone.isValid) {
    throw new Error(`Falha ao converter para timezone ${timezone}`);
  }

  return dtInZone.toJSDate(); // retorna Date válido
};

export const isBeforeDate = ({
  first,
  second,
}: {
  first: string;
  second: string;
}) => {
  return isBefore(new Date(first), new Date(second));
};

export const isPastDate = (date: string) => {
  return isPast(new Date(date));
};
