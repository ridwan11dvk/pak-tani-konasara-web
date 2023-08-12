type OptionType = { [x: string]: any };
type OptionsType = Array<OptionType>;

export const roleOptions: OptionsType = [
  { label: "Admin Gudang", value: "Admin Gudang" },
  { label: "Petani", value: "Petani" },
  { label: "Pembeli", value: "Pembeli" },
];

export const statusOptions: OptionsType = [
  { label: "Non-Aktif", value: "Non-Aktif" },
  { label: "Aktif", value: "Aktif" },
];
