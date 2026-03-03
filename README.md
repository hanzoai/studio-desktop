# Hanzo Studio Desktop

[![codecov](https://codecov.io/github/hanzo-studio/electron/graph/badge.svg?token=S64WJWD2ZX)](https://codecov.io/github/hanzo-studio/electron)
![Beta](https://img.shields.io/badge/beta-blue.svg)

# USER GUIDE

Please read the [user guide](https://docs.studio.hanzo.ai/installation/desktop)

# Download

Windows (NVIDIA) NSIS x64: [Download](https://download.studio.hanzo.ai/windows/nsis/x64)

macOS ARM: [Download](https://download.studio.hanzo.ai/mac/dmg/arm64)

# Overview

This desktop app is a packaged way to use [Hanzo Studio](https://github.com/hanzoai/Hanzo Studio) and comes bundled with a few things:

- Stable version of Hanzo Studio from [releases](https://github.com/hanzoai/Hanzo Studio/releases)
- [studio-frontend](https://github.com/hanzo-studio/studio-frontend)
- [Hanzo Studio-Manager](https://github.com/ltdrdata/Hanzo Studio-Manager)
- [uv](https://github.com/astral-sh/uv)

On startup, it will install all the necessary python dependencies with uv and start the Hanzo Studio server. The app will automatically update with stable releases of Hanzo Studio, Hanzo Studio-Manager, and the uv executable as well as some desktop specific features.

Developers, read on.

## Installed Files

### Electron

The desktop application comes bundled with:

- Hanzo Studio source code
- Hanzo Studio-Manager
- Electron, Chromium binaries, and node modules

**Windows**

We use the [NSIS installer](https://www.electron.build/nsis.html) for Windows and it will install files in these locations:

Bundled Resources: `%APPDATA%\Local\Programs\hanzo-studio-electron`

![screenshot of resources directory](https://github.com/user-attachments/assets/0e1d4a9a-7b7e-4536-ad4b-9e6123873706)

User files are stored here: `%APPDATA%\Hanzo Studio`

Automatic Updates: `%APPDATA%\Local\hanzo-studio-electron-updater`

**macOS**

The macOS application is distributed as a [DMG](https://www.electron.build/dmg) and will install files in:

`~/Library/Application Support/Hanzo Studio`

The application will be dragged into `/Applications`

**Linux**

`~/.config/Hanzo Studio`

### Hanzo Studio

You will also be asked to select a location to store Hanzo Studio files like models, inputs, outputs, custom_nodes and saved workflows. This directory is stored in the `basePath` key of `config.json`.

On Windows: `%APPDATA%\Hanzo Studio\config.json`

On macOS: `~/Library/Application Support/Hanzo Studio/config.json`

On Linux: `~/.config/Hanzo Studio/config.json`

#### Model Paths

This directory is also written as the `base_path` in `extra_models_config.yaml`. The Desktop app will look for model checkpoints here by default, but you can add additional models to the search path by editing this file.

On Windows: `%APPDATA%\Hanzo Studio\extra_models_config.yaml`

On macOS: `~/Library/Application Support/Hanzo Studio/extra_models_config.yaml`

On Linux: `~/.config/Hanzo Studio/extra_models_config.yaml`

### Logs

We use electron-log to log everything. Electron main process logs are in `main.log`, and Hanzo Studio server logs are in `hanzo-studio_<date>.log`.

```
on Linux: ~/.config/{app name}/logs
on macOS: ~/Library/Logs/{app name}
on Windows: %AppData%\{app name}\logs
```

# Development

## Setup Python

Make sure you have python 3.12+ installed. It is recommended to setup a virtual environment.

Linux/MacOS:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```powershell
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
```

## Windows

### Visual Studio

Visual studio 2019 or later with the Desktop C++ workload is required for `node-gyp`. See the `node-gyp` [windows installation notes](https://github.com/nodejs/node-gyp#on-windows). Also requires the `spectre-mitigated` libraries, found in the individual components section of the VS installer.

Confirmed working:

- Visual Studio Community 2022 - 17.12.1
- Desktop development with C++ workload
- MSVC v143 x64 spectre-mitigated libraries (Latest / v14.42-17.12)
  - Open the Visual Studio Installer
  - Click "Modify" on your Visual Studio 2022 Community installation
  - Go to the "Individual Components" tab
  - Search for "Spectre"
  - Check the boxes for the Spectre-mitigated libraries that match your project's architecture (x86 and/or x64)
  - ![image](https://github.com/user-attachments/assets/0829db3d-84b7-48e8-9d13-c72c35169a05)

Look for "MSVC v143 - VS 2022 C++ x64/x86 Spectre-mitigated libs"
If you're using other toolsets, you may need their corresponding Spectre-mitigated libraries as well

## NPM Dependencies

### Node

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage node versions. This project uses node v20.x.

#### Windows

Microsoft recommends [nvm-windows](https://github.com/coreybutler/nvm-windows) on their [Node.js on Windows page](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows#install-nvm-windows-nodejs-and-npm).

```ps1
nvm install 20
nvm use 20
```

### pnpm

This project uses `pnpm` as its package manager. Install it via corepack or npm:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

Then install dependencies:

```bash
pnpm install
```

## Hanzo Studio Assets

Before you can start the electron application, you need to download the Hanzo Studio source code and other things that are usually bundled with the application.

### Hanzo Studio and other dependencies

First, initialize the application resources by running `pnpm make:assets`:

This command will install Hanzo Studio and Hanzo Studio-Manager under `assets/`. The exact versions of each package is defined in `package.json`.

You can then run `start` to build and launch the app. A watcher will also be started; it will automatically rebuild the app when a source file is changed:

```bash
deactivate # Deactivate your existing python env to avoid influencing the
pnpm start
```

You can also build the package and/or distributables using the `make` command:

```bash
# build the platform-dependent package and any distributables
pnpm make
# build cross-platform, e.g. windows from linux
pnpm make --windows
```

### Compiled Requirements

The `requirements.compiled` file is a pre-compiled requirements file that is used to install the dependencies for the application. It is generated by the `comfy-cli`.

You can generate the compiled requirements files by running the following commands from the project root directory:

#### Windows

```powershell
## Nvidia Cuda requirements
uv pip compile assets\Hanzo Studio\requirements.txt assets\Hanzo Studio\custom_nodes\Hanzo Studio-Manager\requirements.txt --emit-index-annotation --emit-index-url --index-strategy unsafe-best-match -o assets\requirements\windows_nvidia.compiled --override assets\override.txt `
--index-url https://pypi.org/simple `
--extra-index-url https://download.pytorch.org/whl/cu129

## CPU requirements
uv pip compile assets\Hanzo Studio\requirements.txt assets\Hanzo Studio\custom_nodes\Hanzo Studio-Manager\requirements.txt --emit-index-annotation --emit-index-url --index-strategy unsafe-best-match -o assets\requirements\windows_cpu.compiled `
--index-url https://pypi.org/simple
```

#### macOS

```bash
## macOS requirements
uv pip compile assets/Hanzo Studio/requirements.txt assets/Hanzo Studio/custom_nodes/Hanzo Studio-Manager/requirements.txt --emit-index-annotation --emit-index-url --index-strategy unsafe-best-match -o assets/requirements/macos.compiled --override assets/override.txt \
--index-url https://pypi.org/simple
```

### Troubleshooting

If you get an error similar to:

```
The module '/electron/node_modules/node-pty/build/Release/pty.node' was compiled against a different Node.js version using NODE_MODULE_VERSION 115. This version of Node.js requires NODE_MODULE_VERSION 125. Please try re-compiling or re-installing the module (for instance, using `npm rebuild` or `npm install`).
```

You will need to rebuild the node-pty using [electron-rebuild](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules), for example:

```
npx electron-rebuild
```

or if that fails

```
pnpm add -D @electron/rebuild
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
npx electron-rebuild
```

#### Missing libraries

You may get errors reporting that the build is unable to find e.g. `libnss3.so` if `electron` prerequisites are not included in your distro. Find the correct package for your distro and install.

`apt` example:

```
apt-get install libnss3
```

### Debugger

There are helpful debug launch scripts for VSCode / Cursor under `.vscode/launch.json`. The default launch script runs the Electron launcher in the project root and attaches the debugger. By default, the app is not built when this is used.

The default launch script can be run by pressing `F5` in VSCode or VSCode derivative. `Ctrl + Shift + F5` restarts the app with the debugger attached. `Shift + F5` terminates the debugger and the process tree it is attached to.

To keep the app built and up to date as you make changes, run the `Start Vite Build Watchers` build task defined in `.vscode/tasks.json`. This spawns two watcher tasks - one for the main app, and one for the preload script. These watchers will automatically rebuild the app when a source file is changed.

The launch environment can be customised, e.g. add a `"linux"` section to source your `~/.profile` (and other interactive config) when debugging in linux:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "linux": { "options": { "shell": { "args": ["-ci"] } } }
    }
  ]
}
```

### Troubleshooting the packaged app

When the app has been packaged for use as a production app, it ignores environment variables used to configure development settings. To force the app to read env vars when packaged, use the `--dev-mode` command line argument to launch the app.

# Release

We use Todesktop to build and codesign our distributables. To make a new release:

1. Create a PR that updates package.json to the next version.
1. Create a Github Release with semantic version tag eg. "v1.0.0"
1. Make sure it is a pre-release.
1. Check the Github action "Publish All" runs. It should update the release body with Download links when it is finished.
1. Test the build, and if it looks good release it on ToDesktop. Also mark the release as "Latest".

If a build fails for some reason, you can manually retry by running the "Publish All" GH action with a release tag as input.

## Release using Claude Code

There is a Claude Code command, "bump-stable", that can be used to automate the release process.

## Updating uv compiled requirements

Applying the "Update Compiled Requirements" label to an open PR will automatically update compiled requirements. If changes are made, the action commits the updated files to the PR.

## Utility scripts

A number of utility scripts are defined under the "scripts" field of package.json. For example, to clean up the build artifacts you can run:

```bash
pnpm clean

# Remove files created by pnpm make:assets
pnpm clean:assets

# clean:slate also removes node_modules
pnpm clean:slate
```

## Crash Reports & Metrics

At the onboarding step, you can opt-in to send us usage metrics. This really helps us prioritize issues and focus our limited engineering time. Read our privacy policy [here](https://studio.hanzo.ai/privacy).

You can opt-out at anytime from the settings menu and nothing will ever be sent.

In either case, no personal data, workflows or logs will be sent.
