# Embracing Chaos With Code — A workshop for Birmingham Design Festival 2022

This repository contains the starter code for a workshop at [Birmingham Design Festival](https://birminghamdesignfestival.org.uk/whats-on/events/embracing-chaos-with-code/).

>**Warning**
>This workshop will contain flashing lights and motion. It involves manipulating pixels on the canvas, resulting in lots of changing colours and movement. If you are sensitive to either of these then _please_ let me know beforehand, and I can see if we can adapt the workshop on the day to tone things down.

## Getting Started

### On your device

To get started on your device, you will need the following:

1. A Text Editor installed. I would recommend [VSCode](https://code.visualstudio.com). If you do use VSCode, you should be prompted to install a handful of extensions the first time you open this project (if you don't already have them). Please do so, as they will be helpful for working with this code.
2. A node installation of `v16`. If you are using [nvm](https://github.com/nvm-sh/nvm), please run `nvm use` in this projects root, to automatically use a compatible version.

Once you've got these, clone this repository and run:

```bash
npm install
npm run dev
```

And to see the completed sketch for reference, please checkout the `complete` git branch.

### On CodeSandbox

I've also setup a CodeSandbox for this code, which will allow you to run the project in a web browser without having to install any software using the below links:

1. [Incomplete sketch](https://codesandbox.io/s/bdf-workshop-chaos-code-ysnvon?file=/src/main.ts) (to start with)
2. [Complete sketch](https://codesandbox.io/s/bdf-workshop-chaos-code-complete-rpsd1x?file=/src/main.ts) (for reference)

Though please be aware that—at the time of writing—CodeSandbox doesn't infer types for JSON module imports like VSCode or other local dev servers do. As a result, there will be a handful of annoying type errors in the `main.ts` file when working with the project. You should be safe to ignore any red squiggly lines under colour-related variables or functions, as they are not runtime issues.

## Project setup

This project is a simple vanilla javascript app, built and bundled with vite. The canvas2d renderer is adapted form another project of mine. Feel free to take a look at it to see how things work under the hood, but for the purposes of our session we only really care about the `src/main.ts` file.

### Typescript

This repo is written in TypeScript, but for the purposes of the workshop we wont be writing any Typescript-specific syntax so don't worry if you aren't experienced with it. Typescript should only tell you when there are potential issues in the code, and hopefully won't get in the way too much. If it does, just let me know :)

## Resources

Some of my fave resources if anyone is interested in learning more about creative coding:

-   [The Book of Shaders](https://thebookofshaders.com/)
-   [The Coding Train](https://www.youtube.com/user/shiffman)
-   [Sebastian Lague](https://www.youtube.com/channel/UCmtyQOKKmrMVaKuRXz02jbQ)
-   [Jamie Wong](http://jamie-wong.com/)
-   [Three.js Fundamentals](https://threejsfundamentals.org/)
-   [WebGL Fundamentals](https://webglfundamentals.org/) / [WebGL2 Fundamentals](https://webgl2fundamentals.org/)
-   [Inigo Quilez's blog](https://iquilezles.org/)
-   [Electric Square's Raymarching workshop](https://github.com/electricsquare/raymarching-workshop)
-   [Luigi De Rosa's list of case studies on WebGL and creative code](https://github.com/luruke/awesome-casestudy)

## License

This repo is [MIT Licensed](https://github.com/neefrehman/bdf-workshop-chaos-code/blob/main/LICENSE).
