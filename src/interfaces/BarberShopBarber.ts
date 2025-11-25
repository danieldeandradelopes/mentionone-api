export interface AvailableHour {
  week_day: string;
  start_time: string;
  end_time: string;
}

export interface Barber {
  id: number;
  user_id: number;
  enterprise_id: number;
  specialties?: string;
  bio?: string;
  is_active: boolean;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  available_hours: AvailableHour[];
  created_at?: string;
  updated_at?: string;
}
