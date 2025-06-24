# gsps-layouts

## PL

> Zestaw grafik użytych podczas speedrunningowych wydarzeń charytatywnych Gramy Szybko, Pomagamy Skutecznie.

*Te grafiki są stworzone do użycia z [NodeCG](https://nodecg.dev); jeśli nie wiesz co to jest, zalecamy zapoznać się z podaną wcześniej stroną po więcej informacji.*

***Ta dokumentacja nie jest w pełni gotowa i może zawierać błędy, ale powinna być wystarczająco poprawna aby być użyta jako instrukcja instalacji i użytkowania.***

### Instalacja

Będziesz potrzebować [Node.js](https://nodejs.org) (przetestowane z wersją 18.x LTS i 22.x LTS) i [git](https://git-scm.com/), aby zainstalować ten zestaw grafik.

Sklonuj główną gałąź z submodułami, zainstaluj zależności i zbuduj kod:
> ```
> git clone https://github.com/GramyPomagamy/gsps-layouts.git --recurse-submodules
> npm install
> npm run build
> ```


Plik `configschema.json` pomoże ci w utworzeniu pliku konfiguracyjnego. Ten plik możesz potem dodać do folderu `cfg`.

Grafiki GSPSowe polegają na wtyczce [obs-websocket](https://github.com/Palakis/obs-websocket) (zawartej w OBSie 28 i wyżej!), więc upewnij się że masz tą wtyczkę zainstalowaną (niestandarowy adres/port oraz hasło można podać w konfiguracji).

#### Odtwarzacz muzyki

Grafiki GSPSowe mogą sterować odtwarzaczem [foobar2000](https://www.foobar2000.org/) przy użyciu wtyczki [beefweb](https://github.com/hyperblast/beefweb). Ustaw foobara tak jak chcesz, upewnij się że odpowiedni adres jest podany w konfiguracji, i wtedy grafiki automatycznie wyciszą/odciszą muzykę w odpowiednim momencie. Muzyka tylko będzie odciszona jeśli nazwa obecnej scena w OBSie kończy się (domyślnie) z `[Muzyka]`, np. `Przerwa [Muzyka]`. Słowo kluczowe jest do zmiany w konfiguracji.

### Inne informacje

#### Wydarzenia, gdzie te grafiki były użyte

Lista wydarzeń, gdzie te grafiki zostały użyte. Sortowane od najnowszych:

* [GSPS 2024](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p2NPsAsGtnJfOcb5bY8aXBn)
* [GSPS Dzieciom 2024](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p1Y-QZsbsfIcFZ3llvJXugW)
* [GSPS 2023](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p0lkfN3_onIoWp6CfBWh4LU)
* [GSPS Dzieciom 2023](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p2LDj2IoU907heue-t72Y9U)
* [GSPS 2022](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p3FaeZkwWjWhadn6F8J0aeW)
* [GSPS Dzieciom 2022](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p3448rkWwvfWORn5gFD8S-2)

## EN

> The graphics used during Gramy Szybko, Pomagamy Skutecznie charity speedrunning marathon events.

*This is a bundle for [NodeCG](https://nodecg.dev); if you do not understand what that is, we advise you read their website first for more information.*

***This documentation isn't fully complete and may have errors, but should be correct enough for install and usage purposes.***

### Installation

You will need [Node.js](https://nodejs.org) (18.x LTS and 22.x LTS tested) and [git](https://git-scm.com/) installed to install these graphics.

Clone the main branch of this repository with it's submodules, install the dependencies and build the code:
> ```
> git clone https://github.com/GramyPomagamy/gsps-layouts.git --recurse-submodules
> npm install
> npm run build
> ```



Refer to the `configschema.json` file for how the configuration file is supposed to look like, and add it to the `cfg` directory.

This bundle relies on the [obs-websocket](https://github.com/Palakis/obs-websocket) plugin (included in OBS 28 and higher!), so make sure you have this installed (custom address/port and password can be specified in the bundle's config if needed).

#### Music Player

This bundle can interface with [foobar2000](https://www.foobar2000.org/) using the [beefweb](https://github.com/hyperblast/beefweb) plugin. Set up foobar2000 however you want it to play music, make sure the correct address is set in the configuration file, and this bundle will automatically mute/unmute music when needed. It will only play if the scene name ends in (by default) `[Muzyka]`, for example, `Przerwa [Muzyka]`. The keyword is customizable in the configuration file.

### Other Information

#### Events Used For

Here's a list of events this bundle has been used at so far, most recent first:

* [GSPS 2024](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p2NPsAsGtnJfOcb5bY8aXBn)
* [GSPS Dzieciom 2024](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p1Y-QZsbsfIcFZ3llvJXugW)
* [GSPS 2023](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p0lkfN3_onIoWp6CfBWh4LU)
* [GSPS Dzieciom 2023](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p2LDj2IoU907heue-t72Y9U)
* [GSPS 2022](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p3FaeZkwWjWhadn6F8J0aeW)
* [GSPS Dzieciom 2022](https://www.youtube.com/playlist?list=PLGZ-4E5LK_p3448rkWwvfWORn5gFD8S-2)

