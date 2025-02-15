# SteamHunters Plugin for Millennium

This plugin ports the functionality of the [SteamHunters website](https://steamhunters.com/) right into your Steam client using Millennium.
This includes things like achievement groups

## Features
- Achievement groups
- Achievement points
- A better achievements screen

TODO: Put actual images here
|                           Groups                           |                         Points                          |
|:----------------------------------------------------------:|:-------------------------------------------------------------:|
|       ![SteamDB store page](Images/steam_store.png)        |        ![SteamDB options](Images/steamdb_options.png)         |
|                **Store Achievement Groups**                |                **Personal Achievement Groups**                |
| ![Achievement groups](Images/store_achievement_groups.png) | ![Achievement groups](Images/personal_achievement_groups.png) |
|                       **Inventory**                        |                       **Inventory**                        |
| ![Inventory](Images/inventory.png)                         | ![Inventory](Images/inventory.png)                         |

## Installation
1. Ensure you have Millennium installed on your Steam client
2. Download the [latest release](https://github.com/tddebart/SteamHunter-plugin/releases/latest) of this plugin from GitHub or from the [Steambrew](https://steambrew.app/plugins) website
3. Place the plugin files in your Millennium plugins directory (should be a plugins folder in your Steam client directory)
4. Restart your Steam client
5. Enable the Achievement Groups plugin in the Millennium plugin menu
6. Right click steam on your taskbar and Click "Exit Steam" to make sure the plugin is fully loaded
7. Startup steam


## Usage

Once installed it should just work out of the box.
<br>
To see if the plugin is working click the View my achievements button on a game page and see that there is a new tab called `ACHIEVEMENT GROUPS`.
TODO: Put actual images here
![SteamDB icons](Images/steam_store.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Steps on how to set up the project

> It is recommended to put the plugin repository in your Steam plugins folder or make some symbolic links to the
> repository for easier development.

1. Clone the repository using `git clone https://github.com/tddebart/SteamHunter-plugin.git`
2. Run `bun install` or use your favorite package manager
3. Now you can run `bun watch` or `bun dev` to build the plugin and watch for changes

> Note: `bun dev` will only watch for changes in the webkit and frontend folder and the scss file, to reload the plugin just press `F5` in the steam client to reload
> For changes to the backend, you will need to fully restart the Steam client.

## Special thanks

- [SteamHunters website and their API](https://steamhunters.com/)
- [Millennium](https://github.com/shdwmtr/millennium)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
