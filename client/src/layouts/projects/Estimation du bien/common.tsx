interface Row {
  desc: string;
  min: number;
  moy: number;
  max: number;
}

export function subtotalMin(items: readonly Row[]) {
  return items.map(({ min }) => min).reduce((sum, i) => sum + i, 0);
}
export function subtotalMoy(items: readonly Row[]) {
  return items.map(({ moy }) => moy).reduce((sum, i) => sum + i, 0);
}
export function subtotalMax(items: readonly Row[]) {
  return items.map(({ max }) => max).reduce((sum, i) => sum + i, 0);
}

function createRow(desc, min, moy, max) {
    return { desc, min, moy, max };
}

export const rows = [
    createRow("Terrassement", 228480, 245280, 262080),
    createRow("Peinture", 1795200, 1927200, 2059200),
    createRow("Plomberie sanitaire assainissement", 3264000, 3504000, 3744000),
    createRow("Menuiserie aluminium", 0, 0, 0),
    createRow("Carrelage-revetement", 1632000, 1752000, 1872000),
    createRow("Charpente couverture", 3590400, 3854400, 4118400),
    createRow("Abord-jardin", 0, 0, 0),
    createRow("Electricite", 2284800, 2452800, 2620800),
    createRow("Etancheite", 261120, 280320, 299520),
    createRow("Faux-plafond", 1680960, 1804560, 1928160),
    createRow("Ferronnerie", 930240, 998640, 1067040),
    createRow("Menuiserie quincaillerie", 3916800, 4204800, 4492800),
    createRow("Maconnerie grosoeuvre", 13056000, 14016000, 14976000),
];

export const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "80%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};