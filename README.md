# laravel-elixir-phpcs

[![npm version](https://badge.fury.io/js/laravel-elixir-phpcs.svg)](https://badge.fury.io/js/laravel-elixir-phpcs)
[![Build Status](https://travis-ci.org/ponko2/laravel-elixir-phpcs.svg?branch=master)](https://travis-ci.org/ponko2/laravel-elixir-phpcs)

## Install

### Laravel Elixir >=3.0.0-0 <6.0.0-0

```sh
$ npm install laravel-elixir-phpcs --save-dev
$ composer require "squizlabs/php_codesniffer=*" --dev
```

### Laravel Elixir >=6.0.0-11

```sh
$ npm install laravel-elixir-phpcs@beta --save-dev
$ composer require "squizlabs/php_codesniffer=*" --dev
```

## Usage

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-phpcs');

elixir(function(mix) {
  mix.phpcs([
    'app/**/*.php',
    'tests/**/*.php'
  ], {
    bin: 'vendor/bin/phpcs',
    standard: 'PSR2'
  });
});
```
