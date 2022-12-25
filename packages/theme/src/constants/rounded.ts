export enum ROUNDED_TYPES {
  SMALL = "SMALL",
  NORMAL = "NORMAL",
  LARGE = "LARGE",
  PILL = "PILL",
  CIRCLE = "CIRCLE",
}

export const rounded = {
  [ROUNDED_TYPES.SMALL]: "2px",
  [ROUNDED_TYPES.NORMAL]: "4px",
  [ROUNDED_TYPES.LARGE]: "8px",
  [ROUNDED_TYPES.PILL]: "999px",
  [ROUNDED_TYPES.CIRCLE]: "50%",
}
