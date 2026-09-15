/* Datos de ejemplo, taller de motos. Todo inventado para la vista previa. */
const TALLER = {
  nombre: "Radical Bikes Race",
  ciudad: "Torrejón de la Calzada",
  nif: "B12345678",
  direccion: "Calle de Eulalia Sauquillo, 6, Local, 28991 Torrejón de la Calzada, Madrid",
  telefono: "91 000 00 00",
  email: "taller@radicalbikesrace.com"
};

const CLIENTES = [
  { id: "C-01", nombre: "Javier Ruiz", telefono: "6•• ••• •41", email: "javier.ruiz@correo.com", desde: "2021-03-12", motos: [
      { marca: "Yamaha", modelo: "MT-07", anyo: 2021, matricula: "1234 KZF", km: 24310, color: "#ffc93c" } ] },
  { id: "C-02", nombre: "Marta Serrano", telefono: "6•• ••• •77", email: "marta.serrano@correo.com", desde: "2019-06-04", motos: [
      { marca: "Honda", modelo: "CB500X", anyo: 2019, matricula: "5678 LMD", km: 41870, color: "#c0392b" } ] },
  { id: "C-03", nombre: "Alberto Nieto", telefono: "6•• ••• •22", email: "alberto.nieto@correo.com", desde: "2022-01-20", motos: [
      { marca: "KTM", modelo: "390 Duke", anyo: 2022, matricula: "9012 MBD", km: 12480, color: "#e67e22" } ] },
  { id: "C-04", nombre: "Sergio Blanco", telefono: "6•• ••• •18", email: "sergio.blanco@correo.com", desde: "2020-09-15", motos: [
      { marca: "Kawasaki", modelo: "Z900", anyo: 2020, matricula: "3456 JGH", km: 33140, color: "#27ae60" } ] },
  { id: "C-05", nombre: "Nuria Vidal", telefono: "6•• ••• •09", email: "nuria.vidal@correo.com", desde: "2021-11-02", motos: [
      { marca: "Vespa", modelo: "Primavera 125", anyo: 2021, matricula: "7890 HTR", km: 8260, color: "#8e44ad" } ] },
  { id: "C-06", nombre: "Raúl Domínguez", telefono: "6•• ••• •63", email: "raul.dominguez@correo.com", desde: "2019-02-27", motos: [
      { marca: "BMW", modelo: "R 1250 GS", anyo: 2019, matricula: "2345 FDS", km: 52600, color: "#2980b9" } ] },
  { id: "C-07", nombre: "Cristian Ortega", telefono: "6•• ••• •31", email: "cristian.ortega@correo.com", desde: "2023-05-09", motos: [
      { marca: "Yamaha", modelo: "Ténéré 700", anyo: 2023, matricula: "4567 KLP", km: 6980, color: "#16a085" } ] },
  { id: "C-08", nombre: "Luis Marín", telefono: "6•• ••• •55", email: "luis.marin@correo.com", desde: "2017-04-18", motos: [
      { marca: "Ducati", modelo: "Monster 821", anyo: 2017, matricula: "6789 QWE", km: 47200, color: "#c0392b" } ] }
];

const TIPOS = ["Mantenimiento", "Neumáticos", "Averías", "Preparaciones"];

const FACTURAS = [
  { num: "RB-2026-0041", fecha: "2026-09-12", cliente: "C-04", concepto: "Cambio de neumáticos y equilibrado", base: 168.00, tipo: "Neumáticos", estado: "Cobrada" },
  { num: "RB-2026-0040", fecha: "2026-09-10", cliente: "C-01", concepto: "Revisión 20.000 km, aceite y filtros", base: 189.50, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0039", fecha: "2026-09-08", cliente: "C-05", concepto: "Kit de arrastre y ajuste de válvulas", base: 245.00, tipo: "Mantenimiento", estado: "Pendiente" },
  { num: "RB-2026-0038", fecha: "2026-09-05", cliente: "C-06", concepto: "Pastillas y líquido de frenos", base: 132.40, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0037", fecha: "2026-09-03", cliente: "C-03", concepto: "Batería y diagnóstico eléctrico", base: 96.00, tipo: "Averías", estado: "Cobrada" },
  { num: "RB-2026-0036", fecha: "2026-08-28", cliente: "C-02", concepto: "Puesta a punto pre ITV y aceite", base: 145.80, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0035", fecha: "2026-08-25", cliente: "C-07", concepto: "Montaje de defensas y cubrecárter", base: 210.00, tipo: "Preparaciones", estado: "Pendiente" },
  { num: "RB-2026-0034", fecha: "2026-08-20", cliente: "C-08", concepto: "Reglaje de válvulas y sincronización", base: 268.90, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0033", fecha: "2026-08-14", cliente: "C-01", concepto: "Neumático trasero y equilibrado", base: 178.00, tipo: "Neumáticos", estado: "Cobrada" },
  { num: "RB-2026-0032", fecha: "2026-08-07", cliente: "C-04", concepto: "Kit de arrastre completo", base: 235.60, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0031", fecha: "2026-07-30", cliente: "C-05", concepto: "Revisión anual 5.000 km", base: 89.90, tipo: "Mantenimiento", estado: "Cobrada" },
  { num: "RB-2026-0030", fecha: "2026-07-22", cliente: "C-03", concepto: "Reparación de pinchazo y neumático delantero", base: 142.30, tipo: "Averías", estado: "Cobrada" }
];

const RECAMBIOS = [
  { ref: "R-1001", nombre: "Kit de arrastre DID 525 VX", proveedor: "DID", stock: 4, mínimo: 2, coste: 78.00, pvp: 148.00 },
  { ref: "R-1002", nombre: "Neumático Michelin Road 6 180/55 R17", proveedor: "Michelin", stock: 6, mínimo: 4, coste: 132.00, pvp: 218.00 },
  { ref: "R-1003", nombre: "Neumático Michelin Road 6 120/70 R17", proveedor: "Michelin", stock: 2, mínimo: 4, coste: 98.00, pvp: 172.00 },
  { ref: "R-1004", nombre: "Pastillas de freno Brembo sinterizadas", proveedor: "Brembo", stock: 9, mínimo: 6, coste: 22.50, pvp: 44.90 },
  { ref: "R-1005", nombre: "Filtro de aceite original Yamaha", proveedor: "Yamaha", stock: 14, mínimo: 6, coste: 6.80, pvp: 14.50 },
  { ref: "R-1006", nombre: "Aceite Motul 7100 10W40 (4 L)", proveedor: "Motul", stock: 8, mínimo: 5, coste: 32.00, pvp: 58.00 },
  { ref: "R-1007", nombre: "Bujía NGK iridio", proveedor: "NGK", stock: 22, mínimo: 10, coste: 9.40, pvp: 19.80 },
  { ref: "R-1008", nombre: "Batería Yuasa YTZ10S", proveedor: "Yuasa", stock: 3, mínimo: 2, coste: 58.00, pvp: 112.00 },
  { ref: "R-1009", nombre: "Líquido de frenos DOT 4 (500 ml)", proveedor: "Motul", stock: 11, mínimo: 6, coste: 5.20, pvp: 12.50 },
  { ref: "R-1010", nombre: "Correa de transmisión secundaria", proveedor: "Malossi", stock: 1, mínimo: 2, coste: 96.00, pvp: 178.00 },
  { ref: "R-1011", nombre: "Amortiguador trasero Öhlins STX", proveedor: "Öhlins", stock: 2, mínimo: 1, coste: 420.00, pvp: 690.00 },
  { ref: "R-1012", nombre: "Maneta de freno derecha", proveedor: "Varias", stock: 7, mínimo: 4, coste: 14.00, pvp: 32.00 }
];

const ORDENES = [
  { num: "OT-2026-119", cliente: "C-01", moto: "Yamaha MT-07", trabajo: "Cambio de neumático trasero y equilibrado", estado: "Recibida", entrada: "2026-09-15", prevista: "2026-09-16" },
  { num: "OT-2026-118", cliente: "C-04", moto: "Kawasaki Z900", trabajo: "Kit de arrastre y ajuste de cadena", estado: "En taller", entrada: "2026-09-14", prevista: "2026-09-16" },
  { num: "OT-2026-117", cliente: "C-05", moto: "Vespa Primavera 125", trabajo: "Correa de variador y ajuste de válvulas", estado: "Esperando recambio", entrada: "2026-09-11", prevista: "2026-09-18" },
  { num: "OT-2026-116", cliente: "C-06", moto: "BMW R 1250 GS", trabajo: "Revisión 50.000 km y cambio de líquidos", estado: "En taller", entrada: "2026-09-12", prevista: "2026-09-17" },
  { num: "OT-2026-115", cliente: "C-07", moto: "Yamaha Ténéré 700", trabajo: "Montaje de defensas y cubrecárter", estado: "Lista", entrada: "2026-09-09", prevista: "2026-09-15" },
  { num: "OT-2026-114", cliente: "C-02", moto: "Honda CB500X", trabajo: "Puesta a punto pre ITV y aceite", estado: "Entregada", entrada: "2026-09-05", prevista: "2026-09-08" },
  { num: "OT-2026-113", cliente: "C-03", moto: "KTM 390 Duke", trabajo: "Diagnostico eléctrico y bateria", estado: "Entregada", entrada: "2026-09-02", prevista: "2026-09-03" },
  { num: "OT-2026-112", cliente: "C-08", moto: "Ducati Monster 821", trabajo: "Reglaje de válvulas y sincronización", estado: "Entregada", entrada: "2026-08-18", prevista: "2026-08-20" }
];

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre"];
const CONTABILIDAD = [
  { mes: "Enero", ingresos: 8420, gastos: 4180 },
  { mes: "Febrero", ingresos: 7960, gastos: 4020 },
  { mes: "Marzo", ingresos: 9340, gastos: 4560 },
  { mes: "Abril", ingresos: 10120, gastos: 4880 },
  { mes: "Mayo", ingresos: 11480, gastos: 5240 },
  { mes: "Junio", ingresos: 12260, gastos: 5610 },
  { mes: "Julio", ingresos: 9870, gastos: 4730 },
  { mes: "Agosto", ingresos: 7240, gastos: 3980 },
  { mes: "Septiembre", ingresos: 10640, gastos: 4910 }
];

const GASTOS_MES = [
  { concepto: "Compra de recambios y consumibles", importe: 2140, tipo: "Variable" },
  { concepto: "Alquiler del local", importe: 950, tipo: "Fijo" },
  { concepto: "Luz, agua y gas", importe: 320, tipo: "Fijo" },
  { concepto: "Seguro del taller y responsabilidad civil", importe: 185, tipo: "Fijo" },
  { concepto: "Cuota de autónomo", importe: 294, tipo: "Fijo" },
  { concepto: "Gestoría", importe: 145, tipo: "Fijo" },
  { concepto: "Publicidad y redes", importe: 210, tipo: "Variable" },
  { concepto: "Herramienta y utillaje", importe: 166, tipo: "Variable" }
];

const TOP_RECAMBIOS = [
  { nombre: "Filtro de aceite", valor: 46 },
  { nombre: "Aceite 10W40", valor: 38 },
  { nombre: "Pastillas de freno", valor: 29 },
  { nombre: "Bujías", valor: 24 },
  { nombre: "Neumáticos", valor: 17 },
  { nombre: "Kits de arrastre", valor: 11 }
];
