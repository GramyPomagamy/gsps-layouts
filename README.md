# gsps-layouts

## PL

> Zestaw grafik użytych podczas speedrunningowych wydarzeń charytatywnych Gramy Szybko, Pomagamy Skutecznie.

*Te grafiki są stworzone do użycia z [NodeCG](https://nodecg.dev); jeśli nie wiesz co to jest, zalecany zapoznać się z podaną wcześniej stroną po więcej informacji.*

***Ta dokumentacja nie jest w pełni gotowa i może zawierać błędy, ale powinna być wystarczająco poprawna aby być użyta jako instrukcja instalacji i użytkowania.***

Jest to zestaw grafik dla [NodeCG](https://nodecg.dev) v1.8.1. Dodatkowo musisz jeszcze zainstalować [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol).

### Instalacja

Będziesz potrzebować [Node.js](https://nodejs.org) (przetestowane z wersją 16.x LTS) i [git](https://git-scm.com/), aby zainstalować NodeCG. [Dokumentacja NodeCG](https://www.nodecg.dev/docs/installing) powie ci jak zainstalować NodeCG. Dodatkowo sugerujemy zainstalowanie `nodecg-cli`; informacje jak to zrobić są też w podanym właśnie linku (***komendy podane niżej zakładają że nodecg-cli jest zainstalowane!***).

Potem, sklonuj gałąż `build` tego repozytorium do folderu `bundles` NodeCG i zainstaluj wymagane zależności:
> ```
> cd bundles
> git clone https://github.com/gramypomagamy/gsps-layouts.git --branch build
> cd gsps-layouts
> npm install --production
> ```

Będziesz też potrzebować domyślnego pliku konfiguracyjnego, który możesz stworzyć używając:
> `nodecg defaultconfig`

Na koniec, zainstaluj [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) przy użyciu `nodecg-cli`:
> ```
> cd ..
> nodecg install speedcontrol/nodecg-speedcontrol
> ```

Grafiki GSPSowe polegają na wtyczce [obs-websocket](https://github.com/Palakis/obs-websocket), więc upewnij się że masz tą wtyczkę zainstalowaną (niestandarowy adres/port oraz hasło można podać w konfiguracji).

#### Odtwarzacz muzyki

Grafiki GSPSowe mogą sterować odtwarzaczem [foobar2000](https://www.foobar2000.org/) przy użyciu wtyczki [beefweb](https://github.com/hyperblast/beefweb). Ustaw foobara tak jak chcesz, upewnij się że odpowiedni adres jest podany w konfiguracji, i wtedy grafiki automatycznie wyciszą/odciszą muzykę w odpowiednim momencie. Muzyka tylko będzie odciszona jeśli nazwa obecnej scena w OBSie kończy się (domyślnie) z `[Muzyka]`, np. `Przerwa [Muzyka]`. Słowo kluczowe jest do zmiany w konfiguracji.

### Inne informacje

#### Wydarzenia, gdzie te grafiki były użyte

Lista wydarzeń, gdzie te grafiki zostały użyte. Sortowane od najnowszych:

* GSPS Dzieciom 2022

## EN

> The graphics used during Gramy Szybko, Pomagamy Skutecznie charity speedrunning marathon events.

*This is a bundle for [NodeCG](https://nodecg.dev); if you do not understand what that is, we advise you read their website first for more information.*

***This documentation isn't fully complete and may have errors, but should be correct enough for install and usage purposes.***

This is a [NodeCG](https://nodecg.dev) v1.8.1 bundle. Additionally you need to install the [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol) bundle.

### Installation

You will need [Node.js](https://nodejs.org) (16.x LTS tested) and [git](https://git-scm.com/) installed to install NodeCG, then see the [NodeCG documentation](https://www.nodecg.dev/docs/installing) on how to install it. Installing `nodecg-cli` is also suggested; information on that is also on the documentation just linked (**the commands below will assume you have installed nodecg-cli!**).

Afterwards, clone the `build` branch of this repository into the NodeCG `bundles` folder and install the dependencies:
> ```
> cd bundles
> git clone https://github.com/gramypomagamy/gsps-layouts.git --branch build
> cd gsps-layouts
> npm install --production
> ```

You will probably also want a default configuration you can fill in, which can be created using:
> `nodecg defaultconfig`

Then, to get [nodecg-speedcontrol](https://github.com/speedcontrol/nodecg-speedcontrol), install it using `nodecg-cli`:
> ```
> cd ..
> nodecg install speedcontrol/nodecg-speedcontrol
> ```

This bundle relies on the [obs-websocket](https://github.com/Palakis/obs-websocket) plugin, so make sure you have this installed (custom address/port and password can be specified in the bundle's config if needed).

#### Music Player

This bundle can interface with [foobar2000](https://www.foobar2000.org/) using the [beefweb](https://github.com/hyperblast/beefweb) plugin. Set up foobar2000 however you want it to play music, make sure the correct address is set in the configuration file, and this bundle will automatically mute/unmute music when needed. It will only play if the scene name ends in (by default) `[Muzyka]`, for example, `Przerwa [Muzyka]`. The keyword is customizable in the configuration file.

### Other Information

#### Events Used For

Here's a list of events this bundle has been used at so far, most recent first:

* GSPS Dzieciom 2022
