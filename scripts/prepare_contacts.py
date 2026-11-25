import csv
import os
import re
import zipfile
import xml.etree.ElementTree as ET

DOCS_DIR = r"D:\Abel paginas\Jorge Reyes\drjorgereyes-main\public\docs"
CLEAN_CSV = os.path.join(DOCS_DIR, "contactos_limpios.csv")
REJECTED_CSV = os.path.join(DOCS_DIR, "contactos_rechazados.csv")

EMAIL_RE = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
EXTRACT_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")

COMMON_TYPOS = {
    "gmial.com", "gmal.com", "gamil.com", "gnail.com",
    "hotmal.com", "hotnail.com", "outlok.com", "yaho.com",
}

NAME_HEADER_HINTS = ("nombre", "nombres", "name", "firstname", "estudiante", "postulante", "persona")


def clean_first_name(raw_name: str) -> str:
    if not raw_name:
        return ""
    cleaned = re.sub(r"[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]", " ", raw_name).strip()
    parts = [p for p in cleaned.split() if len(p) > 1]
    if not parts:
        return ""
    return parts[0].capitalize()


def read_xlsx_rows(filepath: str) -> list[tuple[str, str]]:
    """Extract (email, first_name) pairs from an .xlsx file using sharedStrings + sheet XML."""
    results = []
    with zipfile.ZipFile(filepath, "r") as z:
        shared_strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            root = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in root.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                texts = [t.text or "" for t in si.findall(".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")]
                shared_strings.append("".join(texts))

        ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
        sheet_names = sorted(n for n in z.namelist() if n.startswith("xl/worksheets/sheet") and n.endswith(".xml"))
        for sname in sheet_names:
            root = ET.fromstring(z.read(sname))
            name_col_idx = None
            for row_idx, row in enumerate(root.findall(f".//{ns}row")):
                cells = {}
                for c in row.findall(f"{ns}c"):
                    ref = c.attrib.get("r", "")
                    col_letters = "".join(ch for ch in ref if ch.isalpha())
                    t = c.attrib.get("t", "")
                    v_el = c.find(f"{ns}v")
                    is_el = c.find(f"{ns}is")
                    val = ""
                    if t == "s" and v_el is not None and v_el.text is not None:
                        idx = int(v_el.text)
                        val = shared_strings[idx] if idx < len(shared_strings) else ""
                    elif t == "inlineStr" and is_el is not None:
                        val = "".join(x.text or "" for x in is_el.findall(f".//{ns}t"))
                    elif v_el is not None and v_el.text is not None:
                        val = v_el.text
                    cells[col_letters] = val.strip()

                if row_idx == 0 or name_col_idx is None:
                    for col, val in cells.items():
                        if any(h in val.lower() for h in NAME_HEADER_HINTS):
                            name_col_idx = col
                            break

                row_emails = []
                for col, val in cells.items():
                    row_emails.extend(EXTRACT_RE.findall(val))

                if row_emails:
                    fname = clean_first_name(cells.get(name_col_idx, "")) if name_col_idx else ""
                    for em in row_emails:
                        results.append((em, fname))
    return results


def read_xls_fallback(filepath: str) -> list[tuple[str, str]]:
    with open(filepath, "rb") as fp:
        text = fp.read().decode("latin1", errors="ignore")
    return [(em, "") for em in EXTRACT_RE.findall(text)]


def main():
    seen = {}  # email -> (firstname, origin)
    rejected = []

    for filename in sorted(os.listdir(DOCS_DIR)):
        if filename in ("contactos_limpios.csv", "contactos_rechazados.csv"):
            continue
        filepath = os.path.join(DOCS_DIR, filename)
        if not os.path.isfile(filepath):
            continue

        if filename.lower().endswith(".xlsx"):
            pairs = read_xlsx_rows(filepath)
        else:
            pairs = read_xls_fallback(filepath)

        for raw_email, fname in pairs:
            email = raw_email.strip().lower().rstrip(".")
            if not EMAIL_RE.match(email):
                rejected.append((email, filename, "formato_invalido"))
                continue
            domain = email.split("@", 1)[1]
            if domain in COMMON_TYPOS:
                rejected.append((email, filename, f"typo_dominio:{domain}"))
                continue
            if email not in seen:
                seen[email] = (fname, filename)
            elif not seen[email][0] and fname:
                seen[email] = (fname, seen[email][1])

    with_name = sum(1 for fname, _ in seen.values() if fname)

    with open(CLEAN_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["EMAIL", "FIRSTNAME", "ORIGEN"])
        for email, (fname, origin) in sorted(seen.items()):
            writer.writerow([email, fname, origin])

    with open(REJECTED_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["EMAIL", "ORIGEN", "MOTIVO"])
        for row in rejected:
            writer.writerow(row)

    print(f"Contactos limpios y unicos: {len(seen)}")
    print(f"Contactos con FIRSTNAME: {with_name}")
    print(f"Contactos rechazados: {len(rejected)}")
    print(f"Archivo generado: {CLEAN_CSV}")


if __name__ == "__main__":
    main()
