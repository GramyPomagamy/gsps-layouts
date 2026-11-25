# Instalacja layoutów GSPS
1. Zainstaluj [node.js](https://nodejs.org/en/download) (w wersji v22 LTS) oraz [git](https://git-scm.com/install/), jeżeli jeszcze ich nie masz.
2. Sklonuj repozytorium razem z submodułami:
   ```
   git clone https://github.com/GramyPomagamy/gsps-layouts.git --recurse-submodules
   ```
   Lub jeżeli łączysz się z GitHubem przez SSH:
   ```
   git clone git@github.com:GramyPomagamy/gsps-layouts.git --recurse-submodules
   ```
3. Wejdź do sklonowanego repozytorium, zainstaluj zależności i zbuduj kod:
   ```
   cd gsps-layouts && npm install && npm run build
   ```
	- W szczególności zignoruj linijkę `72 vulnerabilities (8 low, 18 moderate, 40 high, 6 critical)` XD, ten kod to pierdolnik, do którego rzeczy ciągle są dodawane, a nie są usuwane, ogarnięcie tego jest na to-do-liście.
4. Zapoznaj się z plikiem `configschema.json` oraz [tym poradnikiem](./config.md), żeby wiedzieć, jak ma wyglądać plik konfiguracyjny `gsps-layouts.json`. Stwórz go i dodaj do folderu `cfg/`.
5. Ten zestaw komunikuje się z OBS Studio przy użyciu wtyczki `obs-websocket`. Od wersji 28.0 wtyczka jest zawarta domyślnie, więc jeżeli taką posiadasz, to nie musisz nic robić.
Po wyżej wymienionych krokach serwer layoutów powinien się uruchomić po wykonaniu polecenia `npm run start`. Jeżeli chcesz w trakcie runtime'u automatycznie wykrywać i stosować zmiany w plikach, musisz w osobnym terminalu równolegle wykonać polecenie `npm run watch`.
## Troubleshooting instalacji
- Warto się upewnić, że używamy właściwej wersji node.js (`node -v`), parę razy się na to nadziałem. Dotyczy to zarówno instalacji, jak i wykonywania.
# Installation of GSPS layouts
1. Install [node.js](https://nodejs.org/en/download) (in version v22 LTS) and [git](https://git-scm.com/install/) if you don't have them yet.
2. Clone the repository with its submodules:
   ```
   git clone https://github.com/GramyPomagamy/gsps-layouts.git --recurse-submodules
   ```
   Or if you reach GitHub via SSH:
   ```
   git clone git@github.com:GramyPomagamy/gsps-layouts.git --recurse-submodules
   ```
3. Enter the cloned repository, install dependencies and build the code:
   ```
   cd gsps-layouts && npm install && npm run build
   ```
	- Ignore the line `72 vulnerabilities (8 low, 18 moderate, 40 high, 6 critical)` in particular lmao, XD, this code is such a mess where things keep getting added but not removed, cleaning that up is on the to-do-list.
4. Refer to the `configschema.json` file and [this guide](./config.md) for how the configuration file is supposed to look like. Add the newly created `gsps-layouts.json` file to `cfg/` repository.
5. This bundle communicates with OBS Studio via `obs-websocket` add-on. This add-on is included by default in versions 28.0 and higher, so if you have one of these versions, you don't have to do anything.
After the aforementioned steps the layout server should launch after executing the command `npm run start`. If you want to automatically detect and apply changes in files during runtime, you need to run the command `npm run watch` in parallel, in a separate terminal.
## Installation troubleshooting
- It's worth checking if we use the correct version of node.js (`node -v`), I got caught into that a couple of times. This applies to both installation and usage.