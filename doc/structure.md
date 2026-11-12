# Struktura folderów projektu
## Foldery deweloperskie
- `schemas/` – Schematy plików JSON, które są używane jako ograniczone obiekty wewnątrz kodu.
- `scripts/` – Skrypty używane na zewnątrz programu zawierające odniesienia do paczki NodeCG. Aktualnie jedyny plik to `footpedal.ahk`.
- `src/` – Główny kod źródłowy projektu.
  - `browser/` – Pliki wykonywane po stronie klienta.
    - `dashboard/` – Pliki odpowiadające poszczególnym panelom pulpitu NodeCG.
    - `graphics/` – Pliki odpowiadające poszczególnym grafikom NodeCG.
    - Bez podfolderów – Pliki pomocnicze.
  - `extension/` – Pliki wykonywane po stronie serwera.
    - Bez podfolderów – Niezależne funkcje.
    - `lib/` – Moduły do wielokrotnego użytku.
    - `util/` – Pomniejsze moduły pomocnicze.
  - `types/` – Deklaracje własnych typów.
    - `custom/` – Bezpośrednie deklaracje typów.
    - `generated/` – Deklaracje typów wygenerowane na podstawie schematów z folderu `/schemas/`.
## Foldery budowane
- `dashboard/` – Skompilowane pliki HTML poszczególnych paneli pulpitu NodeCG.
- `extension/` – Skompilowane pliki JS wykonywane po stronie serwera.
- `graphics/` – Skompilowane pliki HTML poszczególnych grafik NodeCG.
## Foldery używane w trakcie działania programu
- `assets/` – Zewnętrzne, wgrywane pliki fundacji.
- `cfg/` – Pliki konfiguracyjne NodeCG. Obecnie tylko jeden plik: `gsps-layouts.json`.
- `db/` – Baza danych używana przez NodeCG.

# Project folder structure
## Development folders
- `schemas/` – JSON schemas of constrained objects used in the files.
- `scripts/` – External scripts containing references to this NodeCG bundle. Currently, the only one is `footpedal.ahk`.
- `src/` – Root folder of the project's source.
    - `browser/` – Files ran on the client's side.
        - `dashboard/` – Files corresponding to each NodeCG dashboard panel.
        - `graphics/` – Files corresponding to each NodeCG graphic.
        - Without subfolders – Auxiliary files.
    - `extension/` – Files ran on the server side.
      - Without subfolders – Independent features.
      - `lib/` – Reusable modules.
      - `util/` – Smaller helper modules.
    - `types/` – Custom type declarations.
## Built folders
- `dashboard/` – Compiled HTML files for each NodeCG dashboard panel.
- `extension/` – Compiled server-side JS files.
- `graphics/` – Compiled HTML files for each NodeCG graphic.
## Runtime folders
- `assets/` – External, uploaded foundation files.
- `cfg/` – NodeCG configuration files. Currently, there is only one file: `gsps-layouts.json`.
- `db/` – The database used by NodeCG.