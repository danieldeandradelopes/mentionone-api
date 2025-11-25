import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  console.log("⏰ Populando tabela de horários de funcionamento...");

  // Buscar barbearias existentes
  const Enterprises = await knex("Enterprise").select("id", "name");

  if (Enterprises.length === 0) {
    console.log(
      "⚠️  Nenhuma barbearia encontrada. Execute primeiro o seed de barbearias."
    );
    return;
  }

  // Verificar se já existem horários
  const existingHours = await knex("working_hours")
    .whereIn(
      "enterprise_Id",
      Enterprises.map((shop) => shop.id)
    )
    .select("id");

  if (existingHours.length > 0) {
    console.log("⚠️  Horários de funcionamento já existem. Pulando criação.");
    return;
  }

  // Criar horários de funcionamento para cada barbearia
  const workingHoursData: any[] = [];

  Enterprises.forEach((shop, shopIndex) => {
    // Diferentes padrões de horário para cada barbearia
    const patterns = [
      // Padrão 1: Segunda a Sexta (8h-18h), Sábado (8h-14h), Domingo fechado
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
            is_open: true,
          },
          { day: "sunday", slots: [], is_open: false },
        ],
      },
      // Padrão 2: Segunda a Sexta (9h-19h), Sábado (9h-15h), Domingo (10h-16h)
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
            is_open: true,
          },
          {
            day: "sunday",
            slots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
            is_open: true,
          },
        ],
      },
      // Padrão 3: Segunda a Sexta (7h-17h), Sábado (7h-13h), Domingo fechado
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
            is_open: true,
          },
          { day: "sunday", slots: [], is_open: false },
        ],
      },
      // Padrão 4: Segunda a Sexta (10h-20h), Sábado (10h-18h), Domingo (12h-18h)
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "sunday",
            slots: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
            is_open: true,
          },
        ],
      },
    ];

    const pattern = patterns[shopIndex % patterns.length];

    pattern.week_days.forEach((dayData) => {
      workingHoursData.push({
        enterprise_Id: shop.id,
        week_day: dayData.day,
        is_open: dayData.is_open,
      });
    });
  });

  const workingHours = await knex("working_hours")
    .insert(workingHoursData)
    .returning("*");

  // Criar time slots para cada working_hours
  const timeSlotsData: any[] = [];
  let slotIndex = 0;

  Enterprises.forEach((shop, shopIndex) => {
    const patterns = [
      // Padrão 1: Segunda a Sexta (8h-18h), Sábado (8h-14h), Domingo fechado
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
            is_open: true,
          },
          { day: "sunday", slots: [], is_open: false },
        ],
      },
      // Padrão 2: Segunda a Sexta (9h-19h), Sábado (9h-15h), Domingo (10h-16h)
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
            is_open: true,
          },
          {
            day: "sunday",
            slots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
            is_open: true,
          },
        ],
      },
      // Padrão 3: Segunda a Sexta (7h-17h), Sábado (7h-13h), Domingo fechado
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: ["07:00", "08:00", "09:00", "10:00", "11:00", "12:00"],
            is_open: true,
          },
          { day: "sunday", slots: [], is_open: false },
        ],
      },
      // Padrão 4: Segunda a Sexta (10h-20h), Sábado (10h-18h), Domingo (12h-18h)
      {
        week_days: [
          {
            day: "monday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "tuesday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "wednesday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "thursday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "friday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
            ],
            is_open: true,
          },
          {
            day: "saturday",
            slots: [
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
            ],
            is_open: true,
          },
          {
            day: "sunday",
            slots: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
            is_open: true,
          },
        ],
      },
    ];

    const pattern = patterns[shopIndex % patterns.length];

    pattern.week_days.forEach((dayData, dayIndex) => {
      const workingHour = workingHours[slotIndex];
      if (workingHour && dayData.is_open && dayData.slots.length > 0) {
        dayData.slots.forEach((slot) => {
          timeSlotsData.push({
            working_hours_id: workingHour.id,
            time_slot: slot,
          });
        });
      }
      slotIndex++;
    });
  });

  if (timeSlotsData.length > 0) {
    await knex("working_hours_time_slots").insert(timeSlotsData);
  }

  console.log("✅ Horários de funcionamento inseridos com sucesso!");
  console.log(
    `⏰ Criados ${workingHours.length} horários para ${Enterprises.length} barbearias`
  );
  console.log(`🕐 Criados ${timeSlotsData.length} slots de horário`);

  // Mostrar resumo por barbearia
  Enterprises.forEach((shop, index) => {
    const shopHours = workingHours.filter((wh) => wh.enterprise_Id === shop.id);
    const openDays = shopHours.filter((wh) => wh.is_open).length;
    console.log(`   - ${shop.name}: ${openDays} dias abertos por semana`);
  });
}
