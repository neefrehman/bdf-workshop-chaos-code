# Embracing Chaos With Code — A workshop for Birmingham Design Festival 2022

This repository contains the starter code for a workshop at [Birmingham Design Festival](https://birminghamdesignfestival.org.uk/whats-on/events/embracing-chaos-with-code/).

>**Warning**
>This workshop will contain flashing lights and motion. It involves manipulating pixels on the canvas, resulting in lots of changing colours and movement. If you are sensitive to either of these then _please_ let me know beforehand, and I can see if we can adapt the workshop on the day to tone things down.

## Prerequisites

1. A Text Editor installed. I would recommend [VSCode](https://code.visualstudio.com). If you do use VSCode, you should be prompted to install a handful of extensions the first time you open this project (if you don't already have them). Please do so, as they will be helpful for working with this code.
2. A node installation of `v16`. If you are using [nvm](https://github.com/nvm-sh/nvm), please run `nvm use` in this projects root, to automatically use a compatible version.

## Getting Started

To get started on your device, clone this repo and run:

```bash
npm install
npm run dev
```

Let me know if you run into any problems and I can try to help you out.

## Project setup

This project is a simple vanilla javascript app, built and bundled with vite. The canvas2d renderer is adapted form another project of mine. Feel free to take a look at it to see how things work under the hood, but for the purposes of our session we only really care about the `src/sketches/sketch.ts.ts` file.

### Typescript

This repo is written in TypeScript, but for the purposes of the workshop we wont be writing any Typescript-specific syntax so don't worry if you aren't experienced with it. Typescript should only tell you when there are potential issues in the code, and hopefully won't get in the way too much. If it does, just let me know :)

## License

This repo is [MIT Licensed](https://github.com/neefrehman/bdf-workshop-chaos-code/blob/main/LICENSE).
