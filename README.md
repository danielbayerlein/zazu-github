# zazu-github

> [Zazu](https://github.com/tinytacoteam/zazu) plugin to search for GitHub repositories with [github.com](https://github.com).
> The GitHub API rate limit allows you to make up to 10 requests per minute.

[![Build Status](https://travis-ci.org/danielbayerlein/zazu-github.svg?branch=master)](https://travis-ci.org/danielbayerlein/zazu-github)
[![codecov](https://codecov.io/gh/danielbayerlein/zazu-github/branch/master/graph/badge.svg)](https://codecov.io/gh/danielbayerlein/zazu-github)
[![Greenkeeper badge](https://badges.greenkeeper.io/danielbayerlein/zazu-uptime.svg)](https://greenkeeper.io/)

## Usage

To search GitHub repositories simply type `gh` then the name of the repository to search for.
For example `gh preact`.

![screenshot](./screenshot.png)

## Install

Add `danielbayerlein/zazu-github` inside of `plugins` block of your `~/.zazurc.json` file.

```json
{
  "plugins": [
    "danielbayerlein/zazu-github"
  ]
}
```

## License

Copyright (c) 2017 Daniel Bayerlein. See [LICENSE](./LICENSE.md) for details.
