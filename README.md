# Undoc

[![NPM version](https://img.shields.io/npm/v/undoc)](https://www.npmjs.com/package/undoc)

A smart document generator for used methods in node project.

## Setup

Make sure to install the dependencies:

```bash
pnpm add undoc -g
```

Start server ( under target node project dir )

```bash
undoc
```

Server will start at port 3000, open the browser and view `127.0.0.1:3000`.

Undoc use indexedDB to cache repo markdown file content, please use the latest version of chrome / firefox.

## Features

- Monorepo workspace dependencies
- Custom repo doc filepath parser
- Dynamic server port
- More lib doc support
- Friendly ui
- Current project info overview
- Homepage link
- Manual refresh npm / repo doc info
- Get version from locale node_modules

## License
[MIT](./LICENSE)
