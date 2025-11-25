
export const sortSlots = (slots: string[]) => {
  return slots.sort((a, b) => {
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);

    const minutesA = ah * 60 + am;
    const minutesB = bh * 60 + bm;

    return minutesA - minutesB;
  });
}
