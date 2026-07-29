import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Comparar archivos Excel celda por celda en el navegador — sin subirlos | runlocally',
    description:
      'Compara dos libros XLSX, XLSM o XLS por nombre de hoja, número de fila y posición de columna. Revisa los valores distintos sin subir los archivos.',
    ogTitle: 'Comparar libros de Excel celda por celda — sin subir archivos',
    ogDescription:
      'Encuentra diferencias de valores entre dos libros de Excel en el navegador. Los archivos permanecen en tu dispositivo.',
  },

  hero: {
    h1: 'Comparar libros de Excel',
    tagline:
      'Compara dos archivos XLSX, XLSM o XLS por nombre de hoja y posición de celda. No se sube ningún archivo.',
  },

  intro: {
    h2: 'Una comparación centrada en los valores de las celdas',
    paras: [
      'Selecciona dos libros de Excel y la herramienta comparará las hojas cuyos nombres coincidan. Dentro de cada hoja, relaciona las filas por número y las celdas por posición de columna. El resultado muestra solo las celdas distintas, junto con el número de filas coincidentes y celdas diferentes de cada hoja.',
      'Este MVP convierte los valores leídos en texto antes de compararlos. No tiene en cuenta formatos numéricos, colores, fuentes, bordes, anchos de columna, comentarios ni otros aspectos visuales. Las hojas que solo aparecen en uno de los libros se enumeran por separado, sin asociarlas por similitud de nombre.',
    ],
  },

  privacy: {
    h2: 'Los datos de los libros se quedan en el navegador',
    lead:
      'Los dos archivos se leen en tu dispositivo. No hay un paso de subida ni un procesador de libros en un servidor.',
    points: [
      'La lectura y la comparación se realizan en el navegador.',
      'Solo se leen los dos archivos elegidos; los originales no se modifican.',
      'Las exportaciones JSON y CSV contienen el resultado, no un libro combinado.',
      'El código fuente se puede consultar bajo la licencia MIT.',
    ],
    note:
      'Durante la comparación puedes abrir el panel Red del navegador para comprobar que ninguna petición transporta los libros.',
    sourceLinkText: 'Consultar el código fuente.',
  },

  howto: {
    h2: 'Cómo comparar dos libros',
    steps: [
      {
        h3: 'Selecciona el archivo A y el archivo B',
        p: 'Elige un libro XLSX, XLSM o XLS para cada lado. También puedes soltar exactamente dos libros sobre la página.',
      },
      {
        h3: 'Compara las hojas coincidentes',
        p: 'Inicia la comparación. Las hojas con el mismo nombre se revisan en las mismas posiciones de fila y columna.',
      },
      {
        h3: 'Revisa o exporta las diferencias',
        p: 'Consulta las celdas modificadas, filtra la lista y exporta el resultado como JSON o CSV si lo necesitas.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se suben mis archivos de Excel?',
      a: 'No. Los dos libros se leen y comparan en el navegador. No existe un servicio de comparación en el servidor y los archivos originales no se modifican.',
    },
    {
      q: '¿Cómo se relacionan las filas?',
      a: 'Solo por su número. Por ejemplo, la fila 12 del archivo A se compara con la fila 12 del archivo B. Por ello, insertar o mover una fila puede generar varias diferencias posteriores. Las columnas clave y la detección de filas movidas quedan fuera de este MVP.',
    },
    {
      q: '¿Qué ocurre si los nombres de las hojas no coinciden?',
      a: 'Solo se comparan nombres idénticos. Una hoja con otro nombre se muestra como exclusiva del archivo A o del archivo B. La herramienta no intenta deducir correspondencias entre nombres parecidos.',
    },
    {
      q: '¿Compara fórmulas y formatos?',
      a: 'Compara los valores de celda leídos del libro después de convertirlos en texto. No compara el texto de las fórmulas ni colores, fuentes, bordes o formatos numéricos.',
    },
    {
      q: '¿Se ejecutan las macros de los archivos XLSM?',
      a: 'No. Los XLSM solo se leen para compararlos. La herramienta no escribe ni combina ninguno de los libros.',
    },
    {
      q: '¿Puede aplicar o combinar las diferencias?',
      a: 'No. El resultado es solo de consulta. Combinar, aplicar cambios, editar, comparar tres o más archivos y asociar hojas manualmente no forman parte del alcance actual.',
    },
    {
      q: '¿Qué limita el tamaño de los libros?',
      a: 'No se establece un límite fijo de bytes. El navegador carga los libros en memoria, por lo que el tamaño utilizable depende de la memoria disponible y de la estructura de cada archivo.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que se ejecutan localmente en tu dispositivo.',
    colophon:
      'Desarrollado y mantenido por Geppetto. Parte del código cuenta con asistencia de IA; la revisión y las decisiones corresponden al mantenedor.',
    securityText: 'Seguridad',
  },
};
