import { ManuscriptDocument } from "../types";

// PENDIENTE (procedencia de las imágenes de demostración):
// Ambas `imageUrl` proceden del prototipo original y su procedencia NO está
// verificada. La primera devuelve 404 en Wikimedia Commons; la segunda es una
// fotografía de stock de Unsplash que no corresponde al documento descrito.
// Antes de usar esto como demostración pública, sustitúyelas por escaneos con
// origen, licencia y atribución comprobados.

export const SAMPLE_MANUSCRIPTS: ManuscriptDocument[] = [
  {
    id: "agi-santo-domingo-1597",
    title: "AGI, Santo Domingo, Leg. 868 - Real Cédula de Pobladores (1597-1608)",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Manuscrito_Paleografico_AGI_Santo_Domingo_1597.jpg", // 404: pendiente de sustituir
    archivalMetadata: {
      title: "Real Cédula para la repoblación de la Isla Española (Santo Domingo)",
      archive: "Archivo General de Indias (AGI), Sevilla",
      section: "Sección V: Gobierno, Santo Domingo / Registro de Oficios y Partes",
      signature: "AGI, Santo Domingo, Leg. 868 / PARES (50.) 1",
      date: "29 de febrero de 1597 (Registrado en el periodo 1597-1608)",
      scriptType: "Escritura Procesal Encadenada / Humanística Cancilleresca",
      reign: "Felipe II (1556-1598)",
      summary: "Relación de personas despachadas por la Casa de la Contratación de Sevilla para poblar la Isla Española (Santo Domingo) tras la despoblación causada por las expediciones del Licenciado García, Obispo de Palencia. Contiene la Real Cédula firmada por El Rey concediendo permiso general de embarque.",
    },
    literalTranscription: `1597 á 1608. (50.) 1

R[elaci]on de las Personas que se an despa[cha]do Por la casa de la con[tra]
tacion de la ciudad de sevilla para la isla de s[an]to domingo de la ysla española
por pobladores dellas des de [cuatro] de abril de [1597] de mill
y qui[nient]os y noventa y siete a[ñ]os hasta diez de septi[emb]re de [1608] mill y seys[cien]tos
y ocho a[ñ]os que ay un periodo de once a[ñ]os en conformidad de Una
R[ea]l Cédula de Su M[ajes]tad de la qual se da traslado al señor Libros de la contratacion de la casa de la Ju[sticia]
Cuya copia esta con los Libros de la contratacion de la casa de la Ju[sticia]
Señor de la d[ic]ha R[ea]l cedula oye los nombres de las tales personas y de
Sus naturalezas Se como se sigue:

EL REY

N[uest]ros Oficiales que Residen en la casa de sev[ill]a
de la contratacion de las Yndias: baltasar garcia con[veci]no
de la ciu[da]d de san domingo de la Ysla española me a he[ch]o
R[ela]cion que a causa de la mucha gente que de
aquella isla se a salido en socorro d[el] L[icencia]do garcia obispo de
Palencia a quedado muy despoblada y que
a nuestro servicio y buen poblamiento de la d[ic]ha isla
conviene de traspasar la gente que a ella quisiere
Ir para que la poblasen y me suplico Concediesse
de ese permiso general a todos los que quisieren
Ir a la d[ic]ha isla de los Reinos que lo pudieren hazer
y Sobrem[an]do Sin embargo de la prohibicion que d[e]llos
nos el Caer ha o como La nuestra merced fuesse
Lo qual visto por los del n[uest]ro C[onse]jo de las Yndias fue
acordado que deviamos mandar dar esta n[uest]ra
R[ea]l c[édu]la para vos Por la qual os m[anda]mos
que de aqui a quando de las Personas quisieren
pasar a la d[ic]ha isla la dexeis pasar y per
mitais pasar y no se an de la [prohibicion / vada]
Vada que no sean de los prohibidos
Da[da] a 20 Y nueve de febrero de [1597] a[ñ]os. yo el rey
y entre [líneas] q[ue] dia de la [seña]l esto Vale`,
    normalizedVersion: `1597 a 1608. (50.) 1

Relación de las personas que se han despachado por la Casa de la Contratación de la ciudad de Sevilla para la isla de Santo Domingo de la Española, por pobladores de ellas, desde el cuatro de abril de 1597 (de mil y quinientos noventa y siete años) hasta el diez de septiembre de 1608 (mil seiscientos ocho años), que hay un periodo de once años, en conformidad de una Real Cédula de Su Majestad, de la cual se da traslado a los libros de la Contratación de la Casa de la Justicia. Cuya copia está con los libros de la Contratación de la Casa de la Justicia.
Señor, de la dicha Real Cédula ved los nombres de las tales personas y de sus naturalezas como se sigue:

EL REY

Nuestros Oficiales que residen en la ciudad de Sevilla, de la Contratación de las Indias:
Baltasar García, vecino de la ciudad de Santo Domingo de la Isla Española, me ha hecho relación que, a causa de la mucha gente que de aquella isla ha salido en socorro del Licenciado García, Obispo de Palencia, ha quedado muy despoblada; y que a nuestro servicio y buen poblamiento de la dicha isla conviene traspasar la gente que a ella quisiere ir para que la poblasen, y me suplicó concediese ese permiso general a todos los que quisieren ir a la dicha isla desde los Reinos que lo pudieren hacer, sin embargo de la prohibición que de ellos nos estuviese dada, o como la nuestra merced fuese.

Lo cual, visto por los de nuestro Consejo de las Indias, fue acordado que debíamos mandar dar esta nuestra Real Cédula para vos. Por la cual os mandamos que de aquí en adelante a todas las personas que quisieren pasar a la dicha isla las dejéis pasar y permitáis pasar, con tal de que no sean de los prohibidos.

Dada a 29 de febrero de 1597 años.
YO EL REY
(Y entre líneas: que el día de la señal esto vale).`,
    lineByLine: [
      { lineNumber: 1, literal: "1597 á 1608. (50.) 1", normalized: "1597 a 1608. (50.) 1", notes: "Cabecera de registro del legajo" },
      { lineNumber: 2, literal: "R[elaci]on de las Personas que se an despa[cha]do Por la casa de la con[tra]", normalized: "Relación de las personas que se han despachado por la Casa de la Contratación", notes: "Abreviatura Rón -> Relación, despa.do -> despachado" },
      { lineNumber: 3, literal: "tacion de la ciudad de sevilla para la isla de s[an]to domingo de la ysla española", normalized: "de la ciudad de Sevilla para la isla de Santo Domingo de la Española,", notes: "s.to -> Santo. Grafía 'ysla' con 'y'" },
      { lineNumber: 4, literal: "por pobladores dellas des de [cuatro] de abril de [1597] de mill", normalized: "por pobladores de ellas, desde el cuatro de abril de 1597", notes: "dellas -> de ellas (asimilación gráfica)" },
      { lineNumber: 5, literal: "y qui[nient]os y noventa y siete a[ñ]os hasta diez de septi[emb]re de [1608] mill y seys[cien]tos", normalized: "de mil quinientos noventa y siete años hasta el diez de septiembre de 1608,", notes: "septi.bre -> septiembre" },
      { lineNumber: 6, literal: "y ocho a[ñ]os que ay un periodo de once a[ñ]os en conformidad de Una", normalized: "que hay un periodo de once años, en conformidad de una", notes: "Periodo archivístico registrado" },
      { lineNumber: 7, literal: "R[ea]l Cédula de Su M[ajes]tad de la qual se da traslado al señor Libros de la contratacion...", normalized: "Real Cédula de Su Majestad, de la cual se da traslado...", notes: "R.l -> Real, S.M. -> Su Majestad" },
      { lineNumber: 8, literal: "Cuya copia esta con los Libros de la contratacion de la casa de la Ju[sticia]", normalized: "Cuya copia está con los libros de la Contratación de la Casa de la Justicia.", notes: "Ju.a -> Justicia" },
      { lineNumber: 9, literal: "Señor de la d[ic]ha R[ea]l cedula oye los nombres de las tales personas y de", normalized: "Señor, de la dicha Real Cédula ved los nombres de las tales personas y de", notes: "dha -> dicha, Rl -> Real" },
      { lineNumber: 10, literal: "Sus naturalezas Se como se sigue:", normalized: "sus naturalezas como se sigue:", notes: "Fórmula de presentación del catálogo" },
      { lineNumber: 11, literal: "EL REY", normalized: "EL REY", notes: "Encabezamiento regio de Felipe II" },
      { lineNumber: 12, literal: "N[uest]ros Oficiales que Residen en la casa de sev[ill]a", normalized: "Nuestros Oficiales que residen en la Casa de Sevilla,", notes: "Nros -> Nuestros" },
      { lineNumber: 13, literal: "de la contratacion de las Yndias: baltasar garcia con[veci]no", normalized: "de la Contratación de las Indias: Baltasar García, vecino", notes: "con.no -> convenecino / vecino" },
      { lineNumber: 14, literal: "de la ciu[da]d de san domingo de la Ysla española me a he[ch]o", normalized: "de la ciudad de Santo Domingo de la Isla Española, me ha hecho", notes: "ciu.d -> ciudad, he.o -> hecho" },
      { lineNumber: 15, literal: "R[ela]cion que a causa de la mucha gente que de", normalized: "relación que, a causa de la mucha gente que de", notes: "Rón -> relación" },
      { lineNumber: 16, literal: "aquella isla se a salido en socorro d[el] L[icencia]do garcia obispo de", normalized: "aquella isla ha salido en socorro del Licenciado García, Obispo de", notes: "L.do -> Licenciado" },
      { lineNumber: 17, literal: "Palencia a quedado muy despoblada y que", normalized: "Palencia, ha quedado muy despoblada; y que", notes: "Motivo histórico del despacho" },
      { lineNumber: 18, literal: "a nuestro servicio y buen poblamiento de la d[ic]ha isla", normalized: "a nuestro servicio y buen poblamiento de la dicha isla", notes: "dha -> dicha" },
      { lineNumber: 19, literal: "conviene de traspasar la gente que a ella quisiere", normalized: "conviene traspasar la gente que a ella quisiere", notes: "Sintaxis procesal de la época" },
      { lineNumber: 20, literal: "Ir para que la poblasen y me suplico Concediesse", normalized: "ir para que la poblasen, y me suplicó concediese", notes: "Suplicación formal al Monarca" },
      { lineNumber: 21, literal: "de ese permiso general a todos los que quisieren", normalized: "ese permiso general a todos los que quisieren", notes: "Petición de franquicia general" },
      { lineNumber: 22, literal: "Ir a la d[ic]ha isla de los Reinos que lo pudieren hazer", normalized: "ir a la dicha isla desde los Reinos que lo pudieren hacer,", notes: "dha -> dicha" },
      { lineNumber: 23, literal: "y Sobrem[an]do Sin embargo de la prohibicion que d[e]llos", normalized: "sin embargo de la prohibición que de ellos", notes: "Sobrem.do -> sobremando" },
      { lineNumber: 24, literal: "nos el Caer ha o como La nuestra merced fuesse", normalized: "nos estuviese dada, o como la nuestra merced fuese.", notes: "Fórmula cancilleresca de dispensa" },
      { lineNumber: 25, literal: "Lo qual visto por los del n[uest]ro C[onse]jo de las Yndias fue", normalized: "Lo cual, visto por los de nuestro Consejo de las Indias, fue", notes: "C.jo -> Consejo, ntro -> nuestro" },
      { lineNumber: 26, literal: "acordado que deviamos mandar dar esta n[uest]ra", normalized: "acordado que debíamos mandar dar esta nuestra", notes: "deviamos con 'v' ortográfica" },
      { lineNumber: 27, literal: "R[ea]l c[édu]la para vos Por la qual os m[anda]mos", normalized: "Real Cédula para vos, por la cual os mandamos", notes: "m.mos -> mandamos" },
      { lineNumber: 28, literal: "que de aqui a quando de las Personas quisieren", normalized: "que de aquí en adelante a todas las personas que quisieren", notes: "Sintaxis de mandato dispositivo" },
      { lineNumber: 29, literal: "pasar a la d[ic]ha isla la dexeis pasar y per", normalized: "pasar a la dicha isla las dejéis pasar y per-", notes: "dha -> dicha, dexeis con 'x' / /ʃ/" },
      { lineNumber: 30, literal: "mitais pasar y no se an de la [prohibicion / vada]", normalized: "mitáis pasar, con tal de que no sean de los prohibidos.", notes: "Cláusula de limpieza de sangre / pasaje" },
      { lineNumber: 31, literal: "Vada que no sean de los prohibidos", normalized: "que no sean de los prohibidos.", notes: "Prohibición de judíos, moriscos o conversos" },
      { lineNumber: 32, literal: "Da[da] a 20 Y nueve de febrero de [1597] a[ñ]os. yo el rey", normalized: "Dada a 29 de febrero de 1597 años. YO EL REY", notes: "Da.da -> dada. Firma de Felipe II" },
      { lineNumber: 33, literal: "y entre [líneas] q[ue] dia de la [seña]l esto Vale", normalized: "Y entre líneas: que el día de la señal esto vale.", notes: "Fe de corrección interlineada de escribano" },
    ],
    abbreviationsList: [
      { abbreviation: "R[elaci]on", expansion: "Relación", meaning: "Informe o lista ordenada de personas y materias." },
      { abbreviation: "despa[cha]do", expansion: "despachado", meaning: "Embarcado legalmente tras pagar derechos en la Contratación." },
      { abbreviation: "con[tra]tacion", expansion: "contratación", meaning: "Real Casa de la Contratación de Indias de Sevilla." },
      { abbreviation: "s[an]to", expansion: "santo", meaning: "Santo (topónimo Santo Domingo)." },
      { abbreviation: "septi[emb]re", expansion: "septiembre", meaning: "Mes de septiembre." },
      { abbreviation: "R[ea]l", expansion: "Real", meaning: "Relativo al Rey o Monarquía Hispánica." },
      { abbreviation: "M[ajes]tad", expansion: "Majestad", meaning: "Tratamiento reservado al Monarca." },
      { abbreviation: "Ju[sticia]", expansion: "Justicia", meaning: "Instancia judicial o de gobernación." },
      { abbreviation: "d[ic]ha / d[ic]ho", expansion: "dicha / dicho", meaning: "Mencionado previamente." },
      { abbreviation: "N[uest]ros", expansion: "Nuestros", meaning: "Pronombre regio en plural de majestad." },
      { abbreviation: "sev[ill]a", expansion: "Sevilla", meaning: "Puerto y sede de la Casa de la Contratación." },
      { abbreviation: "con[veci]no", expansion: "convenecino", meaning: "Vecino estante o residente." },
      { abbreviation: "ciu[da]d", expansion: "ciudad", meaning: "Núcleo urbano con fuero." },
      { abbreviation: "L[icencia]do", expansion: "Licenciado", meaning: "Título universitario en Leyes o Cánones." },
      { abbreviation: "C[onse]jo", expansion: "Consejo", meaning: "Real y Supremo Consejo de las Indias." },
      { abbreviation: "c[édu]la", expansion: "cédula", meaning: "Disposición legal firmada por el Rey." },
      { abbreviation: "m[anda]mos", expansion: "mandamos", meaning: "Verbo imperativo de mandato regio." },
    ]
  },
  {
    id: "ags-felipe-ii-1571",
    title: "Archivo General de Simancas (AGS) - Estado, Leg. 254 - Carta de Felipe II",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80",
    archivalMetadata: {
      title: "Carta autógrafa de Felipe II a don Juan de Austria sobre la Liga Santa",
      archive: "Archivo General de Simancas (AGS), Valladolid",
      section: "Secretaría de Estado, Negociaciones de Italia",
      signature: "AGS, Estado, Leg. 254, fol. 12",
      date: "14 de junio de 1571",
      scriptType: "Escritura Humanística Itálica de Mano Real",
      reign: "Felipe II (1556-1598)",
      summary: "Instrucciones reservadas enviadas por el Rey a su hermano don Juan de Austria para la preparación de la Armada de la Liga Santa antes de la Batalla de Lepanto.",
    },
    literalTranscription: `Don p[edr]o de la gasca n[uest]ro p[re]sidente de la au[dienci]a
R[ea]l que reside en la ciu[da]d de los Reyes de las p[rovinci]as del peru
por q[ue] somos informados q[ue] conviene a n[uest]ro s[ervi]cio...`,
    normalizedVersion: `Don Pedro de la Gasca, nuestro Presidente de la Audiencia Real que reside en la Ciudad de los Reyes de las Provincias del Perú, porque somos informados que conviene a nuestro servicio...`,
    lineByLine: [
      { lineNumber: 1, literal: "Don p[edr]o de la gasca n[uest]ro p[re]sidente de la au[dienci]a", normalized: "Don Pedro de la Gasca, nuestro Presidente de la Audiencia", notes: "Abreviatura p.ro -> Pedro, p.sidente -> Presidente" },
      { lineNumber: 2, literal: "R[ea]l que reside en la ciu[da]d de los Reyes de las p[rovinci]as del peru", normalized: "Real que reside en la Ciudad de los Reyes de las provincias del Perú,", notes: "ciu.d -> ciudad" },
      { lineNumber: 3, literal: "por q[ue] somos informados q[ue] conviene a n[uest]ro s[ervi]cio...", normalized: "porque somos informados que conviene a nuestro servicio...", notes: "ntro -> nuestro, s.cio -> servicio" },
    ],
    abbreviationsList: [
      { abbreviation: "p[edr]o", expansion: "Pedro", meaning: "Nombre propio." },
      { abbreviation: "p[re]sidente", expansion: "Presidente", meaning: "Presidente de la Real Audiencia." },
      { abbreviation: "au[dienci]a", expansion: "Audiencia", meaning: "Tribunal superior de justicia." },
    ]
  }
];
