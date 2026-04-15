export interface ProductDoc {
  name: string;
  code: string;
  msds?: string;
  techInfo?: string;
}

export const productDocs: ProductDoc[] = [
  { name: "CROSS POWER 2T", code: "MT-1", msds: "https://motorex.com/Shared/Documents/MSDS_SPECTRO/MOTOR%20OILS/MSDS_CROSS_POWER_2T_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/2T-Motorenoel/CROSS-POWER-2T/CROSS-POWER-2T_1014847_EN_20241126-115443.pdf" },
  { name: "CROSS POWER 4T 10W50", code: "MT-2", msds: "https://motorex.com/Shared/Documents/MSDS_SPECTRO/MOTOR%20OILS/MSDS_CROSS_POWER_4T_SAE_10W_50_JASO_MA2_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/CROSS-POWER-4T-SAE-10W50-MA2/CROSS-POWER-4T-SAE-10W50-MA2_1014848_EN_20240611-095606.pdf" },
  { name: "CROSS POWER 4T 10W60", code: "MT-3", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_CROSS_POWER_4T_SAE_10W_60_JASO_MA2_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/CROSS-POWER-4T-SAE-10W60-MA2/CROSS-POWER-4T-SAE-10W60-MA2_1014850_EN_20240514-151539.pdf" },
  { name: "TOP SPEED 15W50", code: "MT-4", msds: "https://motorex.com/Shared/Documents/MSDS_SPECTRO/MOTOR%20OILS/MSDS_TOP_SPEED_4T_SAE_15W_50_JASO_MA2_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/TOP-SPEED-4T-SAE-15W50-MA2/TOP-SPEED-4T-SAE-15W50-MA2_1017609_EN_20240515-142550.pdf" },
  { name: "GEAR OIL 10W30", code: "MT-5", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/GEAR%20OIL/MSDS_MOTO_GEAR_OIL_SAE_10W_30_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Getriebeoel/MOTO-GEAR-OIL-SAE-10W30/MOTO-GEAR-OIL-SAE-10W30_1016140_EN_20250327-085512.pdf" },
  { name: "RACING FORK OIL 2,5 W", code: "MT-6", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_2,5W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-25W/RACING-FORK-OIL-25W_1016807_EN_20260120-102152.pdf" },
  { name: "RACING FORK OIL 4 W", code: "MT-28", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_4W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-4W/RACING-FORK-OIL-4W_1016808_EN_20260116-110145.pdf" },
  { name: "RACING FORK OIL 5 W", code: "MT-7", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_5W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-5W/RACING-FORK-OIL-5W_1016809_EN_20260116-110248.pdf" },
  { name: "RACING FORK OIL 7,5 W", code: "MT-8", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_7%2C5W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-75W/RACING-FORK-OIL-75W_1016810_EN_20260116-110328.pdf" },
  { name: "RACING FORK OIL 10 W", code: "MT-9", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_10W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-10W/RACING-FORK-OIL-10W_1016805_EN_20260116-105639.pdf" },
  { name: "RACING FORK OIL 15 W", code: "MT-10", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_15W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-15W/RACING-FORK-OIL-15W_1016806_EN_20260116-105849.pdf" },
  { name: "RACING SHOCK OIL", code: "MT-23", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_RACING_SHOCK_OIL_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-SHOCK-OIL/RACING-SHOCK-OIL_1016822_EN_20260116-111219.pdf" },
  { name: "RACING SD-1", code: "MT-11", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_RACING_SD-1_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-%20D%C3%A4mpferoel/Racing%20SD-1/Racing%20SD-1_EN.pdf" },
  { name: "COOLANT M3.0", code: "MT-12", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/COOLANT/COOLANT%20M/MSDS_COOLANT_M3_0_CONCENTRATE_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Coolant/COOLANT-M3.0-CONCENTRATE/COOLANT-M3.0-CONCENTRATE_1014767_EN_20240924-063841.pdf" },
  { name: "MOTO CLEAN", code: "M-13", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/REINIGER/MSDS_MOTO_CLEAN_PLUS_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Clean-Care/MOTO-CLEAN-PLUS/MOTO-CLEAN-PLUS_1016137_EN_20221212-151115.pdf" },
  { name: "POWER BRAKE CLEAN", code: "MT-14", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/SPRAY/MSDS_POWER_BRAKE_CLEAN_SPRAY_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Spray/POWER-BRAKE-CLEAN-SPRAY/POWER-BRAKE-CLEAN-SPRAY_1016625_EN_20230510-102020.pdf" },
  { name: "AIR FILTER OIL 206", code: "MT-15", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_AIR_FILTER_OIL_206_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Filter%20-%20Pflege/Air%20Filter%20Oil%20206/AIR%20FILTER%20OIL%20206_EN.pdf" },
  { name: "4-STROKE 5W40", code: "MT-16", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_FOUR_STROKE_4T_SAE_5W_40_JASO_MA2_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/FOUR-STROKE-4T-SAE-5W40-MA2/FOUR-STROKE-4T-SAE-5W40-MA2_1015334_EN_20260202-114037.pdf" },
  { name: "4-STROKE 10W40", code: "MT-17", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_FOUR_STROKE_4T_SAE_10W_40_JASO_MA2_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/FOUR-STROKE-4T-SAE-10W40-MA2/FOUR-STROKE-4T-SAE-10W40-MA2_1015331_EN_20260202-115222.pdf" },
  { name: "4-STROKE 15W50", code: "MT-18", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_FOUR_STROKE_4T_SAE_15W_50_JASO_MA2_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/FOUR-STROKE-4T-SAE-15W50-MA2/FOUR-STROKE-4T-SAE-15W50-MA2_1015332_EN_20260202-115556.pdf" },
  { name: "4-STROKE 20W50", code: "MT-19", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_FOUR_STROKE_4T_SAE_20W_50_JASO_MA2_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/FOUR-STROKE-4T-SAE-20W50-MA2/FOUR-STROKE-4T-SAE-20W50-MA2_1015333_EN_20260202-115832.pdf" },
  { name: "FETT 2000 - 850G", code: "MT-20", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FETTE/MSDS_FETT_2000_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Grease/FETT-2000/FETT-2000_1015219_EN_20260413-075449.pdf" },
  { name: "FETT 3000 - 850G", code: "MT-21", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FETTE/MSDS_FETT_3000_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Grease/FETT-3000/FETT-3000_1015223_EN_20260413-075509.pdf" },
  { name: "GREASE GUN", code: "MT-27", techInfo: "https://motorex.com/Pdf/TI/Motorex/Geraete/BIKE-GREASE-GUN/PI/BIKE-GREASE-GUN_1014511_EN_20260116-165713.pdf" },
  { name: "KTM RACING 4T 20W60", code: "MT-22", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_KTM_RACING_4T_SAE_20W_60_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/KTM%20RACING%204T/KTM%20RACING%204T%2020W60_EN.pdf" },
  { name: "CHAINLUBE OFF ROAD - 500 ML", code: "MT-24", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/SPRAY/MSDS_CHAINLUBE_OFF_ROAD_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Kettenoel-Pflege/CHAINLUBE-OFF-ROAD/CHAINLUBE-OFF-ROAD_1014680_EN_20250131-153049.pdf" },
  { name: "CHAINLUBE OFF ROAD - 56 ML", code: "MT-25", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/SPRAY/MSDS_CHAINLUBE_OFF_ROAD_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Kettenoel-Pflege/CHAINLUBE-OFF-ROAD/CHAINLUBE-OFF-ROAD_1014680_EN_20250131-153049.pdf" },
  { name: "KIT CHAINLUB 500ML + 56ML", code: "MT-24/25", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/SPRAY/MSDS_CHAINLUBE_OFF_ROAD_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Kettenoel-Pflege/CHAINLUBE-OFF-ROAD/CHAINLUBE-OFF-ROAD_1014680_EN_20250131-153049.pdf" },
  { name: "POWER SYNT 4T 10W50", code: "MT-26", msds: "https://motorex.com/Shared/Documents/MSDS_SPECTRO/MOTOR%20OILS/MSDS_POWER_SYNT_4T_SAE_10W_50_JASO_MA2_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/POWER-SYNT-4T-SAE-10W50-MA2/POWER-SYNT-4T-SAE-10W50-MA2_1016630_EN_20240515-105242.pdf" },
  { name: "GEAR OIL PENTA LS SAE 75W90", code: "MT-29", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/GEAR%20OIL/MSDS_PENTA_SAE_75W_90_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Getriebeoel/PENTA%20LS%20SAE%2075W90/PENTA%20LS%20SAE%2075W90_en.pdf" },
  { name: "GEAR OIL PENTA LS SAE 75W140", code: "MT-30", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/GEAR%20OIL/MSDS_PENTA_LS_SAE_75W_140_EN_GB.pdf" },
  { name: "CHAINLUBE STRONG ROAD - 500ML", code: "MT-31", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/SPRAY/MSDS_CHAINLUBE_ROAD_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Kettenoel-Pflege/CHAINLUBE-ROAD/CHAINLUBE-ROAD_1014683_EN_20250127-110612.pdf" },
  { name: "RACING PRO 4T 15W50", code: "MT-32", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/MOTO%20LINE/MSDS_RACING_PRO_4T_SAE_15W_50_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/4T-Motorenoel/RACING%20PRO%204T%2015W50/Racing%20Motor%20Oil%2015W50_EN.pdf" },
  { name: "BRAKE CLEAN - 25 L", code: "MT-34", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/REINIGER/MSDS_BRAKE_CLEAN_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Reiniger/BRAKE-CLEAN/BRAKE-CLEAN_1014535_EN.pdf" },
  { name: "REX CLEANER - 5 L", code: "MT-35", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/REINIGER/MSDS_REX_CLEANER_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Cleaners/REX-CLEANER/REX-CLEANER_1016858_EN_20260401-164558.pdf" },
  { name: "REX CLEANER - 25 L", code: "MT-36", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/REINIGER/MSDS_REX_CLEANER_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Cleaners/REX-CLEANER/REX-CLEANER_1016858_EN_20260401-164558.pdf" },
  { name: "RACING FORK OIL 2,5 W - 60 LITROS", code: "MT-37", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_2,5W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-25W/RACING-FORK-OIL-25W_1016807_EN_20260120-102152.pdf" },
  { name: "RACING FORK OIL 5W - 60 LITROS", code: "MT-38", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FORK/MSDS_RACING_FORK_OIL_5W_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Gabel-Daempferoel/RACING-FORK-OIL-5W/RACING-FORK-OIL-5W_1016809_EN_20260116-110248.pdf" },
  { name: "FETT 2000 - 100G", code: "MT-38", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FETTE/MSDS_FETT_2000_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Grease/FETT-2000/FETT-2000_1015219_EN_20260413-075449.pdf" },
  { name: "COPPER PASTE - 100G", code: "MT-39", techInfo: "https://motorex.com/Pdf/TI/Motorex/Fett/MOTOREX-COPPER-PASTE/MOTOREX-COPPER-PASTE_1482783_EN_20250626-082019.pdf" },
  { name: "ATF DEXRON 3", code: "MT-40", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/ATF/MSDS_ATF_DEXRON_III_EN_GB.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/ATF-CVT-DSG/ATF-DEXRON-III/ATF%20DEXRON%20III_EN.pdf" },
  { name: "FETT 2000 - 400G", code: "MT-41", msds: "https://motorex.com/Shared/Documents/MSDS_MOTOREX/FETTE/MSDS_FETT_2000_EN_US.pdf", techInfo: "https://motorex.com/Pdf/TI/Motorex/Grease/FETT-2000/FETT-2000_1015219_EN_20260413-075449.pdf" },
];

/**
 * Find documentation for a product by matching its name.
 * Uses a normalized fuzzy comparison to handle differences in casing, spacing, etc.
 */
export function findProductDocs(productName: string): ProductDoc | undefined {
  const normalize = (s: string) =>
    s.toUpperCase().replace(/[^A-Z0-9]/g, "");

  const normalized = normalize(productName);

  // Try exact normalized match first
  const exact = productDocs.find((d) => normalize(d.name) === normalized);
  if (exact) return exact;

  // Try "includes" match (product name contains doc name or vice versa)
  return productDocs.find(
    (d) => normalized.includes(normalize(d.name)) || normalize(d.name).includes(normalized)
  );
}
