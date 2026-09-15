/* Vista previa del portal de gestión. Datos de ejemplo en memoria. */
const IVA = 0.21;
let facturas = JSON.parse(JSON.stringify(FACTURAS));
let recambios = JSON.parse(JSON.stringify(RECAMBIOS));
let seccion = "panel";
let filtro = "";

/* ---------- utilidades ---------- */
const eur = n => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n);
const num0 = n => new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(n);
const cliente = id => CLIENTES.find(c => c.id === id) || { nombre: "Cliente", motos: [] };
const moto = id => (cliente(id).motos[0] || {});
const total = f => f.base * (1 + IVA);
const estadoClase = e => ({
  "Cobrada": "e-cobrada", "Pendiente": "e-pendiente",
  "Recibida": "e-recibida", "En taller": "e-taller", "Esperando recambio": "e-esperando",
  "Lista": "e-lista", "Entregada": "e-entregada"
}[e] || "e-pendiente");

/* hash simulado, solo para que la vista previa muestre el registro inalterable */
function hashFactura(f) {
  const texto = `${f.num}|${f.fecha}|${f.base.toFixed(2)}|${cliente(f.cliente).nombre}|${TALLER.nif}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let salida = "";
  for (let bloque = 0; bloque < 8; bloque++) {
    h ^= h << 13; h >>>= 0;
    h ^= h >>> 17;
    h ^= h << 5; h >>>= 0;
    h = (h + Math.imul(bloque + 1, 2654435761)) >>> 0;
    salida += h.toString(16).padStart(8, "0");
  }
  return salida;
}

/* ---------- graficos SVG ---------- */
function graficoBarras(datos, ancho = 660, alto = 260) {
  const max = Math.max(...datos.map(d => d.valor)) * 1.15;
  const izq = 52, abajo = 34, arriba = 14;
  const anchoBarra = (ancho - izq - 14) / datos.length;
  const y = v => alto - abajo - (v / max) * (alto - abajo - arriba);
  let barras = "", ejes = "", etiquetas = "";
  const pasos = 4;
  for (let i = 0; i <= pasos; i++) {
    const v = (max / pasos) * i, yy = y(v);
    ejes += `<line class="eje" x1="${izq}" y1="${yy}" x2="${ancho - 6}" y2="${yy}"/>`;
    etiquetas += `<text x="${izq - 9}" y="${yy + 4}" text-anchor="end">${num0(v)}</text>`;
  }
  datos.forEach((d, i) => {
    const x = izq + i * anchoBarra + anchoBarra * 0.22;
    const w = anchoBarra * 0.56;
    const h = Math.max(2, alto - abajo - y(d.valor));
    barras += `<rect class="barra" x="${x.toFixed(1)}" y="${y(d.valor).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="5"/>`;
    barras += `<text x="${(x + w / 2).toFixed(1)}" y="${alto - abajo + 20}" text-anchor="middle">${d.etiqueta.slice(0, 3)}</text>`;
  });
  return `<svg class="grafico barras" viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="degradadoAmarillo" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffd76a"/><stop offset="100%" stop-color="#d9a512"/></linearGradient></defs>
    ${ejes}${barras}${etiquetas}
    <text x="${ancho - 6}" y="${alto - 6}" text-anchor="end">Facturación mensual, base sin IVA</text>
  </svg>`;
}

function graficoDonut(datos, tam = 240) {
  const totalV = datos.reduce((s, d) => s + d.valor, 0);
  const r = 84, cx = tam / 2, cy = tam / 2, grosor = 26;
  let angulo = -Math.PI / 2, trozos = "";
  const colores = ["#ffc93c", "#3d9bff", "#35d07f", "#ff8a3d"];
  datos.forEach((d, i) => {
    const frac = d.valor / totalV, fin = angulo + frac * Math.PI * 2;
    const x1 = cx + r * Math.cos(angulo), y1 = cy + r * Math.sin(angulo);
    const x2 = cx + r * Math.cos(fin), y2 = cy + r * Math.sin(fin);
    const grande = frac > 0.5 ? 1 : 0;
    trozos += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${grande} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
      fill="none" stroke="${colores[i % colores.length]}" stroke-width="${grosor}" stroke-linecap="butt"/>`;
    angulo = fin;
  });
  return `<svg class="grafico donut" viewBox="0 0 ${tam} ${tam}">
    ${trozos}<circle cx="${cx}" cy="${cy}" r="${r - grosor / 2 - 1}" fill="none"/>
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" style="font-size:19px;fill:#fff">${num0(totalV)}</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle">facturas</text>
  </svg>`;
}

function graficoLineas(series, ancho = 660, alto = 240) {
  const max = Math.max(...series.flatMap(s => s.datos)) * 1.2;
  const izq = 54, abajo = 30, arriba = 14;
  const x = i => izq + (i / (CONTABILIDAD.length - 1)) * (ancho - izq - 16);
  const y = v => alto - abajo - (v / max) * (alto - abajo - arriba);
  let ejes = "", textos = "", lineas = "", puntos = "";
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i, yy = y(v);
    ejes += `<line class="eje" x1="${izq}" y1="${yy}" x2="${ancho - 8}" y2="${yy}"/>`;
    textos += `<text x="${izq - 9}" y="${yy + 4}" text-anchor="end">${num0(v)}</text>`;
  }
  CONTABILIDAD.forEach((m, i) => {
    textos += `<text x="${x(i)}" y="${alto - 8}" text-anchor="middle">${m.mes.slice(0, 3)}</text>`;
  });
  series.forEach(s => {
    lineas += `<polyline fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"
      points="${s.datos.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}"/>`;
    puntos += s.datos.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.3" fill="${s.color}"/>`).join("");
  });
  return `<svg class="grafico lineas" viewBox="0 0 ${ancho} ${alto}">${ejes}${lineas}${puntos}${textos}</svg>`;
}

function cortoTexto(t, n = 24) {
  return t.length > n ? t.slice(0, n - 1).trimEnd() + "…" : t;
}

function graficoBarrasH(datos, ancho = 470) {
  const alto = datos.length * 34 + 14, max = Math.max(...datos.map(d => d.valor));
  let filas = "";
  datos.forEach((d, i) => {
    const y = i * 34 + 4, w = (d.valor / max) * (ancho - 205);
    filas += `<text x="0" y="${y + 15}" style="fill:#b9c3d1;font-size:12px">${cortoTexto(d.nombre)}</text>
      <rect x="160" y="${y + 3}" width="${w.toFixed(1)}" height="16" rx="5" fill="url(#degradadoAmarillo)"/>
      <text x="${166 + w.toFixed(1)}" y="${y + 16}" style="fill:#f2f5fa;font-size:12px">${d.valor}</text>`;
  });
  return `<svg class="grafico" viewBox="0 0 ${ancho} ${alto}">
    <defs><linearGradient id="degradadoAmarillo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffd76a"/><stop offset="100%" stop-color="#d9a512"/></linearGradient></defs>${filas}</svg>`;
}

/* ---------- calculos ---------- */
function kpis() {
  const mesActual = facturas.filter(f => f.fecha.startsWith("2026-09"));
  const facturadoMes = mesActual.reduce((s, f) => s + f.base, 0);
  const pendiente = facturas.filter(f => f.estado === "Pendiente").reduce((s, f) => s + total(f), 0);
  const bajoMinimo = recambios.filter(r => r.stock < r.mínimo);
  const ticket = facturas.length ? facturas.reduce((s, f) => s + f.base, 0) / facturas.length : 0;
  return { facturadoMes, pendiente, bajoMinimo, ticket, nFacturas: facturas.length };
}

/* ---------- vistas ---------- */
function vistaPanel() {
  const k = kpis();
  const barras = CONTABILIDAD.map(m => ({ etiqueta: m.mes.slice(0, 3).toUpperCase(), valor: m.ingresos }));
  const porTipo = TIPOS.map(t => ({ nombre: t, valor: facturas.filter(f => f.tipo === t).length })).filter(d => d.valor);
  const series = [
    { nombre: "Ingresos", color: "#ffc93c", datos: CONTABILIDAD.map(m => m.ingresos) },
    { nombre: "Gastos", color: "#ff5c5c", datos: CONTABILIDAD.map(m => m.gastos) }
  ];
  return `
  <div class="rejilla-kpi">
    <div class="kpi"><div class="kpi-eti">Facturado en septiembre</div><div class="kpi-valor">${eur(k.facturadoMes)}</div>
      <div class="kpi-pie">${facturas.filter(f => f.fecha.startsWith("2026-09")).length} facturas emitidas</div></div>
    <div class="kpi"><div class="kpi-eti">Pendiente de cobro</div><div class="kpi-valor">${eur(k.pendiente)}</div>
      <div class="kpi-pie"><span class="aviso">${facturas.filter(f => f.estado === "Pendiente").length} facturas sin cobrar</span></div></div>
    <div class="kpi"><div class="kpi-eti">Ticket medio</div><div class="kpi-valor">${eur(k.ticket)}</div>
      <div class="kpi-pie">sobre ${k.nFacturas} facturas del año</div></div>
    <div class="kpi"><div class="kpi-eti">Recambios bajo mínimo</div><div class="kpi-valor">${k.bajoMinimo.length}</div>
      <div class="kpi-pie">${k.bajoMinimo.map(r => r.ref).join(", ") || "todo en orden"}</div></div>
  </div>
  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Facturación por mes</h3>
      <span class="pista">base sin IVA, año en curso</span></div>
      <div class="tarjeta-cuerpo">${graficoBarras(barras)}</div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Reparto del trabajo</h3>
      <span class="pista">facturas por tipo</span></div>
      <div class="tarjeta-cuerpo">${graficoDonut(porTipo)}</div>
      <div class="leyenda">${porTipo.map((d, i) => `<span><i style="background:${["#ffc93c", "#3d9bff", "#35d07f", "#ff8a3d"][i % 4]}"></i>${d.nombre} (${d.valor})</span>`).join("")}</div>
    </div>
  </div>
  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Ingresos y gastos</h3><span class="pista">evolucion del año</span></div>
      <div class="tarjeta-cuerpo">${graficoLineas(series)}</div>
      <div class="leyenda"><span><i style="background:#ffc93c"></i>Ingresos</span><span><i style="background:#ff5c5c"></i>Gastos</span></div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Recambios más vendidos</h3><span class="pista">unidades del año</span></div>
      <div class="tarjeta-cuerpo">${graficoBarrasH(TOP_RECAMBIOS)}</div></div>
  </div>`;
}

function vistaFacturas() {
  const lista = facturas.filter(f => {
    const t = `${f.num} ${cliente(f.cliente).nombre} ${f.concepto}`.toLowerCase();
    return t.includes(filtro.toLowerCase());
  });
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Facturas y presupuestos</h3>
    <span class="pista">últimas 12, con su huella y su estado</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Número</th><th>Fecha</th><th>Cliente</th><th>Concepto</th><th class="derecha">Base</th>
      <th class="derecha">IVA 21%</th><th class="derecha">Total</th><th>Estado</th></tr></thead><tbody>
      ${lista.map(f => `<tr data-factura="${f.num}">
        <td class="num fuerte">${f.num}</td><td class="num suave">${f.fecha.split("-").reverse().join("/")}</td>
        <td>${cliente(f.cliente).nombre}</td><td class="suave">${f.concepto}</td>
        <td class="num derecha">${eur(f.base)}</td><td class="num derecha suave">${eur(f.base * IVA)}</td>
        <td class="num derecha fuerte">${eur(total(f))}</td>
        <td><span class="etiqueta ${estadoClase(f.estado)}">${f.estado}</span></td></tr>`).join("")}
    </tbody></table></div>
    ${lista.length ? "" : `<div class="tarjeta-cuerpo suave">Nada que mostrar con ese filtro.</div>`}
  </div>`;
}

function vistaClientes() {
  const lista = CLIENTES.filter(c => `${c.nombre} ${moto(c.id).modelo || ""} ${moto(c.id).matricula || ""}`.toLowerCase().includes(filtro.toLowerCase()));
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Fichas de clientes</h3>
    <span class="pista">con el historial de cada moto</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Cliente</th><th>Moto</th><th>Matricula</th><th class="derecha">Kilometros</th>
      <th>Cliente desde</th><th class="derecha">Facturado</th></tr></thead><tbody>
      ${lista.map(c => {
        const m = c.motos[0] || {};
        const suyo = facturas.filter(f => f.cliente === c.id);
        return `<tr data-cliente="${c.id}">
          <td class="fuerte">${c.nombre}</td><td>${m.marca || ""} ${m.modelo || ""}</td>
          <td class="num suave">${m.matricula || ""}</td>
          <td class="num derecha">${num0(m.km || 0)}</td>
          <td class="num suave">${(c.desde || "").split("-").reverse().join("/")}</td>
          <td class="num derecha fuerte">${eur(suyo.reduce((s, f) => s + f.base, 0))}</td></tr>`;
      }).join("")}
    </tbody></table></div>
  </div>`;
}

function vistaOrdenes() {
  const estados = ["Recibida", "En taller", "Esperando recambio", "Lista"];
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Ordenes de trabajo</h3>
    <span class="pista">donde esta cada moto y que le falta</span></div>
    <div class="tarjeta-cuerpo"><div class="kanban">
    ${estados.map(e => {
      const grupo = ORDENES.filter(o => o.estado === e);
      return `<div class="columna"><h4>${e}<span>${grupo.length}</span></h4>
        ${grupo.map(o => `<div class="tarjeta-ot" data-orden="${o.num}"><b>${cliente(o.cliente).nombre}</b>
          <div class="moto">${o.moto} · ${o.trabajo}</div>
          <div class="pie"><span>${o.num}</span><span>prevista ${o.prevista.split("-").reverse().join("/")}</span></div></div>`).join("") || `<div class="suave" style="font-size:13px">Sin motos aqui</div>`}
      </div>`;
    }).join("")}
    </div></div>
  </div>`;
}

function vistaRecambios() {
  const lista = recambios.filter(r => `${r.ref} ${r.nombre} ${r.proveedor}`.toLowerCase().includes(filtro.toLowerCase()));
  return `
  <div class="tarjeta"><div class="tarjeta-cab"><h3>Inventario de recambios</h3>
    <span class="pista">stock, mínimos y margen de cada pieza</span></div>
    <div class="tabla-scroll"><table><thead><tr>
      <th>Referencia</th><th>Pieza</th><th class="derecha">Stock</th><th class="derecha">Minimo</th>
      <th class="derecha">Coste</th><th class="derecha">PVP</th><th class="derecha">Margen</th><th>Aviso</th><th></th></tr></thead><tbody>
      ${lista.map(r => {
        const margen = ((r.pvp - r.coste) / r.pvp) * 100;
        const bajo = r.stock < r.mínimo;
        return `<tr data-recambio="${r.ref}">
          <td class="num suave">${r.ref}</td><td class="fuerte">${r.nombre}</td>
          <td class="num derecha">${r.stock}</td><td class="num derecha suave">${r.mínimo}</td>
          <td class="num derecha suave">${eur(r.coste)}</td><td class="num derecha">${eur(r.pvp)}</td>
          <td class="num derecha">${margen.toFixed(0)}%</td>
          <td><span class="etiqueta ${bajo ? "e-bajo" : "e-ok"}">${bajo ? "Pedir" : "Correcto"}</span></td>
          <td><button class="btn secundario" data-reponer="${r.ref}">Reponer</button></td></tr>`;
      }).join("")}
    </tbody></table></div>
  </div>`;
}

function vistaContabilidad() {
  const iTrim = CONTABILIDAD.slice(6).reduce((s, m) => s + m.ingresos, 0);
  const gTrim = CONTABILIDAD.slice(6).reduce((s, m) => s + m.gastos, 0);
  const ivaRep = iTrim * IVA, ivaSop = gTrim * IVA;
  const anio = CONTABILIDAD.reduce((s, m) => s + m.ingresos, 0);
  const gastoAnio = CONTABILIDAD.reduce((s, m) => s + m.gastos, 0);
  const totalGastos = GASTOS_MES.reduce((s, g) => s + g.importe, 0);
  return `
  <div class="rejilla-kpi">
    <div class="kpi"><div class="kpi-eti">Ingresos del trimestre</div><div class="kpi-valor">${eur(iTrim)}</div>
      <div class="kpi-pie">julio, agosto y septiembre</div></div>
    <div class="kpi"><div class="kpi-eti">Gastos del trimestre</div><div class="kpi-valor">${eur(gTrim)}</div>
      <div class="kpi-pie">${(totalGastos / 1000).toFixed(1)} mil al mes de estructura</div></div>
    <div class="kpi"><div class="kpi-eti">IVA a ingresar</div><div class="kpi-valor">${eur(ivaRep - ivaSop)}</div>
      <div class="kpi-pie">repercutido ${eur(ivaRep)} menos soportado ${eur(ivaSop)}</div></div>
    <div class="kpi"><div class="kpi-eti">Resultado del año</div><div class="kpi-valor">${eur(anio - gastoAnio)}</div>
      <div class="kpi-pie">${eur(anio)} de ingresos, ${eur(gastoAnio)} de gastos</div></div>
  </div>
  <div class="dos-columnas">
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Ingresos y gastos mes a mes</h3><span class="pista">año en curso</span></div>
      <div class="tarjeta-cuerpo">${graficoLineas([
        { nombre: "Ingresos", color: "#ffc93c", datos: CONTABILIDAD.map(m => m.ingresos) },
        { nombre: "Gastos", color: "#ff5c5c", datos: CONTABILIDAD.map(m => m.gastos) }])}</div></div>
    <div class="tarjeta"><div class="tarjeta-cab"><h3>Gastos de estructura</h3><span class="pista">mes en curso</span></div>
      <div class="tarjeta-cuerpo"><table><tbody>
      ${GASTOS_MES.map(g => `<tr><td>${g.concepto}</td><td class="suave num derecha">${g.tipo}</td>
        <td class="num derecha fuerte">${eur(g.importe)}</td></tr>`).join("")}
      <tr><td class="fuerte">Total</td><td></td><td class="num derecha fuerte">${eur(totalGastos)}</td></tr>
      </tbody></table></div>
      <div class="leyenda"><span>Los impuestos del trimestre se calculan solos con los datos del año.</span></div></div>
  </div>`;
}

/* ---------- modales ---------- */
function modalFactura(número) {
  const f = facturas.find(x => x.num === número); if (!f) return;
  const c = cliente(f.cliente), m = c.motos[0] || {};
  abrirModal(`Factura ${f.num}`, `
    <div class="fila-datos"><span>Cliente</span><b>${c.nombre}</b></div>
    <div class="fila-datos"><span>Moto</span><b>${m.marca || ""} ${m.modelo || ""} · ${m.matricula || ""}</b></div>
    <div class="fila-datos"><span>Concepto</span><b>${f.concepto}</b></div>
    <div class="fila-datos"><span>Fecha</span><b>${f.fecha.split("-").reverse().join("/")}</b></div>
    <div class="fila-datos"><span>Base imponible</span><b class="num">${eur(f.base)}</b></div>
    <div class="fila-datos"><span>IVA 21%</span><b class="num">${eur(f.base * IVA)}</b></div>
    <div class="fila-datos"><span>Total</span><b class="num" style="color:#ffc93c">${eur(total(f))}</b></div>
    <div class="fila-datos"><span>Estado</span><span class="etiqueta ${estadoClase(f.estado)}">${f.estado}</span></div>
    <div class="sub-bloque"><h4>Registro inalterable</h4>
      <div class="hash">${hashFactura(f)}</div>
      <div class="nota-legal">Huella de la factura: si alguien cambia un importe o una fecha, la huella deja de coincidir. Así se cumple la obligación de conservar el registro sin poder alterarlo.</div></div>
    <div class="campo-doble">
      <button class="btn" data-cobrar="${f.num}">${f.estado === "Pendiente" ? "Marcar como cobrada" : "Marcar como pendiente"}</button>
      <button class="btn secundario" data-pdf="${f.num}">Descargar PDF</button>
    </div>`);
}

function modalCliente(id) {
  const c = cliente(id), m = c.motos[0] || {};
  const suyas = facturas.filter(f => f.cliente === id);
  abrirModal(c.nombre, `
    <div class="fila-datos"><span>Teléfono</span><b>${c.telefono}</b></div>
    <div class="fila-datos"><span>Correo</span><b>${c.email}</b></div>
    <div class="fila-datos"><span>Cliente desde</span><b>${(c.desde || "").split("-").reverse().join("/")}</b></div>
    <div class="sub-bloque"><h4>Moto</h4>
      <div class="fila-datos"><span>Modelo</span><b>${m.marca || ""} ${m.modelo || ""} (${m.anyo || ""})</b></div>
      <div class="fila-datos"><span>Matricula</span><b class="num">${m.matricula || ""}</b></div>
      <div class="fila-datos"><span>Kilometros</span><b class="num">${num0(m.km || 0)} km</b></div></div>
    <div class="sub-bloque"><h4>Historial de trabajos</h4>
      <div class="historial">
        ${suyas.map(f => `<div><b>${f.fecha.split("-").reverse().join("/")}</b><span>${f.concepto}</span>
          <span style="margin-left:auto" class="num">${eur(total(f))}</span></div>`).join("") || "<div class='suave'>Sin trabajos registrados</div>"}
      </div></div>
    <div class="nota-legal">Avisos automaticos: cuando la moto toque revisión o ITV, el sistema se lo recuerda por WhatsApp.</div>`);
}

function modalRecambio(ref) {
  const r = recambios.find(x => x.ref === ref); if (!r) return;
  const margen = ((r.pvp - r.coste) / r.pvp) * 100;
  abrirModal(r.nombre, `
    <div class="fila-datos"><span>Referencia</span><b class="num">${r.ref}</b></div>
    <div class="fila-datos"><span>Proveedor</span><b>${r.proveedor}</b></div>
    <div class="fila-datos"><span>Stock actual</span><b class="num">${r.stock} unidades</b></div>
    <div class="fila-datos"><span>Minimo de seguridad</span><b class="num">${r.mínimo}</b></div>
    <div class="fila-datos"><span>Precio de coste</span><b class="num">${eur(r.coste)}</b></div>
    <div class="fila-datos"><span>Precio de venta</span><b class="num">${eur(r.pvp)}</b></div>
    <div class="fila-datos"><span>Margen</span><b class="num" style="color:#35d07f">${margen.toFixed(1)}%</b></div>
    ${r.stock < r.mínimo ? `<div class="nota-legal">Esta pieza esta por debajo del mínimo. En la version definitiva el aviso llega por correo al proveedor con un clic.</div>` : ""}
    <button class="btn" data-reponer="${r.ref}">Reponer hasta el mínimo mas 10</button>`);
}

function modalNuevaFactura() {
  abrirModal("Nueva factura", `
    <div class="campo"><label>Cliente</label><select id="nf-cliente">
      ${CLIENTES.map(c => `<option value="${c.id}">${c.nombre} · ${(c.motos[0] || {}).modelo || ""}</option>`).join("")}
    </select></div>
    <div class="campo"><label>Concepto</label><input id="nf-concepto" placeholder="Revisión, cambio de neumático, averia..." value=""></div>
    <div class="campo-doble">
      <div class="campo"><label>Base sin IVA</label><input id="nf-base" type="number" min="0" step="0.01" value="120"></div>
      <div class="campo"><label>Tipo de trabajo</label><select id="nf-tipo">${TIPOS.map(t => `<option>${t}</option>`).join("")}</select></div>
    </div>
    <div class="fila-datos"><span>IVA 21%</span><b class="num" id="nf-iva">${eur(120 * IVA)}</b></div>
    <div class="fila-datos"><span>Total</span><b class="num" id="nf-total" style="color:#ffc93c">${eur(120 * (1 + IVA))}</b></div>
    <div class="nota-legal">Al guardar, la factura entra en el registro con su número correlativo y su huella. Se puede descargar en PDF con el logo del taller y enviar por WhatsApp al cliente.</div>
    <button class="btn" id="nf-guardar">Guardar factura</button>`);
  const base = document.querySelector("#nf-base");
  const pintar = () => {
    const v = parseFloat(base.value) || 0;
    document.querySelector("#nf-iva").textContent = eur(v * IVA);
    document.querySelector("#nf-total").textContent = eur(v * (1 + IVA));
  };
  base.addEventListener("input", pintar);
  document.querySelector("#nf-guardar").addEventListener("click", () => {
    const b = parseFloat(base.value) || 0;
    const concepto = document.querySelector("#nf-concepto").value.trim() || "Trabajo de taller";
    const ultimo = facturas.map(f => parseInt(f.num.split("-").pop(), 10)).sort((a, b2) => b2 - a)[0] || 0;
    facturas.unshift({
      num: `RB-2026-${String(ultimo + 1).padStart(4, "0")}`,
      fecha: new Date().toISOString().slice(0, 10),
      cliente: document.querySelector("#nf-cliente").value,
      concepto, base: b, tipo: document.querySelector("#nf-tipo").value, estado: "Pendiente"
    });
    cerrarModal();
    pintarTodo();
  });
}

/* ---------- modal generico ---------- */
function abrirModal(titulo, html) {
  const velo = document.querySelector("#velo");
  document.querySelector("#modal-titulo").textContent = titulo;
  document.querySelector("#modal-cuerpo").innerHTML = html;
  velo.classList.add("visible");
}
function cerrarModal() { document.querySelector("#velo").classList.remove("visible"); }

/* ---------- pintar ---------- */
function pintarTodo() {
  document.querySelectorAll(".menu button").forEach(b => b.classList.toggle("activo", b.dataset.seccion === seccion));
  const contenido = document.querySelector("#contenido");
  contenido.innerHTML = ({
    panel: vistaPanel, facturas: vistaFacturas, clientes: vistaClientes,
    ordenes: vistaOrdenes, recambios: vistaRecambios, contabilidad: vistaContabilidad
  }[seccion])();
  const titulos = {
    panel: "Panel del taller", facturas: "Facturas", clientes: "Clientes",
    ordenes: "Ordenes de trabajo", recambios: "Recambios", contabilidad: "Contabilidad"
  };
  document.querySelector("#titulo").textContent = titulos[seccion];
  const subtitulos = {
    panel: "Todo lo del día en una pantalla",
    facturas: "Facturas, presupuestos y cobros pendientes",
    clientes: "Fichas con el historial de cada moto",
    ordenes: "Dónde está cada moto y qué le falta",
    recambios: "Stock, mínimos y margen de cada pieza",
    contabilidad: "Ingresos, gastos, IVA y resultado"
  };
  document.querySelector("#subtitulo").textContent = subtitulos[seccion];
  const k = kpis();
  const cuentas = {
    facturas: facturas.length, clientes: CLIENTES.length,
    ordenes: ORDENES.filter(o => o.estado !== "Entregada").length, recambios: k.bajoMinimo.length || ""
  };
  document.querySelectorAll(".menu button").forEach(b => {
    const c = b.querySelector(".cuenta");
    if (c) c.textContent = cuentas[b.dataset.seccion] ?? "";
  });
  const cb = document.querySelector("#btn-nueva");
  cb.classList.toggle("oculto", seccion !== "facturas");
}

/* ---------- eventos ---------- */
document.addEventListener("click", ev => {
  const nav = ev.target.closest(".menu button");
  if (nav) { seccion = nav.dataset.seccion; filtro = document.querySelector("#buscar").value = ""; pintarTodo(); return; }

  const rowF = ev.target.closest("[data-factura]");
  if (rowF) { modalFactura(rowF.dataset.factura); return; }

  const rowC = ev.target.closest("[data-cliente]");
  if (rowC) { modalCliente(rowC.dataset.cliente); return; }

  const rowR = ev.target.closest("[data-recambio]");
  if (rowR && !ev.target.closest("[data-reponer]")) { modalRecambio(rowR.dataset.recambio); return; }

  const rowO = ev.target.closest("[data-orden]");
  if (rowO) {
    const o = ORDENES.find(x => x.num === rowO.dataset.orden);
    abrirModal(`Orden ${o.num}`, `
      <div class="fila-datos"><span>Cliente</span><b>${cliente(o.cliente).nombre}</b></div>
      <div class="fila-datos"><span>Moto</span><b>${o.moto}</b></div>
      <div class="fila-datos"><span>Trabajo</span><b>${o.trabajo}</b></div>
      <div class="fila-datos"><span>Entrada</span><b>${o.entrada.split("-").reverse().join("/")}</b></div>
      <div class="fila-datos"><span>Entrega prevista</span><b>${o.prevista.split("-").reverse().join("/")}</b></div>
      <div class="fila-datos"><span>Estado</span><span class="etiqueta ${estadoClase(o.estado)}">${o.estado}</span></div>
      <div class="nota-legal">Cuando la moto cambie de estado, en la version definitiva el cliente recibe un aviso por WhatsApp y tu ves la orden actualizada en el movil.</div>`);
    return;
  }

  const cobrar = ev.target.closest("[data-cobrar]");
  if (cobrar) {
    const f = facturas.find(x => x.num === cobrar.dataset.cobrar);
    f.estado = f.estado === "Pendiente" ? "Cobrada" : "Pendiente";
    cerrarModal(); pintarTodo(); return;
  }

  const pdf = ev.target.closest("[data-pdf]");
  if (pdf) {
    abrirModal("PDF de la factura", `<div class="nota-legal">Esta vista previa no genera el PDF, pero en la version definitiva sale con el logo del taller, la numeracion, el desglose de IVA, la huella y el codigo QR de la factura, listo para imprimir o enviar.</div>
      <div class="campo-doble"><button class="btn secundario" id="cerrar2">Cerrar</button>
      <button class="btn" data-wa="1">Enviar por WhatsApp al cliente</button></div>`);
    return;
  }

  const wa = ev.target.closest("[data-wa]");
  if (wa) { abrirModal("Envio al cliente", `<div class="nota-legal">Enviado. En la version definitiva se manda el PDF por WhatsApp al cliente desde el propio taller y queda registrado el envio.</div><button class="btn" id="cerrar3">Entendido</button>`); return; }

  const reponer = ev.target.closest("[data-reponer]");
  if (reponer) {
    const r = recambios.find(x => x.ref === reponer.dataset.reponer);
    r.stock = r.mínimo + 10;
    cerrarModal(); pintarTodo(); return;
  }

  if (ev.target.closest("#cerrar2") || ev.target.closest("#cerrar3")) { cerrarModal(); return; }
  if (ev.target.id === "velo" || ev.target.closest(".cerrar")) { cerrarModal(); return; }
});

document.addEventListener("DOMContentLoaded", () => {
  const vistas = ["panel", "facturas", "clientes", "ordenes", "recambios", "contabilidad"];
  const pedida = (location.hash || "").replace("#", "");
  if (vistas.includes(pedida)) seccion = pedida;
  document.querySelector("#buscar").addEventListener("input", ev => { filtro = ev.target.value; pintarTodo(); });
  document.querySelector("#btn-nueva").addEventListener("click", modalNuevaFactura);
  pintarTodo();
  const detalle = new URLSearchParams(location.search).get("detalle");
  if (detalle && detalle.indexOf("factura:") === 0) modalFactura(detalle.split(":")[1]);
});
