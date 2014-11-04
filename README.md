# laravel-elixir-phpcs

## Install

```sh
$ npm install laravel-elixir-phpcs --save-dev
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
