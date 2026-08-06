import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Excel-Dateien Zelle für Zelle im Browser vergleichen — ohne Upload | runlocally',
    description:
      'Vergleiche zwei XLSX-, XLSM- oder XLS-Arbeitsmappen nach Blattname, Zeilennummer und Spaltenposition. Unterschiede bleiben im Browser.',
    ogTitle: 'Excel-Arbeitsmappen Zelle für Zelle vergleichen — ohne Upload',
    ogDescription:
      'Finde abweichende Zellwerte in zwei Excel-Arbeitsmappen direkt im Browser. Die Dateien bleiben auf deinem Gerät.',
  },

  hero: {
    h1: 'Excel-Arbeitsmappen vergleichen',
    tagline:
      'Zwei XLSX-, XLSM- oder XLS-Dateien nach Blattname und Zellposition vergleichen. Es findet kein Upload statt.',
  },

  intro: {
    h2: 'Ein auf Zellwerte begrenzter Arbeitsmappenvergleich',
    paras: [
      'Nach der Auswahl von zwei Excel-Arbeitsmappen vergleicht das Werkzeug ausschließlich Tabellenblätter mit identischem Namen. Innerhalb dieser Blätter werden Zeilen nach ihrer Nummer und Zellen nach ihrer Spaltenposition zugeordnet. Angezeigt werden nur abweichende Zellen sowie die Zahl übereinstimmender Zeilen und abweichender Zellen je Blatt.',
      'Dieses MVP wandelt gelesene Zellwerte für den Vergleich in Text um. Zahlenformate, Farben, Schriftarten, Rahmen, Spaltenbreiten, Kommentare und andere Formatierungen bleiben unberücksichtigt. Blätter, die nur in einer Datei vorkommen, werden getrennt aufgeführt und nicht anhand ähnlicher Namen zugeordnet.',
    ],
  },

  privacy: {
    h2: 'Arbeitsmappendaten bleiben im Browser',
    lead:
      'Beide Dateien werden auf deinem Gerät gelesen. Es gibt weder einen Upload-Schritt noch eine serverseitige Verarbeitung der Arbeitsmappen.',
    points: [
      'Einlesen und Vergleich der Arbeitsmappen laufen im Browser.',
      'Die zwei ausgewählten Dateien werden nur gelesen; die Originale bleiben unverändert.',
      'JSON- und CSV-Exporte enthalten das Vergleichsergebnis, keine zusammengeführte Arbeitsmappe.',
      'Der Quellcode ist unter der MIT-Lizenz einsehbar.',
    ],
    note:
      'Im Netzwerk-Panel des Browsers lässt sich während des Vergleichs prüfen, dass keine Anfrage eine der Arbeitsmappen überträgt.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'Zwei Arbeitsmappen vergleichen',
    steps: [
      {
        h3: 'Datei A und Datei B auswählen',
        p: 'Wähle auf jeder Seite eine XLSX-, XLSM- oder XLS-Arbeitsmappe. Alternativ kannst du genau zwei Arbeitsmappen auf der Seite ablegen.',
      },
      {
        h3: 'Gleichnamige Blätter vergleichen',
        p: 'Starte den Vergleich. Blätter mit identischem Namen werden an denselben Zeilen- und Spaltenpositionen geprüft.',
      },
      {
        h3: 'Abweichungen prüfen oder exportieren',
        p: 'Sieh dir geänderte Zellen an, filtere die Liste und exportiere das Ergebnis bei Bedarf als JSON oder CSV.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Werden meine Excel-Dateien hochgeladen?',
      a: 'Nein. Beide Arbeitsmappen werden im Browser eingelesen und verglichen. Es gibt keinen serverseitigen Vergleichsdienst, und die Originaldateien werden nicht verändert.',
    },
    {
      q: 'Wie werden Zeilen zugeordnet?',
      a: 'Die Zuordnung erfolgt ausschließlich nach Zeilennummer. Zeile 12 in Datei A wird also mit Zeile 12 in Datei B verglichen. Eine eingefügte oder verschobene Zeile kann dadurch mehrere Abweichungen auslösen. Schlüsselspalten und verschobene Zeilen sind nicht Teil dieses MVP.',
    },
    {
      q: 'Was geschieht bei unterschiedlichen Blattnamen?',
      a: 'Nur identische Blattnamen werden verglichen. Ein anders benanntes Blatt erscheint als ausschließlich in Datei A oder Datei B vorhanden. Eine vermutete Zuordnung ähnlicher Namen findet nicht statt.',
    },
    {
      q: 'Werden Formeln und Formatierungen verglichen?',
      a: 'Verglichen werden die aus der Arbeitsmappe gelesenen und in Text umgewandelten Zellwerte. Formeltext sowie Farben, Schriftarten, Rahmen und Zahlenformate werden nicht verglichen.',
    },
    {
      q: 'Werden Makros aus XLSM-Dateien ausgeführt?',
      a: 'Nein. XLSM-Dateien werden nur für den Vergleich gelesen. Das Werkzeug schreibt und verbindet keine Arbeitsmappen.',
    },
    {
      q: 'Kann das Werkzeug Unterschiede zusammenführen?',
      a: 'Nein. Das Ergebnis dient nur zur Ansicht. Zusammenführen, Patchen, Bearbeiten, Vergleiche mit mindestens drei Dateien und eine manuelle Blattzuordnung gehören nicht zum aktuellen Umfang.',
    },
    {
      q: 'Welche Größenbegrenzung gilt?',
      a: 'Es gibt keine festgelegte Byte-Grenze. Da der Browser beide Arbeitsmappen in den Speicher liest, hängt die nutzbare Größe vom verfügbaren Gerätespeicher und vom Aufbau der Arbeitsmappen ab.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Werkzeuge, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Bei Teilen des Codes kam KI-Unterstützung zum Einsatz; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },

  related: {
    h2: 'Ähnliche Tools',
    blogLinkText: 'Technische Hintergründe lesen',
  },
};
